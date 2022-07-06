const metaplex = require('@metaplex/js');
const solanaWeb3 = require('@solana/web3.js');
const splToken = require("@solana/spl-token");
const nacl = require('tweetnacl');
const { serialize } = require('borsh')
const bs58 = require('bs58');
const BN = require('bn.js');
const { default: axios } = require('axios');
const {
  AUCTION_SCHEMA,
  AmountRange,
  SAFETY_DEPOSIT_BOX_SCHEMA,
  SafetyDepositConfig,
  SetAuthorityArgs,
  SetWhitelistedCreatorArgs,
  ValidateSafetyDepositBoxV2Args,
  WHITELIST_CREATOR_SCHEMA,
  metaplexConfirm,
  toPublicKey
} = require('./consts');
const { toLamports } = require('../utils');

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
  });

  if (token === "SOL") {
    manualTransaction.add(solanaWeb3.SystemProgram.transfer({
      fromPubkey: fromAccount.publicKey,
      toPubkey: to,
      lamports: toLamports(amount).toNumber(),
    }));
  } else {
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl(network),
      'confirmed',
    );

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
    );
  }

  let transactionBuffer = manualTransaction.serializeMessage();
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey);
  manualTransaction.addSignature(fromAccount.publicKey, signature);

  let isVerifiedSignature = manualTransaction.verifySignatures();
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('hex');

  return rawTransaction
}

module.exports.deploySolanaToken = async function ({ from, to = from.publicKey, amount, fixedSupply, testnet = true, decimals = 9 }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl(network),
    'confirmed',
  );

  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  const toAccount = toPublicKey(to)

  const mint = await splToken.Token.createMint(
    connection,
    fromAccount,
    fromAccount.publicKey,
    null,
    decimals,
    splToken.TOKEN_PROGRAM_ID,
  );

  const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    toAccount
  );

  await mint.mintTo(
    toTokenAccount.address,
    fromAccount.publicKey,
    [],
    new splToken.u64(amount * 10 ** decimals),
  );

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
    );

    await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [fromAccount])
  }

  return mint.publicKey.toBase58()
}

module.exports.mintSolanaToken = async function ({ from, to = from.publicKey, token, amount, latestBlock, testnet = true }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl(network),
    'confirmed',
  );

  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  const toAccount = toPublicKey(to)
  const tokenProgram = new splToken.Token(connection, toPublicKey(token), splToken.TOKEN_PROGRAM_ID, fromAccount)

  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  });

  const toTokenAccount = await tokenProgram.getOrCreateAssociatedAccountInfo(
    toAccount
  );

  manualTransaction.add(
    splToken.Token.createMintToInstruction(
      splToken.TOKEN_PROGRAM_ID,
      tokenProgram.publicKey,
      toTokenAccount.address,
      fromAccount.publicKey,
      [],
      amount
    )
  );

  let transactionBuffer = manualTransaction.serializeMessage();
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey);
  manualTransaction.addSignature(fromAccount.publicKey, signature);

  let isVerifiedSignature = manualTransaction.verifySignatures();
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('hex');

  return rawTransaction
}

module.exports.deploySolanaNFT = async function ({ from, maxSupply, uri, testnet = true }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network)
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))

  const mintResponse = await metaplex.actions.mintNFT({
    connection,
    wallet,
    uri,
    maxSupply,
  });

  return { ...mintResponse }
}

module.exports.mintEdition = async function ({ masterEdition, from, testnet = true }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network)
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
  });
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl(network),
    'confirmed',
  );

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
  );

  let transactionBuffer = manualTransaction.serializeMessage();
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey);
  manualTransaction.addSignature(fromAccount.publicKey, signature);

  let isVerifiedSignature = manualTransaction.verifySignatures();
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('hex');

  return rawTransaction
}


module.exports.updateMetaplexMetadata = async function ({ token, from, uri, testnet = true }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network)
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))

  const editionMint = toPublicKey(token)
  const { name, symbol, seller_fee_basis_points, properties: { creators }, } = await metaplex.utils.metadata.lookup(uri);
  const creatorsData = creators.reduce((memo, { address, share }) => {
    const verified = address === wallet.publicKey.toString();
    const creator = new metaplex.programs.metadata.Creator({
      address,
      share,
      verified,
    });
    memo = [...memo, creator];
    return memo;
  }, []);
  const newMetadataData = new metaplex.programs.metadata.MetadataDataData({
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: seller_fee_basis_points,
    creators: creatorsData,
  });
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
  });

  manualTransaction.add(
    new solanaWeb3.TransactionInstruction({
      keys,
      programId,
      data
    })
  );

  let transactionBuffer = manualTransaction.serializeMessage();
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey);
  manualTransaction.addSignature(fromAccount.publicKey, signature);

  let isVerifiedSignature = manualTransaction.verifySignatures();
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('hex');

  return rawTransaction
}

module.exports.createTokenVault = async function ({ testnet, from }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const externalPriceAccountData = await metaplex.actions.createExternalPriceAccount({ connection: new metaplex.Connection(network, "confirmed"), wallet });
  await metaplexConfirm(network, externalPriceAccountData.txId)
  const response = await metaplex.actions.createVault({ connection: new metaplex.Connection(network, "confirmed"), wallet: wallet, priceMint: splToken.NATIVE_MINT, externalPriceAccount: externalPriceAccountData.externalPriceAccount })
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
  };
  const auction = await metaplex.actions.initAuction({ connection, wallet, vault: toPublicKey(vault), auctionSettings })
  await metaplexConfirm(network, auction.txId)
  return { ...auction }
}

module.exports.createAuctionAuthority = async function ({ testnet, from, vault, store, auction }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const auctionManagerPDA = await metaplex.programs.metaplex.AuctionManager.getPDA(toPublicKey(auction));
  const newTokenTracker = await metaplex.programs.metaplex.AuctionWinnerTokenTypeTracker.getPDA(auctionManagerPDA)
  const rentExempt = await new metaplex.Connection(network, "confirmed").getMinimumBalanceForRentExemption(splToken.AccountLayout.span)
  const createAccountTx = new solanaWeb3.Transaction({ feePayer: wallet.publicKey })
  const account = solanaWeb3.Keypair.generate();
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
  });

  const auctionProgramId = 'auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8';
  const data = Buffer.from(serialize(AUCTION_SCHEMA, new SetAuthorityArgs()));
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
  ];
  manualTransaction.add(
    new solanaWeb3.TransactionInstruction({
      keys,
      programId: toPublicKey(auctionProgramId),
      data: data,
    })
  )
  let transactionBuffer = manualTransaction.serializeMessage();
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey);
  manualTransaction.addSignature(fromAccount.publicKey, signature);

  let isVerifiedSignature = manualTransaction.verifySignatures();
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('base64');
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
  });

  const vaultProgramId = 'vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn';
  const data = Buffer.from([10]);
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
  ];
  manualTransaction.add(
    new solanaWeb3.TransactionInstruction({
      keys,
      programId: toPublicKey(vaultProgramId),
      data: data,
    })
  )
  let transactionBuffer = manualTransaction.serializeMessage();
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey);
  manualTransaction.addSignature(fromAccount.publicKey, signature);

  let isVerifiedSignature = manualTransaction.verifySignatures();
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')

  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('base64');
  const tx = await new metaplex.Connection(network, "confirmed").sendEncodedTransaction(rawTransaction)
  await metaplexConfirm(network, tx)
  return tx
}

module.exports.whitelistCreators = async function ({ testnet, from, uri, store, latestBlock }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const creators = (await axios.get(uri)).data.properties.creators
  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  const metaplexProgramId = 'p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98';

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
    let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey);
    manualTransaction.addSignature(fromAccount.publicKey, signature);

    let isVerifiedSignature = manualTransaction.verifySignatures();
    if (!isVerifiedSignature)
      throw new Error('Signatures are not valid.')

    let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('base64');
    const sentTx = await connection.sendEncodedTransaction(rawTransaction)
    await metaplexConfirm(network, sentTx)
    return sentTx
  }
}

module.exports.validateAuction = async function ({ testnet, from, latestBlock, vault, nft, store, metadata, tokenStore, tokenTracker }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const storeId = await metaplex.programs.metaplex.Store.getPDA(wallet.publicKey);
  const auctionPDA = await metaplex.programs.auction.Auction.getPDA(vault);
  const auctionManagerPDA = await metaplex.programs.metaplex.AuctionManager.getPDA(auctionPDA);
  const loadedVault = await metaplex.programs.vault.Vault.load(connection, vault);
  const sdb = await loadedVault.getSafetyDepositBoxes(connection)

  const whitelistedCreator = await metaplex.programs.metaplex.WhitelistedCreator.getPDA(toPublicKey(store), wallet.publicKey)

  const safetyDepositConfigKey = await metaplex.programs.metaplex.SafetyDepositConfig.getPDA(
    auctionManagerPDA,
    sdb[0].pubkey,
  );
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
  const data = Buffer.from(serialize(SAFETY_DEPOSIT_BOX_SCHEMA, value));

  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  });

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
  ];

  manualTransaction.add(
    new solanaWeb3.TransactionInstruction({
      keys,
      programId: toPublicKey('p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98'),
      data,
    })
  )
  let transactionBuffer = manualTransaction.serializeMessage();
  let signature = nacl.sign.detached(transactionBuffer, fromAccount.secretKey);
  manualTransaction.addSignature(fromAccount.publicKey, signature);

  let isVerifiedSignature = manualTransaction.verifySignatures();
  if (!isVerifiedSignature)
    throw new Error('Signatures are not valid.')


  let rawTransaction = Buffer.from(manualTransaction.serialize()).toString('base64');
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

module.exports.listAuctions = async function ({ testnet, from }) {
  const network = testnet ? 'devnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network, "confirmed")
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))
  const auctionResponse = await metaplex.programs.auction.Auction.findMany(connection, { authority: wallet.publicKey })
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