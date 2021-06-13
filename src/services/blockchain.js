const StellarSdk = require('stellar-sdk')
const { RippleAPI } = require('ripple-lib')
/**
 * Blockchain protocols
 * @enum {string}
 */
const Protocol = {
  BITCOIN: 'BITCOIN',
  BINANCECHAIN: 'BINANCECHAIN',
  BSC: 'BSC',
  CELO: 'CELO',
  ETHEREUM: 'ETHEREUM',
  STELLAR: 'STELLAR',
  RIPPLE: 'RIPPLE',
}
module.exports.Protocol = Protocol

/**
 * Build signed trustline tx for Stellar protocol
 * @param {object} param0
 * @param {string} param0.fromPublicKey
 * @param {string[]} param0.fromPrivateKeys
 * @param {string} param0.sequence
 * @param {string} param0.assetCode
 * @param {string} param0.issuer
 * @param {number?} param0.fee
 * @param {string?} param0.limit
 * @param {memo?} param0.memo
 * @param {boolean?} param0.testnet
 * @returns {string} signed tx
 */
async function buildStellarTrustlineTransaction({
  fromPublicKey,
  fromPrivateKeys,
  sequence,
  assetCode,
  issuer,
  fee = null,
  limit = null,
  memo = null,
  testnet = true,
}) {
  const account = new StellarSdk.Account(fromPublicKey, sequence)
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee,
    memo: memo
      ? memo.length > 28
        ? StellarSdk.Memo.hash(memo)
        : StellarSdk.Memo.text(memo)
      : null,
    networkPassphrase: testnet
      ? StellarSdk.Networks.TESTNET
      : StellarSdk.Networks.PUBLIC,
  })
    .addOperation(
      StellarSdk.Operation.changeTrust({
        asset: new StellarSdk.Asset(assetCode, issuer),
        limit,
      })
    )
    .setTimeout(100)
    .build()
  transaction.sign(
    fromPrivateKeys.map(privkey => StellarSdk.Keypair.fromSecret(privkey))
  )
  return transaction.toEnvelope().toXDR().toString('base64')
}
module.exports.buildStellarTrustlineTransaction =
  buildStellarTrustlineTransaction
/**
 * Build signed trustline tx for Ripple protocol
 * @param {object} param0
 * @param {string} param0.fromAddress
 * @param {string} param0.fromPrivateKey
 * @param {string} param0.sequence
 * @param {string} param0.assetCode
 * @param {string} param0.issuer
 * @param {number?} param0.fee
 * @param {string?} param0.limit
 * @param {memo?} param0.memo
 * @returns {string} signed tx
 */
async function buildRippleTrustlineTransaction({
  fromAddress,
  fromPrivateKey,
  sequence,
  assetCode,
  issuer,
  limit = null,
  memo = null,
  fee = null,
}) {
  const rippleAPI = new RippleAPI()
  const trustline = {
    currency: assetCode,
    counterparty: issuer,
    limit,
    memos: memo ? [{ type: 'test', format: 'text/plain', data: memo }] : null,
  }
  const prepared = await rippleAPI.prepareTrustline(fromAddress, trustline, {
    fee,
    sequence,
  })
  const { signedTransaction } = rippleAPI.sign(prepared.txJSON, fromPrivateKey)
  return signedTransaction
}

module.exports.buildRippleTrustlineTransaction = buildRippleTrustlineTransaction
