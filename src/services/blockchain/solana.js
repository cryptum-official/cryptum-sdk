const metaplex = require('@metaplex/js');
const solanaWeb3 = require('@solana/web3.js');
const splToken = require("@solana/spl-token");
const nacl = require('tweetnacl');
const bs58 = require('bs58');

module.exports.buildSolanaTransferTransaction = async function ({
  from,
  to,
  token,
  amount,
  latestBlock,
  testnet = true
}) {
  const network = testnet ? 'testnet' : 'mainnet-beta'
  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  });

  if (token === "SOL") {
    manualTransaction.add(solanaWeb3.SystemProgram.transfer({
      fromPubkey: fromAccount.publicKey,
      toPubkey: to,
      lamports: amount * solanaWeb3.LAMPORTS_PER_SOL,
    }));
  } else {

    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl(network),
      'confirmed',
    );

    const tokenProgram = new splToken.Token(connection, new solanaWeb3.PublicKey(token), splToken.TOKEN_PROGRAM_ID, fromAccount)
    const senderTokenAccount = await tokenProgram.getOrCreateAssociatedAccountInfo(fromAccount.publicKey)
    const receiverTokenAccount = await tokenProgram.getOrCreateAssociatedAccountInfo(new solanaWeb3.PublicKey(to))

    manualTransaction.add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        senderTokenAccount.address,
        receiverTokenAccount.address,
        fromAccount.publicKey,
        [],
        amount
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
  const network = testnet ? 'testnet' : 'mainnet-beta'
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl(network),
    'confirmed',
  );

  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  const toAccount = new solanaWeb3.PublicKey(to)

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
  const network = testnet ? 'testnet' : 'mainnet-beta'
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl(network),
    'confirmed',
  );

  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))
  const toAccount = new solanaWeb3.PublicKey(to)
  const tokenProgram = new splToken.Token(connection, new solanaWeb3.PublicKey(token), splToken.TOKEN_PROGRAM_ID, fromAccount)

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
  const network = testnet ? 'testnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network)
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))

  const mintResponse = await metaplex.actions.mintNFT({
    connection,
    wallet,
    uri,
    maxSupply,
  });

  return mintResponse.mint.toBase58()
}

module.exports.mintEdition = async function ({ masterEdition, from, testnet = true }) {
  const network = testnet ? 'testnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network)
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))

  const masterEditionMint = new solanaWeb3.PublicKey(masterEdition)

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
  const network = testnet ? 'testnet' : 'mainnet-beta'
  const fromAccount = solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey))

  let manualTransaction = new solanaWeb3.Transaction({
    recentBlockhash: latestBlock.toString(),
    feePayer: fromAccount.publicKey
  });
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl(network),
    'confirmed',
  );

  const tokenProgram = new splToken.Token(connection, new solanaWeb3.PublicKey(token), splToken.TOKEN_PROGRAM_ID, fromAccount)
  const tokenAccount = await tokenProgram.getOrCreateAssociatedAccountInfo(new solanaWeb3.PublicKey(fromAccount.publicKey))

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
  const network = testnet ? 'testnet' : 'mainnet-beta'
  const connection = new metaplex.Connection(network)
  const wallet = new metaplex.NodeWallet(solanaWeb3.Keypair.fromSecretKey(bs58.decode(from.privateKey)))

  const editionMint = new solanaWeb3.PublicKey(token)
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