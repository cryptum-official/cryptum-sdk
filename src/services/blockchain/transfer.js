const StellarSdk = require('stellar-sdk')
const { RippleAPI } = require('ripple-lib')
const BigNumber = require('bignumber.js')
const { Protocol } = require('.')
const Wallet = require('../../features/wallet/entity')

/**
 * Build signed transfer tx for Stellar protocol
 * @param {object} args
 * @param {string} args.fromPublicKey account to use for this transfer transaction
 * @param {string} args.fromPrivateKey account private key to sign the transfer transaction
 * @param {string} args.sequence account sequence number
 * @param {string} args.assetSymbol asset symbol
 * @param {string} args.issuer issuer account
 * @param {string} args.amount amount number for the transfer
 * @param {string} args.destination destination account
 * @param {string?} args.startingBalance amount number for starting a new account in blockchain
 * @param {string?} args.fee fee in stroops
 * @param {string?} args.memo memo string
 * @param {boolean?} args.testnet
 * @returns {string} signed tx
 */
function buildStellarTransferTransaction({
  fromPublicKey,
  fromPrivateKey,
  sequence,
  assetSymbol,
  issuer,
  amount,
  destination,
  startingBalance = null,
  fee = null,
  memo = null,
  testnet = true,
}) {
  const account = new StellarSdk.Account(fromPublicKey, sequence)
  const builder = new StellarSdk.TransactionBuilder(account, {
    fee: fee ? fee : '100',
    memo: memo
      ? memo.length > 28
        ? StellarSdk.Memo.hash(memo)
        : StellarSdk.Memo.text(memo)
      : null,
    networkPassphrase: testnet
      ? StellarSdk.Networks.TESTNET
      : StellarSdk.Networks.PUBLIC,
  }).setTimeout(300)

  const transaction = startingBalance
    ? builder
        .addOperation(
          StellarSdk.Operation.createAccount({
            startingBalance,
            destination: destination.trim(),
          })
        )
        .build()
    : builder
        .addOperation(
          StellarSdk.Operation.payment({
            asset:
              assetSymbol === 'XLM'
                ? StellarSdk.Asset.native()
                : new StellarSdk.Asset(assetSymbol, issuer),
            amount,
            destination: destination.trim(),
          })
        )
        .build()

  transaction.sign(StellarSdk.Keypair.fromSecret(fromPrivateKey))
  return transaction.toEnvelope().toXDR().toString('base64')
}

/**
 * Build signed transfer tx for Ripple protocol
 * @param {object} args
 * @param {string} args.fromAddress account address
 * @param {string} args.fromPrivateKey account private key to sign transaction
 * @param {string} args.sequence account sequence number
 * @param {string} args.assetSymbol asset symbol
 * @param {string?} args.issuer issuer account address
 * @param {string} args.amount amount number
 * @param {string} args.destination destination address
 * @param {string?} args.fee fee in drops
 * @param {string?} args.memo memo string
 * @returns {Promise<string>} signed tx
 */
async function buildRippleTransferTransaction({
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
    memos: memo ? [{ type: '', format: 'text/plain', data: memo }] : null,
  }
  const prepared = await rippleAPI.preparePayment(fromAddress, transfer, {
    fee: fee ? new BigNumber(fee).div('1e6').toString() : '0.0001',
    sequence,
    maxLedgerVersion,
  })
  const { signedTransaction } = rippleAPI.sign(prepared.txJSON, fromPrivateKey)
  return signedTransaction
}

/**
 * Build signed transfer tx
 * @param {object} args
 * @param {Wallet} args.wallet wallet
 * @param {string} args.sequence account sequence number
 * @param {string} args.assetSymbol asset symbol
 * @param {string?} args.issuer issuer account address
 * @param {string} args.amount amount number
 * @param {string} args.destination destination address
 * @param {string} args.protocol protocol
 * @param {string?} args.fee fee in drops
 * @param {string?} args.memo memo string
 * @param {string?} args.startingBalance starting amount for creation of stellar account
 * @returns {Promise<string>} signed tx
 */
module.exports.buildTransferTransaction = async function ({
  wallet,
  sequence,
  maxLedgerVersion,
  assetSymbol,
  issuer,
  amount,
  destination,
  protocol,
  memo = null,
  fee = null,
  startingBalance = null,
  testnet = true,
}) {
  switch (protocol) {
    case Protocol.STELLAR:
      return buildStellarTransferTransaction({
        fromPublicKey: wallet.publicKey,
        fromPrivateKey: wallet.privateKey,
        sequence,
        assetSymbol,
        issuer,
        amount,
        destination,
        memo,
        fee,
        startingBalance,
        testnet,
      })
    case Protocol.RIPPLE:
      return await buildRippleTransferTransaction({
        fromAddress: wallet.address,
        fromPrivateKey: wallet.privateKey,
        sequence,
        maxLedgerVersion,
        assetSymbol,
        issuer,
        amount,
        destination,
        memo,
        fee,
      })
    default:
      throw new Error('Unsupported protocol')
  }
}
