const StellarSdk = require('stellar-sdk')
const { RippleAPI } = require('ripple-lib')
const BigNumber = require('bignumber.js')

/**
 * Build signed trustline tx for Stellar protocol
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
 * Build signed trustline tx for Ripple protocol
 * @param {object} args
 * @param {string} args.fromAddress account address
 * @param {string} args.fromPrivateKey account private key to sign transaction
 * @param {string} args.sequence account sequence number
 * @param {string} args.assetSymbol asset symbol
 * @param {string} args.issuer issuer account address
 * @param {string?} args.fee fee in drops
 * @param {string?} args.limit limit number
 * @param {memo?} args.memo memo string
 * @returns {Promise<string>} signed tx
 */
module.exports.buildRippleTrustlineTransaction = async function ({
  fromAddress,
  fromPrivateKey,
  sequence,
  maxLedgerVersion,
  assetSymbol,
  issuer,
  limit = null,
  memo = null,
  fee = null,
}) {
  const rippleAPI = new RippleAPI()
  const trustline = {
    currency: assetSymbol,
    counterparty: issuer,
    limit,
    memos: memo ? [{ type: 'test', format: 'text/plain', data: memo }] : null,
  }
  const prepared = await rippleAPI.prepareTrustline(fromAddress, trustline, {
    fee: fee ? new BigNumber(fee).div('1e6').toString() : '0.0001',
    sequence,
    maxLedgerVersion,
  })
  const { signedTransaction } = rippleAPI.sign(prepared.txJSON, fromPrivateKey)
  return signedTransaction
}
