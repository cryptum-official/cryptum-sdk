const StellarSdk = require('stellar-sdk')

/**
 * Build signed trustline tx for Stellar protocol
 *
 * @param {object} args
 * @param {string} args.fromPublicKey account to use for this trustline transaction
 * @param {string} args.fromPrivateKey account private key to sign the trustline transaction
 * @param {string} args.sequence account sequence number
 * @param {string} args.assetSymbol asset symbol
 * @param {string} args.issuer issuer account
 * @param {string?} args.fee fee in stroops
 * @param {string?} args.limit limit number for the trustline
 * @param {memo?} args.memo memo string
 * @param {boolean?} args.testnet
 * @returns {Promise<string>} signed tx
 */
module.exports.buildStellarTrustlineTransaction = async function ({
  fromPublicKey,
  fromPrivateKey,
  sequence,
  assetSymbol,
  issuer,
  fee = null,
  limit = null,
  memo = null,
  testnet = true,
}) {
  const account = new StellarSdk.Account(fromPublicKey, sequence)
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: fee ? fee : '100',
    memo: memo ? (memo.length > 28 ? StellarSdk.Memo.hash(memo) : StellarSdk.Memo.text(memo)) : null,
    networkPassphrase: testnet ? StellarSdk.Networks.TESTNET : StellarSdk.Networks.PUBLIC,
  })
    .addOperation(
      StellarSdk.Operation.changeTrust({
        asset: new StellarSdk.Asset(assetSymbol, issuer),
        limit,
      })
    )
    .setTimeout(300)
    .build()

  transaction.sign(StellarSdk.Keypair.fromSecret(fromPrivateKey))
  return transaction.toEnvelope().toXDR().toString('base64')
}
/**
 * Build signed transfer tx for Stellar protocol
 *
 * @param {object} args
 * @param {string} args.fromPublicKey account to use for this transfer transaction
 * @param {string} args.fromPrivateKey account private key to sign the transfer transaction
 * @param {string} args.sequence account sequence number
 * @param {string} args.assetSymbol asset symbol
 * @param {string} args.issuer issuer account
 * @param {string} args.amount amount number for the transfer
 * @param {string} args.destination destination account
 * @param {boolean?} args.createAccount true if the destination account does not exist
 * @param {string?} args.fee fee in stroops
 * @param {string?} args.memo memo string
 * @param {boolean?} args.testnet
 * @returns {Promise<string>} signed tx
 */
module.exports.buildStellarTransferTransaction = async function ({
  fromPublicKey,
  fromPrivateKey,
  sequence,
  assetSymbol,
  issuer,
  amount,
  destination,
  createAccount = false,
  fee = null,
  memo = null,
  testnet = true,
  timeout = null
}) {
  const account = new StellarSdk.Account(fromPublicKey, sequence)
  const builder = new StellarSdk.TransactionBuilder(account, {
    fee: fee ? fee : '100',
    memo: memo ? (memo.length > 28 ? StellarSdk.Memo.hash(memo) : StellarSdk.Memo.text(memo)) : null,
    networkPassphrase: testnet ? StellarSdk.Networks.TESTNET : StellarSdk.Networks.PUBLIC,
  }).setTimeout(timeout || 180)

  const transaction = createAccount
    ? builder
        .addOperation(
          StellarSdk.Operation.createAccount({
            startingBalance: amount,
            destination: destination.trim(),
          })
        )
        .build()
    : builder
        .addOperation(
          StellarSdk.Operation.payment({
            asset: assetSymbol === 'XLM' ? StellarSdk.Asset.native() : new StellarSdk.Asset(assetSymbol, issuer),
            amount,
            destination: destination.trim(),
          })
        )
        .build()

  transaction.sign(StellarSdk.Keypair.fromSecret(fromPrivateKey))
  return transaction.toEnvelope().toXDR().toString('base64')
}
