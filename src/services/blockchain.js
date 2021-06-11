const StellarSdk = require('stellar-sdk')
const rippleSdk = require('ripple-lib')
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
 *
 * @param {object} param0
 * @param {string} param0.fromPublicKey
 * @param {string[]} param0.fromPrivateKeys
 * @param {string} param0.sequence
 * @param {string} param0.assetCode
 * @param {string} param0.issuer
 * @param {string} param0.limit
 * @param {number} param0.fee
 * @param {memo} param0.memo
 * @param {boolean} param0.testnet
 */
async function buildCreateTrustlineStellar({
  fromPublicKey,
  fromPrivateKeys,
  sequence,
  assetCode,
  issuer,
  limit,
  memo,
  fee,
  testnet,
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
        limit: limit ? limit : null,
      })
    )
    .setTimeout(100)
    .build()
  transaction.sign(
    fromPrivateKeys.map(privkey => StellarSdk.Keypair.fromSecret(privkey))
  )
  return transaction
}
async function buildCreateTrustlineRipple() {}
