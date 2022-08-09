const { RippleAPI } = require('ripple-lib')
const { fromDrop } = require('./utils')
/**
 * Build signed trustline tx for Ripple protocol
 *
 * @param {object} args
 * @param {string} args.fromAddress account address
 * @param {string} args.fromPrivateKey account private key to sign transaction
 * @param {string} args.sequence account sequence number
 * @param {string} args.assetSymbol asset symbol
 * @param {string} args.issuer issuer account address
 * @param {string=} args.fee fee in drops
 * @param {string=} args.limit limit number
 * @param {memo=} args.memo memo string
 * @param args.maxLedgerVersion
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
    memos: memo ? [{ type: 'test', format: 'text/plain', data: memo }] : undefined,
  }
  const prepared = await rippleAPI.prepareTrustline(fromAddress, trustline, {
    fee: fromDrop(fee).toString(),
    sequence,
    maxLedgerVersion,
  })
  const { signedTransaction } = rippleAPI.sign(prepared.txJSON, fromPrivateKey)
  return signedTransaction
}

/**
 * Build signed transfer tx for Ripple protocol
 *
 * @param {object} args
 * @param {string} args.fromAddress account address
 * @param {string} args.fromPrivateKey account private key to sign transaction
 * @param {string} args.sequence account sequence number
 * @param {string} args.assetSymbol asset symbol
 * @param {string=} args.issuer issuer account address
 * @param {string} args.amount amount number
 * @param {string} args.destination destination address
 * @param {string=} args.fee fee in drops
 * @param {string=} args.memo memo string
 * @param args.maxLedgerVersion
 * @returns {Promise<string>} signed tx
 */
module.exports.buildRippleTransferTransaction = async function ({
  fromAddress,
  fromPrivateKey,
  sequence,
  maxLedgerVersion,
  assetSymbol,
  issuer,
  amount,
  destination,
  memo = null,
  fee = null,
}) {
  const rippleAPI = new RippleAPI()
  const transfer = {
    source: {
      address: fromAddress,
      maxAmount: {
        currency: assetSymbol,
        counterparty: issuer,
        value: amount,
      },
    },
    destination: {
      address: destination.trim(),
      amount: {
        currency: assetSymbol,
        counterparty: issuer,
        value: amount,
      },
    },
    memos: memo ? [{ type: '', format: 'text/plain', data: memo }] : undefined,
  }
  const prepared = await rippleAPI.preparePayment(fromAddress, transfer, {
    fee: fee ? fromDrop(fee).toString() : '0.0001',
    sequence,
    maxLedgerVersion,
  })
  const { signedTransaction } = rippleAPI.sign(prepared.txJSON, fromPrivateKey)
  return signedTransaction
}
