const StellarSdk = require('stellar-sdk')
const { RippleAPI } = require('ripple-lib')
const {
  CeloWallet,
  serializeCeloTransaction,
} = require('@celo-tools/celo-ethers-wrapper')
const BigNumber = require('bignumber.js')
const Web3 = require('web3')
const { Protocol } = require('./constants')
const Wallet = require('../../features/wallet/entity')
const {
  CUSD_CONTRACT_ADDRESS,
  CEUR_CONTRACT_ADDRESS,
  TRANSFER_METHOD_ABI,
  TRANSFER_COMMENT_METHOD_ABI,
} = require('./constants')

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
module.exports.buildStellarTransferTransaction = function ({
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
  }).setTimeout(180)

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

module.exports.buildCeloTransferTransaction = async function ({
  fromAddress,
  fromPrivateKey,
  nonce,
  assetSymbol,
  contractAddress,
  amount,
  destination,
  fee,
  feeCurrency = null,
  feeCurrencyContractAddress = null,
  memo = null,
  testnet = true,
}) {
  const network = testnet ? 'testnet' : 'mainnet'
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: '',
    value: undefined,
    data: undefined,
    gasLimit: Web3.utils.toHex(new BigNumber(gas).plus(1000000)),
    feeCurrency:
      feeCurrency === 'cUSD'
        ? CUSD_CONTRACT_ADDRESS[network]
        : feeCurrency === 'cEUR'
        ? CEUR_CONTRACT_ADDRESS[network]
        : feeCurrencyContractAddress,
  }
  const value = Web3.utils.toWei(amount, 'ether')
  if (assetSymbol === 'CELO') {
    rawTransaction.to = destination
    rawTransaction.value = Web3.utils.toHex(value)
  } else {
    if (assetSymbol === 'cUSD') {
      rawTransaction.to = CUSD_CONTRACT_ADDRESS[network]
    } else if (assetSymbol === 'cEUR') {
      rawTransaction.to = CEUR_CONTRACT_ADDRESS[network]
    } else {
      rawTransaction.to = contractAddress
    }

    const token = new new Web3().eth.Contract(
      memo ? TRANSFER_COMMENT_METHOD_ABI : TRANSFER_METHOD_ABI,
      rawTransaction.to
    )
    rawTransaction.data = memo
      ? token.methods.transferWithComment(destination, value, memo).encodeABI()
      : token.methods.transfer(destination, value).encodeABI()
  }
  console.log(rawTransaction, fromPrivateKey)

  const celoWallet = new CeloWallet(fromPrivateKey)
  const signature = celoWallet
    ._signingKey()
    .signDigest(Web3.utils.sha3(serializeCeloTransaction(rawTransaction)))
  return serializeCeloTransaction(rawTransaction, signature)
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
 * @param {string | {gas, gasPrice, chainId} | null} args.fee fee
 * @param {string?} args.memo (stellar, ripple, celo only) memo string
 * @param {string?} args.startingBalance (stellar only) starting amount for creation of stellar account
 * @param {string?} args.maxLedgerVersion (ripple only)
 * @param {string?} args.contractAddress (celo, ethereum, bsc only) token contract address to make token transfer
 * @param {string?} args.feeCurrency (celo only) currency to pay for transaction fees
 * @param {string?} args.feeCurrencyContractAddress (celo only) currency address
 * @returns {Promise<string>} signed tx
 */
module.exports.buildTransferTransaction = async function ({
  wallet,
  sequence,
  assetSymbol,
  issuer,
  amount,
  destination,
  protocol,
  memo,
  fee,
  testnet = true,
  maxLedgerVersion,
  startingBalance,
  contractAddress,
  feeCurrency,
  feeCurrencyContractAddress,
}) {
  const payload = {
    fromAddress: wallet.address,
    fromPrivateKey: wallet.privateKey,
    assetSymbol,
    issuer,
    amount,
    destination,
    fee,
  }
  switch (protocol) {
    case Protocol.STELLAR:
      return buildStellarTransferTransaction({
        ...payload,
        fromPublicKey: wallet.publicKey,
        sequence,
        memo,
        startingBalance,
        testnet,
      })
    case Protocol.RIPPLE:
      return await buildRippleTransferTransaction({
        ...payload,
        sequence,
        maxLedgerVersion,
        memo,
      })
    case Protocol.CELO:
      return await buildCeloTransferTransaction({
        ...payload,
        nonce: sequence,
        memo,
        contractAddress,
        feeCurrency,
        feeCurrencyContractAddress,
      })
    default:
      throw new Error('Unsupported protocol')
  }
}
