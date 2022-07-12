const metaplex = require('@metaplex/js')
const solanaWeb3 = require('@solana/web3.js')
const splToken = require("@solana/spl-token")
const nacl = require('tweetnacl')
const { serialize } = require('borsh')
const bs58 = require('bs58')
const BN = require('bn.js')
const {
  AUCTION_SCHEMA,
  AmountRange,
  SAFETY_DEPOSIT_BOX_SCHEMA,
  SafetyDepositConfig,
  SetAuthorityArgs,
  EmptyPaymentAccountArgs,
  SetWhitelistedCreatorArgs,
  ValidateSafetyDepositBoxV2Args,
  WHITELIST_CREATOR_SCHEMA,
  EMPTY_PAYMENT_ACCOUNT_SCHEMA,
  metaplexConfirm,
  toPublicKey,
  CreateMint,
  CreateAssociatedTokenAccount,
  MintTo
} = require('./consts')
const { toLamports } = require('../utils')
const { sleep } = require('../../utils')

module.exports.buildSolanaTransferTransaction = async function ({
  from,
  to,
  token,
  amount,
  latestBlock,
  decimals,
  testnet
}) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  })

  if (token === "SOL") {
    manualTransaction.add(solanaWeb3.SystemProgram.transfer({
      fromPubkey: fromAccount.publicKey,
      toPubkey: to,
      lamports: toLamports(amount).toNumber(),
    }))
  } else {
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl(network),
      'confirmed',
    )

    const tokenProgram = new splToken.Token(connection, toPublicKey(token), splToken.TOKEN_PROGRAM_ID, fromAccount)
    const senderTokenAccount = await tokenProgram.getOrCreateAssociatedAccountInfo(fromAccount.publicKey)
    const receiverTokenAccount = await tokenProgram.getOrCreateAssociatedAccountInfo(toPublicKey(to))

    manualTransaction.add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        senderTokenAccount.address,
        receiverTokenAccount.address,
        fromAccount.publicKey,
        [],
        toLamports(amount, Number(decimals)).toNumber()
      )
    )
  }

  let transactionBuffer = manualTransaction.serializeMessage()
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey)
  manualTransaction.addSignature(fromAccount.publicKey, signature)

  let isVerifiedSignature = manualTransaction.verifySignatures()
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('hex')

  return rawTransaction
}

module.exports.deploySolanaToken = async function ({ from, to = from.publicKey, amount, fixedSupply, testnet = true, decimals = 9 }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl(network),
    'confirmed',
  )

  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  const toAccount = toPublicKey(to)

  const mint = await splToken.Token.createMint(
    connection,
    fromAccount,
    fromAccount.publicKey,
    null,
    decimals,
    splToken.TOKEN_PROGRAM_ID,
  )

  const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    toAccount
  )

  await mint.mintTo(
    toTokenAccount.address,
    fromAccount.publicKey,
    [],
    new splToken.u64(amount * 10 ** decimals),
  )

  if (fixedSupply) {
    const transaction = new solanaWeb3.Transaction().add(
      splToken.Token.createSetAuthorityInstruction(
        splToken.TOKEN_PROGRAM_ID,
        mint.publicKey,
        null,
        "MintTokens",
        fromAccount.publicKey,
        []
      )
    )
    await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [fromAccount])
  }
  return mint.publicKey.toBase58()
}

module.exports.mintSolanaToken = async function ({ from, to = from.publicKey, token, amount, latestBlock, testnet = true }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(network), 'confirmed',)

  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  const toAccount = toPublicKey(to)
  const tokenProgram = new splToken.Token(connection, toPublicKey(token), splToken.TOKEN_PROGRAM_ID, fromAccount)

  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  })
  const toTokenAccount = await tokenProgram.getOrCreateAssociatedAccountInfo(
    toAccount
  )
  manualTransaction.add(
    splToken.Token.createMintToInstruction(
      splToken.TOKEN_PROGRAM_ID,
      tokenProgram.publicKey,
      toTokenAccount.address,
      fromAccount.publicKey,
      [],
      amount
    )
  )

  let transactionBuffer = manualTransaction.serializeMessage()
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey)
  manualTransaction.addSignature(fromAccount.publicKey, signature)

  let isVerifiedSignature = manualTransaction.verifySignatures()
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  return Buffer.from(manualTransaction.serialize()).toString('hex')
}

module.exports.deploySolanaCollection = async function ({ from, name, symbol, uri, testnet = true }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(solanaWeb3.clusterApiUrl(network))
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))

  const mint = solanaWeb3.Keypair.generate()
  const mintRent = await connection.getMinimumBalanceForRentExemption(splToken.MintLayout.span)

  const createMintTx = new CreateMint({ feePayer: toPublicKey(wallet.publicKey) }, {
    newAccountPubkey: mint.publicKey,
    lamports: mintRent,
  })
  const recipient = await splToken.Token.getAssociatedTokenAddress(
    splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, mint.publicKey, toPublicKey(wallet.publicKey)
  )

  const createAssociatedTokenAccountTx = new CreateAssociatedTokenAccount({ feePayer: toPublicKey(wallet.publicKey) }, {
    associatedTokenAddress: recipient,
    splTokenMintAddress: mint.publicKey,
  })

  const mintToTx = new MintTo({ feePayer: toPublicKey(wallet.publicKey) }, {
    mint: mint.publicKey,
    dest: recipient,
    amount: 1,
  })

  const metadataPDA = await metaplex.programs.metadata.Metadata.getPDA(mint.publicKey)
  const createMetadataTx = new metaplex.programs.metadata.CreateMetadataV2({ feePayer: toPublicKey(wallet.publicKey) }, {
    metadata: metadataPDA,
    metadataData: new metaplex.programs.metadata.DataV2({
      name,
      symbol,
      uri,
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    }),
    updateAuthority: toPublicKey(wallet.publicKey),
    mint: mint.publicKey,
    mintAuthority: toPublicKey(wallet.publicKey),
  })

  let tx = metaplex.programs.core.Transaction.fromCombined([
    createMintTx,
    createMetadataTx,
    createAssociatedTokenAccountTx,
    mintToTx,
  ], { feePayer: wallet.publicKey })
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

  tx.partialSign(mint)
  tx = await wallet.signTransaction(tx)
  return { rawTransaction: tx.serialize().toString('hex'), collection: mint.publicKey.toBase58() }

}

module.exports.deploySolanaNFT = async function ({
  from, maxSupply, uri, name, symbol, amount, creators = null, royaltiesFee = 0, collection = null, testnet = true
}) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(solanaWeb3.clusterApiUrl(network))
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const nftMint = solanaWeb3.Keypair.generate()
  const mintRent = await connection.getMinimumBalanceForRentExemption(splToken.MintLayout.span)
  // Creates mint
  const createNftMintTx = new CreateMint({ feePayer: toPublicKey(wallet.publicKey) }, {
    newAccountPubkey: nftMint.publicKey,
    lamports: mintRent,
  })
  const nftRecipient = await splToken.Token.getAssociatedTokenAddress(
    splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, nftMint.publicKey, toPublicKey(wallet.publicKey)
  )
  // Create mint's recipient account
  const createAssociatedNftTokenAccountTx = new CreateAssociatedTokenAccount({ feePayer: toPublicKey(wallet.publicKey) }, {
    associatedTokenAddress: nftRecipient,
    splTokenMintAddress: nftMint.publicKey,
  })
  // Actually mints
  const mintNftToTx = new MintTo({ feePayer: toPublicKey(wallet.publicKey) }, {
    mint: nftMint.publicKey,
    dest: nftRecipient,
    amount: maxSupply > 0 ? 1 : amount,
  })
  let parsedCreators = []
  if (creators) {
    creators.forEach(creator => {
      parsedCreators.push(
        new metaplex.programs.metadata.Creator({
          address: creator.address,
          share: creator.share,
          verified: creator.verified,
        })
      )
    })
  }
  // Creates metadata
  const nftMetadataPDA = await metaplex.programs.metadata.Metadata.getPDA(nftMint.publicKey)
  const createNftMetadataTx = new metaplex.programs.metadata.CreateMetadataV2({ feePayer: toPublicKey(wallet.publicKey) }, {
    metadata: nftMetadataPDA,
    metadataData: new metaplex.programs.metadata.DataV2({
      name,
      symbol,
      uri,
      sellerFeeBasisPoints: royaltiesFee * 10,
      creators: creators ? parsedCreators : null,
      collection: collection ? new metaplex.programs.metadata.Collection({
        key: collection,
        verified: false,
      }) : null,
      uses: null,
    }),
    updateAuthority: toPublicKey(wallet.publicKey),
    mint: nftMint.publicKey,
    mintAuthority: toPublicKey(wallet.publicKey),
  })

  const transactions = [
    createNftMintTx,
    createNftMetadataTx,
    createAssociatedNftTokenAccountTx,
    mintNftToTx
  ]
  if (maxSupply > 0) {
    const editionPDA = await metaplex.programs.metadata.MasterEdition.getPDA(nftMint.publicKey)
    // Creates Master Edition info
    transactions.push(new metaplex.programs.metadata.CreateMasterEditionV3({ feePayer: toPublicKey(wallet.publicKey) }, {
      edition: editionPDA,
      metadata: nftMetadataPDA,
      updateAuthority: toPublicKey(wallet.publicKey),
      mint: nftMint.publicKey,
      mintAuthority: toPublicKey(wallet.publicKey),
      maxSupply: new BN(maxSupply),
    }))
  }

  let tx = metaplex.programs.core.Transaction.fromCombined(transactions, { feePayer: wallet.publicKey })
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
  tx.partialSign(nftMint)
  tx = await wallet.signTransaction(tx)
  // let txHash = await connection.sendRawTransaction(tx.serialize().toString(), { skipPreflight: false })
  return { rawTransaction: tx.serialize().toString('hex'), mint: nftMint.publicKey.toBase58(), metadata: nftMetadataPDA.toBase58() }
}

module.exports.mintEdition = async function ({ masterEdition, from, testnet = true }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(solanaWeb3.clusterApiUrl(network))
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))

  const masterEditionMint = toPublicKey(masterEdition)

  const mintResponse = await metaplex.actions.mintEditionFromMaster({
    connection,
    wallet,
    masterEditionMint,
    updateAuthority: wallet.publicKey
  })

  return (mintResponse.txId)
}

module.exports.buildSolanaTokenBurnTransaction = async function ({
  from,
  token,
  amount,
  latestBlock,
  testnet = true
}) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))

  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  })
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl(network),
    'confirmed',
  )

  const tokenProgram = new splToken.Token(connection, toPublicKey(token), splToken.TOKEN_PROGRAM_ID, fromAccount)
  const tokenAccount = await tokenProgram.getOrCreateAssociatedAccountInfo(toPublicKey(fromAccount.publicKey))

  manualTransaction.add(
    splToken.Token.createBurnInstruction(
      splToken.TOKEN_PROGRAM_ID,
      tokenProgram.publicKey,
      tokenAccount.address,
      fromAccount.publicKey,
      [],
      amount
    )
  )

  let transactionBuffer = manualTransaction.serializeMessage()
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey)
  manualTransaction.addSignature(fromAccount.publicKey, signature)

  let isVerifiedSignature = manualTransaction.verifySignatures()
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('hex')

  return rawTransaction
}


module.exports.updateMetaplexMetadata = async function ({ token, from, uri, testnet = true }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(solanaWeb3.clusterApiUrl(network))
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))

  const editionMint = toPublicKey(token)
  const { name, symbol, seller_fee_basis_points, properties: { creators }, } = await metaplex.utils.metadata.lookup(uri)
  const creatorsData = creators.reduce((memo, { address, share }) => {
    const verified = address === wallet.publicKey.toString()
    const creator = new metaplex.programs.metadata.Creator({
      address,
      share,
      verified,
    })
    memo = [...memo, creator]
    return memo
  }, [])
  const newMetadataData = new metaplex.programs.metadata.MetadataDataData({
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: seller_fee_basis_points,
    creators: creatorsData,
  })
  const newMetadataResponse = await metaplex.actions.updateMetadata(
    {
      connection,
      wallet,
      editionMint,
      newMetadataData
    }
  )

  return (newMetadataResponse)
}

module.exports.buildSolanaCustomProgramInteraction = async function ({
  from,
  programId,
  data,
  keys,
  latestBlock,
}) {
  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))

  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  })

  manualTransaction.add(
    new solanaWeb3.TransactionInstruction({
      keys,
      programId,
      data
    })
  )

  let transactionBuffer = manualTransaction.serializeMessage()
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey)
  manualTransaction.addSignature(fromAccount.publicKey, signature)

  let isVerifiedSignature = manualTransaction.verifySignatures()
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('hex')

  return rawTransaction
}

module.exports.createTokenVault = async function ({ testnet, from }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const externalPriceAccountData = await metaplex.actions.createExternalPriceAccount({ connection: new metaplex.Connection(network, "confirmed"), wallet })
  await metaplexConfirm(network, externalPriceAccountData.txId)
  const response = await metaplex.actions.createVault({
    connection: new metaplex.Connection(network, "confirmed"),
    wallet,
    priceMint: splToken.NATIVE_MINT,
    externalPriceAccount: externalPriceAccountData.externalPriceAccount
  })
  return ({ ...response })
}

module.exports.addTokenToVault = async function ({ testnet, vault, token, from }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  const tokenProgram = new splToken.Token(new metaplex.Connection(network, "confirmed"), toPublicKey(token), splToken.TOKEN_PROGRAM_ID, fromAccount)
  const tokenAccount = await tokenProgram.getOrCreateAssociatedAccountInfo(toPublicKey(from.publicKey))
  await metaplexConfirm(network, vault.txId)
  const response = await metaplex.actions.addTokensToVault({
    connection: new metaplex.Connection(network, "confirmed"),
    wallet,
    vault: vault.vault,
    nfts: [{
      tokenAccount: tokenAccount.address, tokenMint: toPublicKey(token),
      amount: new BN(1)
    }]
  })
  return ({
    txId: response.safetyDepositTokenStores[0].txId,
    metadata: response.safetyDepositTokenStores[0].tokenAccount.toBase58(),
    tokenStore: response.safetyDepositTokenStores[0].tokenStoreAccount.toBase58()
  })
}

module.exports.activateVault = async function ({ testnet, vault, from }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const activateResponse = await metaplex.actions.closeVault(({
    connection: new metaplex.Connection(network, "confirmed"),
    wallet,
    vault: toPublicKey(vault),
    priceMint: splToken.NATIVE_MINT
  }))
  await metaplexConfirm(network, activateResponse.txId)
  return ({ ...activateResponse })
}

module.exports.createStore = async function ({ testnet, from }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const store = await metaplex.actions.initStoreV2({ connection, wallet, isPublic: true })
  await metaplexConfirm(network, store.txId)
  return ({ ...store })
}

module.exports.createAuction = async function ({ testnet, from, vault, tickSize, endAuctionGap, endAuctionAt, gapTickSizePercentage, minumumPrice }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const auctionSettings = {
    instruction: 1,
    tickSize,
    auctionGap: endAuctionGap,
    endAuctionAt,
    gapTickSizePercentage,
    winners: new metaplex.programs.auction.WinnerLimit({
      type: metaplex.programs.auction.WinnerLimitType.Capped,
      usize: new BN(1),
    }),
    tokenMint: splToken.NATIVE_MINT.toBase58(),
    priceFloor: minumumPrice ?
      new metaplex.programs.auction.PriceFloor({ type: metaplex.programs.auction.PriceFloorType.Minimum, minPrice: minumumPrice }) :
      new metaplex.programs.auction.PriceFloor({ type: metaplex.programs.auction.PriceFloorType.None }),
  }
  const auction = await metaplex.actions.initAuction({ connection, wallet, vault: toPublicKey(vault), auctionSettings })
  await metaplexConfirm(network, auction.txId)
  return { ...auction }
}

module.exports.createAuctionAuthority = async function ({ testnet, from, vault, store, auction }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const auctionManagerPDA = await metaplex.programs.metaplex.AuctionManager.getPDA(toPublicKey(auction))
  const newTokenTracker = await metaplex.programs.metaplex.AuctionWinnerTokenTypeTracker.getPDA(auctionManagerPDA)
  const rentExempt = await new metaplex.Connection(network, "confirmed").getMinimumBalanceForRentExemption(splToken.AccountLayout.span)
  const createAccountTx = new solanaWeb3.Transaction({ feePayer: wallet.publicKey })
  const account = solanaWeb3.Keypair.generate()
  createAccountTx.add(solanaWeb3.SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: account.publicKey,
    lamports: rentExempt,
    space: splToken.AccountLayout.span,
    programId: splToken.TOKEN_PROGRAM_ID
  }))
  createAccountTx.add(splToken.Token.createInitAccountInstruction(
    splToken.TOKEN_PROGRAM_ID,
    toPublicKey('So11111111111111111111111111111111111111112'),
    account.publicKey,
    auctionManagerPDA,
  ))
  const createAccountTxResponse = await new metaplex.Connection(network, "confirmed").sendTransaction(createAccountTx, [wallet.payer, account])
  await metaplexConfirm(network, createAccountTxResponse)
  const tx = new metaplex.programs.metaplex.InitAuctionManagerV2({ feePayer: toPublicKey(from.publicKey) }, {
    vault: toPublicKey(vault),
    auction: toPublicKey(auction),
    store: toPublicKey(store),
    auctionManager: auctionManagerPDA,
    auctionManagerAuthority: toPublicKey(from.publicKey),
    acceptPaymentAccount: account.publicKey,
    tokenTracker: newTokenTracker,
    amountType: metaplex.programs.core.TupleNumericType.U8,
    lengthType: metaplex.programs.core.TupleNumericType.U8,
    maxRanges: new BN(10)
  })

  const txResponse = await new metaplex.Connection(network, "confirmed").sendTransaction(tx, [wallet.payer])
  await metaplexConfirm(network, txResponse)

  return {
    hash: txResponse,
    auctionManager: auctionManagerPDA.toBase58(),
    tokenTracker: newTokenTracker.toBase58(),
    acceptPaymentAccount: account.publicKey.toBase58()
  }
}

module.exports.updateAuctionAuthority = async function ({ testnet, from, auction, auctionManager, latestBlock }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  })

  const auctionProgramId = 'auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8'
  const data = Buffer.from(serialize(AUCTION_SCHEMA, new SetAuthorityArgs()))
  const keys = [
    {
      pubkey: toPublicKey(auction),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(from.publicKey),
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(auctionManager),
      isSigner: false,
      isWritable: false,
    },
  ]
  manualTransaction.add(
    new solanaWeb3.TransactionInstruction({
      keys,
      programId: toPublicKey(auctionProgramId),
      data: data,
    })
  )
  let transactionBuffer = manualTransaction.serializeMessage()
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey)
  manualTransaction.addSignature(fromAccount.publicKey, signature)

  let isVerifiedSignature = manualTransaction.verifySignatures()
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('base64')
  const tx = await new metaplex.Connection(network, "confirmed").sendEncodedTransaction(rawTransaction)
  await metaplexConfirm(network, tx)
  return tx
}

module.exports.updateVaultAuthority = async function ({ testnet, from, vault, auctionManager, latestBlock }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  })

  const vaultProgramId = 'vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn'
  const data = Buffer.from([10])
  const keys = [
    {
      pubkey: toPublicKey(vault),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(from.publicKey),
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(auctionManager),
      isSigner: false,
      isWritable: false,
    },
  ]
  manualTransaction.add(
    new solanaWeb3.TransactionInstruction({
      keys,
      programId: toPublicKey(vaultProgramId),
      data: data,
    })
  )
  let transactionBuffer = manualTransaction.serializeMessage()
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey)
  manualTransaction.addSignature(fromAccount.publicKey, signature)

  let isVerifiedSignature = manualTransaction.verifySignatures()
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('base64')
  const tx = await new metaplex.Connection(network, "confirmed").sendEncodedTransaction(rawTransaction)
  await metaplexConfirm(network, tx)
  return tx
}

module.exports.whitelistCreators = async function ({ testnet, from, mint, store, latestBlock }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const creators = (await metaplex.programs.metadata.Metadata.findByMint(connection, mint)).data.data.creators
  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  const metaplexProgramId = 'p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98'

  for (let i = 0; i < creators.length; i++) {
    let creator = creators[i].address;
    let whitelistedCreatorPDA = await metaplex.programs.metaplex.WhitelistedCreator.getPDA(toPublicKey(store), creator)
    let manualTransaction = new solanaWeb3.Transaction({
      recentBlockhash: latestBlock.toString(),
      feePayer: fromAccount.publicKey
    });
    let data = Buffer.from(serialize(WHITELIST_CREATOR_SCHEMA, new SetWhitelistedCreatorArgs({ activated: true })));
    let keys = [
      {
        pubkey: toPublicKey(whitelistedCreatorPDA),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: fromAccount.publicKey,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: fromAccount.publicKey,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: toPublicKey(creator),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: toPublicKey(store),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: solanaWeb3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: solanaWeb3.SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ];
    manualTransaction.add(
      new solanaWeb3.TransactionInstruction({
        keys,
        programId: toPublicKey(metaplexProgramId),
        data: data,
      })
    )
    let transactionBuffer = manualTransaction.serializeMessage();
    let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey)
    manualTransaction.addSignature(fromAccount.publicKey, signature)

    let isVerifiedSignature = manualTransaction.verifySignatures()
    if (!isVerifiedSignature)
      throw new Error('Signatures are not valid.')

    let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('base64')
    const sentTx = await connection.sendEncodedTransaction(rawTransaction)
    await metaplexConfirm(network, sentTx)
    return sentTx
  }
}

module.exports.validateAuction = async function ({ testnet, from, latestBlock, vault, nft, store, metadata, tokenStore, tokenTracker }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const storeId = await metaplex.programs.metaplex.Store.getPDA(wallet.publicKey)
  const auctionPDA = await metaplex.programs.auction.Auction.getPDA(vault)
  const auctionManagerPDA = await metaplex.programs.metaplex.AuctionManager.getPDA(auctionPDA)
  const loadedVault = await metaplex.programs.vault.Vault.load(connection, vault)
  const sdb = await loadedVault.getSafetyDepositBoxes(connection)

  const whitelistedCreator = await metaplex.programs.metaplex.WhitelistedCreator.getPDA(toPublicKey(store), wallet.publicKey)

  const safetyDepositConfigKey = await metaplex.programs.metaplex.SafetyDepositConfig.getPDA(
    auctionManagerPDA,
    sdb[0].pubkey,
  )
  const edition = await metaplex.programs.metadata.Edition.getPDA(toPublicKey(nft))
  const originalAuthority = await solanaWeb3.PublicKey.findProgramAddress([
    Buffer.from('metaplex'),
    auctionPDA.toBuffer(),
    toPublicKey(metadata).toBuffer(),
  ],
    toPublicKey('p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98'))

  const safetyDepositConfigArgs = new SafetyDepositConfig({
    key: 9,
    auctionManager: solanaWeb3.SystemProgram.programId.toBase58(),
    order: new BN(0),
    winningConfigType: 3,
    amountType: metaplex.programs.core.TupleNumericType.U8,
    lengthType: metaplex.programs.core.TupleNumericType.U8,
    amountRanges: [new AmountRange({ amount: new BN(1), length: new BN(1) })],
    participationConfig: null,
    participationState: null,
  })
  const value = new ValidateSafetyDepositBoxV2Args(safetyDepositConfigArgs)
  const data = Buffer.from(serialize(SAFETY_DEPOSIT_BOX_SCHEMA, value))

  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  })

  const keys = [
    {
      pubkey: toPublicKey(safetyDepositConfigKey),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(tokenTracker),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: auctionManagerPDA,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(metadata),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: originalAuthority[0],
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: whitelistedCreator,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: storeId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: sdb[0].pubkey,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(tokenStore),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(nft),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: edition,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(vault),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: wallet.publicKey,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: wallet.publicKey,
      isSigner: true,
      isWritable: false,
    },

    {
      pubkey: wallet.publicKey,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: toPublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: solanaWeb3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: solanaWeb3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ]

  manualTransaction.add(
    new solanaWeb3.TransactionInstruction({
      keys,
      programId: toPublicKey('p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98'),
      data,
    })
  )
  let transactionBuffer = manualTransaction.serializeMessage()
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey)
  manualTransaction.addSignature(fromAccount.publicKey, signature)

  let isVerifiedSignature = manualTransaction.verifySignatures()
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')


  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('base64')
  const sentTx = await connection.sendEncodedTransaction(rawTransaction)
  await metaplexConfirm(network, sentTx)
  return sentTx
}

module.exports.startAuction = async function ({ testnet, from, store, auction, auctionManager }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const tx = new metaplex.programs.metaplex.StartAuction({ feePayer: toPublicKey(from.publicKey) },
    {
      store: toPublicKey(store),
      auction: toPublicKey(auction),
      auctionManager: toPublicKey(auctionManager),
      auctionManagerAuthority: wallet.publicKey
    })
  const txResponse = await connection.sendTransaction(tx, [wallet.payer])
  await metaplexConfirm(network, txResponse)
  return txResponse
}

module.exports.placeBid = async function ({ testnet, from, auction, amount }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const bid = await metaplex.actions.placeBid({
    connection,
    wallet,
    amount: new BN(amount),
    auction: toPublicKey(auction),
  })
  await metaplexConfirm(network, bid.txId)
  return { ...bid }
}

module.exports.instantSalePurchase = async function ({ testnet, from, store, auction }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const bid = await metaplex.actions.instantSale({
    connection,
    wallet,
    store: toPublicKey(store),
    auction: toPublicKey(auction),
  })
  return {
    bidTx: bid[0],
    redeemTx: bid[1],
    claimTx: bid[2]
  }
}

module.exports.cancelBid = async function ({ testnet, from, auction, bidderPotToken }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const bid = await metaplex.actions.cancelBid({
    connection,
    wallet,
    auction: toPublicKey(auction),
    bidderPotToken: toPublicKey(bidderPotToken),
  })
  await metaplexConfirm(network, bid.txId)
  return { ...bid }
}

module.exports.finishAuction = async function ({ testnet, from, auction, store, auctionManager, vault, auctionManagerAuthority }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const auctionExtended = await metaplex.programs.auction.AuctionExtended.getPDA(toPublicKey(vault))
  const tx = new metaplex.programs.metaplex.EndAuction({ feePayer: toPublicKey(wallet.publicKey) }, {
    store: toPublicKey(store),
    auctionManager: toPublicKey(auctionManager),
    auctionManagerAuthority: toPublicKey(auctionManagerAuthority),
    auction: toPublicKey(auction),
    auctionExtended
  })
  const txResponse = await connection.sendTransaction(tx, [wallet.payer])
  await metaplexConfirm(network, txResponse)
  return txResponse
}

module.exports.redeemAuction = async function ({ testnet, from, auction, store }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const redeem = await metaplex.actions.redeemPrintingV2Bid({ connection, wallet, store: toPublicKey(store), auction: toPublicKey(auction) })
  await metaplexConfirm(network, redeem.txId)
  return { ...redeem }
}

module.exports.claimWinnings = async function ({ testnet, from, auction, store, bidderPotToken }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const claim = await metaplex.actions.claimBid({ connection, wallet, auction: toPublicKey(auction), store: toPublicKey(store), bidderPotToken: toPublicKey(bidderPotToken) })
  await metaplexConfirm(network, claim.txId)
  return { ...claim }
}

module.exports.emptyPaymentAccount = async function ({ testnet, latestBlock, from, auction, store, creatorIndex, creatorAddress }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  const auctionManager = await metaplex.programs.metaplex.AuctionManager.getPDA(auction)
  const manager = await metaplex.programs.metaplex.AuctionManager.load(connection, auctionManager)
  const vault = await metaplex.programs.vault.Vault.load(connection, manager.data.vault)
  const [safetyDepositBox] = await vault.getSafetyDepositBoxes(connection)
  const tokenTracker = await metaplex.programs.metaplex.AuctionWinnerTokenTypeTracker.getPDA(auctionManager)
  const safetyDepositConfig = await metaplex.programs.metaplex.SafetyDepositConfig.getPDA(auctionManager, safetyDepositBox.pubkey)
  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  })

  const value = new EmptyPaymentAccountArgs({
    winningConfigIndex: 0,
    winningConfigItemIndex: 0,
    creatorIndex,
  })
  const tokenProgram = new splToken.Token(
    connection, toPublicKey('So11111111111111111111111111111111111111112'), splToken.TOKEN_PROGRAM_ID, fromAccount
  )
  const associatedTokenAccount = await tokenProgram.getOrCreateAssociatedAccountInfo(toPublicKey(creatorAddress))
  const payoutTicket = (await solanaWeb3.PublicKey.findProgramAddress([
    Buffer.from('metaplex'),
    auctionManager.toBuffer(),
    // WinningConfig
    Buffer.from('0'),
    // WinningConfigItemIndex
    Buffer.from('0'),
    Buffer.from(
      creatorIndex !== null && creatorIndex !== undefined
        ? creatorIndex.toString()
        : 'auctioneer',
    ),
    toPublicKey(safetyDepositBox.pubkey).toBuffer(),
    toPublicKey(creatorAddress).toBuffer(),
  ],
    toPublicKey('p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98')
  ))[0]

  const data = Buffer.from(serialize(EMPTY_PAYMENT_ACCOUNT_SCHEMA, value))
  const keys = [
    {
      pubkey: toPublicKey(manager.data.acceptPayment),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(associatedTokenAccount.address),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(auctionManager),
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: payoutTicket,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(fromAccount.publicKey),
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: await metaplex.programs.metadata.Metadata.getPDA(safetyDepositBox.data.tokenMint),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: await metaplex.programs.metadata.MasterEdition.getPDA(safetyDepositBox.data.tokenMint),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(safetyDepositBox.pubkey),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(store),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(manager.data.vault),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: toPublicKey(auction),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: toPublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: solanaWeb3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: solanaWeb3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },

    {
      pubkey: toPublicKey(tokenTracker),
      isSigner: false,
      isWritable: false,
    },

    {
      pubkey: toPublicKey(safetyDepositConfig),
      isSigner: false,
      isWritable: false,
    },
  ]
  manualTransaction.add(
    new solanaWeb3.TransactionInstruction({
      keys,
      programId: toPublicKey('p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98'),
      data,
    })
  )
  let transactionBuffer = manualTransaction.serializeMessage()
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey)
  manualTransaction.addSignature(fromAccount.publicKey, signature)

  let isVerifiedSignature = manualTransaction.verifySignatures()
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('base64')
  return await connection.sendEncodedTransaction(rawTransaction)
}

module.exports.createInstantSaleAuction = async function ({ testnet, from, price, vault }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const auctionSettings = {
    instruction: 7,
    tickSize: null,
    auctionGap: null,
    endAuctionAt: null,
    gapTickSizePercentage: null,
    winners: new metaplex.programs.auction.WinnerLimit({
      type: metaplex.programs.auction.WinnerLimitType.Capped,
      usize: new BN(1),
    }),
    tokenMint: splToken.NATIVE_MINT.toBase58(),
    instantSalePrice: new BN(price),
    priceFloor: new metaplex.programs.auction.PriceFloor({ type: metaplex.programs.auction.PriceFloorType.Minimum, minPrice: new BN(price) })
  }

  const auctionKey = await metaplex.programs.auction.Auction.getPDA(vault)
  const auctionExtended = await metaplex.programs.auction.AuctionExtended.getPDA(vault)
  const fullSettings = new metaplex.programs.auction.CreateAuctionArgs(Object.assign(Object.assign({}, auctionSettings), { authority: from.publicKey, resource: vault }))
  const tx = new metaplex.programs.auction.CreateAuctionV2(
    { feePayer: toPublicKey(wallet.publicKey) },
    {
      args: fullSettings,
      auction: auctionKey,
      creator: wallet.publicKey,
      auctionExtended,
    }
  )
  const txResponse = await connection.sendTransaction(tx, [wallet.payer])
  return {
    txId: txResponse,
    auction: auctionKey
  }
}

async function sendSolanaTxWithRetry(func, params, tries = 0) {
  if (tries > 20)
    throw new Error("Maximum retries attempted")
  try {
    let attemptedTxResponse = await func(params)
    return attemptedTxResponse
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      await sleep(1000)
      return await sendSolanaTxWithRetry(func, params, tries + 1)
    } else {
      throw error
    }
  }
}

module.exports.sendSolanaTxWithRetry = sendSolanaTxWithRetry

module.exports.listAuctions = async function ({ testnet, authority }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const auctionResponse = await metaplex.programs.auction.Auction.findMany(connection, { authority: toPublicKey(authority) })
  const list = new Map
  auctionResponse.map(e => {
    list.set(e.pubkey.toBase58(), e.data)
  })
  return list
}

module.exports.inspectAuction = async function ({ testnet, auction }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const auctionResponse = (await metaplex.programs.auction.Auction.load(connection, toPublicKey(auction))).toJSON()
  return auctionResponse
}