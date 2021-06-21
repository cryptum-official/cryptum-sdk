const StellarSdk = require('stellar-sdk')
const { RippleAPI } = require('ripple-lib')
const {
  CeloWallet,
  serializeCeloTransaction,
} = require('@celo-tools/celo-ethers-wrapper')
const { Transaction: EthereumTransaction } = require('@ethereumjs/tx')
const { default: EthereumCommon } = require('@ethereumjs/common')
const BigNumber = require('bignumber.js')
const Web3 = require('web3')
const {
  CUSD_CONTRACT_ADDRESS,
  CEUR_CONTRACT_ADDRESS,
  TRANSFER_METHOD_ABI,
  TRANSFER_COMMENT_METHOD_ABI,
  BSC_COMMON_CHAIN,
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
  fromPrivateKey,
  nonce,
  tokenSymbol,
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
    gasLimit: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
    feeCurrency:
      feeCurrency === 'cUSD'
        ? CUSD_CONTRACT_ADDRESS[network]
        : feeCurrency === 'cEUR'
        ? CEUR_CONTRACT_ADDRESS[network]
        : feeCurrencyContractAddress,
  }
  const value = Web3.utils.toWei(amount, 'ether')
  if (tokenSymbol === 'CELO') {
    rawTransaction.to = destination
    rawTransaction.value = Web3.utils.toHex(value)
  } else {
    if (tokenSymbol === 'cUSD') {
      rawTransaction.to = CUSD_CONTRACT_ADDRESS[network]
    } else if (tokenSymbol === 'cEUR') {
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

  const celoWallet = new CeloWallet(fromPrivateKey)
  const signature = celoWallet
    ._signingKey()
    .signDigest(Web3.utils.sha3(serializeCeloTransaction(rawTransaction)))
  return serializeCeloTransaction(rawTransaction, signature)
}

module.exports.buildEthereumTransferTransaction = async function ({
  fromPrivateKey,
  nonce,
  tokenSymbol,
  contractAddress,
  amount,
  destination,
  fee,
}) {
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: '',
    value: undefined,
    data: undefined,
    gasLimit: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
  }
  const value = Web3.utils.toWei(amount, 'ether')
  if (tokenSymbol === 'ETH') {
    rawTransaction.to = destination
    rawTransaction.value = Web3.utils.toHex(value)
  } else {
    rawTransaction.to = contractAddress

    const token = new new Web3().eth.Contract(
      TRANSFER_METHOD_ABI,
      rawTransaction.to
    )
    rawTransaction.data = token.methods.transfer(destination, value).encodeABI()
  }
  const tx = new EthereumTransaction(rawTransaction, {
    common: new EthereumCommon({ chain: chainId }),
  })
  const signedTx = tx.sign(Buffer.from(fromPrivateKey, 'hex'))
  return `0x${signedTx.serialize().toString('hex')}`
}

module.exports.buildBscTransferTransaction = async function ({
  fromPrivateKey,
  nonce,
  tokenSymbol,
  contractAddress,
  amount,
  destination,
  fee,
  testnet,
}) {
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: '',
    value: undefined,
    data: undefined,
    gasLimit: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
  }
  const value = Web3.utils.toWei(amount, 'ether')
  if (tokenSymbol === 'BNB') {
    rawTransaction.to = destination
    rawTransaction.value = Web3.utils.toHex(value)
  } else {
    rawTransaction.to = contractAddress

    const token = new new Web3().eth.Contract(
      TRANSFER_METHOD_ABI,
      rawTransaction.to
    )
    rawTransaction.data = token.methods.transfer(destination, value).encodeABI()
  }
  const network = testnet ? 'testnet' : 'mainnet'
  const tx = new EthereumTransaction(rawTransaction, {
    common: EthereumCommon.forCustomChain(
      BSC_COMMON_CHAIN[network].base,
      BSC_COMMON_CHAIN[network].chain
    ),
  })

  const signedTx = tx.sign(Buffer.from(fromPrivateKey, 'hex'))
  return `0x${signedTx.serialize().toString('hex')}`
}
