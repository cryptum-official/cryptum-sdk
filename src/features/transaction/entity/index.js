const { Protocol } = require('../../../services/blockchain/constants')
const { Wallet } = require('../../wallet/entity')

class SignedTransaction {
  /**
   * Creates an instance of SignedTransaction
   * @param {object} signedTxArgs
   * @param {string} signedTxArgs.signedTx signed transaction data
   * @param {Protocol} signedTxArgs.protocol blockchain protocol
   */
  constructor({ signedTx, protocol }) {
    this.signedTx = signedTx
    this.protocol = protocol
  }
}
class TransactionResponse {
  /**
   * Creates an instance of TransactionResponse
   * @param {object} response
   * @param {string} response.hash transaction hash
   */
  constructor({ hash }) {
    this.hash = hash
  }
}
class FeeResponse {
  constructor({ estimateValue, currency, gas, gasPrice, chainId }) {
    this.estimateValue = estimateValue
    this.currency = currency
    this.gas = gas
    this.gasPrice = gasPrice
    this.chainId = chainId
  }
}
class TrustlineTransactionInput {
  /**
   * Creates an instance of TrustlineTransactionInput.
   * @param {object} args
   * @param {Wallet} args.wallet
   * @param {string} args.assetSymbol
   * @param {string} args.issuer
   * @param {string?} args.limit
   * @param {string?} args.memo
   * @param {object|string} args.fee
   * @param {boolean} args.testnet
   */
  constructor({ wallet, assetSymbol, issuer, limit, memo, fee, testnet }) {
    this.wallet = wallet
    this.limit = limit
    this.issuer = issuer
    this.assetSymbol = assetSymbol
    this.memo = memo
    this.fee = fee
    this.testnet = testnet
  }
}
class StellarTrustlineTransactionInput extends TrustlineTransactionInput {
  constructor(args) {
    super(args)
  }
}
class RippleTrustlineTransactionInput extends TrustlineTransactionInput {
  constructor(args) {
    super(args)
  }
}

class TransferTransactionInput {
  /**
   * Creates an instance of TransferTransactionInput.
   * @param {object} args
   * @param {Wallet} args.wallet
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string?} args.memo
   * @param {object|string} args.fee
   * @param {boolean} args.testnet
   */
  constructor({ wallet, amount, destination, memo, fee, testnet }) {
    this.wallet = wallet
    this.amount = amount
    this.destination = destination
    this.memo = memo
    this.fee = fee
    this.testnet = testnet
  }
}
class StellarTransferTransactionInput extends TransferTransactionInput {
  /**
   * Creates an instance of StellarTransferTransactionInput.
   * @param {object} args
   * @param {Wallet} args.wallet
   * @param {string} args.assetSymbol
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string?} args.memo
   * @param {string?} args.fee
   * @param {boolean} args.testnet
   * @param {string?} args.startingBalance
   */
  constructor({ assetSymbol, startingBalance, ...args }) {
    super(args)
    this.assetSymbol = assetSymbol
    this.startingBalance = startingBalance
  }
}
class RippleTransferTransactionInput extends TransferTransactionInput {
  /**
   * Creates an instance of CeloTransferTransactionInput.
   * @param {object} args
   * @param {Wallet} args.wallet
   * @param {string} args.assetSymbol
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string?} args.memo
   * @param {string?} args.fee
   * @param {boolean} args.testnet
   */
  constructor({ assetSymbol, ...args }) {
    super(args)
    this.assetSymbol = assetSymbol
  }
}
class EthereumTransferTransactionInput extends TransferTransactionInput {
  /**
   * Creates an instance of EthereumTransferTransactionInput.
   * @param {object} args
   * @param {Wallet} args.wallet
   * @param {string} args.tokenSymbol
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string?} args.memo
   * @param {object?} args.fee
   * @param {number?} args.fee.gas
   * @param {string?} args.fee.gasPrice
   * @param {boolean} args.testnet
   * @param {string?} args.contractAddress
   */
  constructor({ tokenSymbol, contractAddress, ...args }) {
    super(args)
    this.tokenSymbol = tokenSymbol
    this.contractAddress = contractAddress
  }
}
class CeloTransferTransactionInput extends EthereumTransferTransactionInput {
  /**
   * Creates an instance of CeloTransferTransactionInput.
   * @param {object} args
   * @param {Wallet} args.wallet
   * @param {string} args.tokenSymbol
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string?} args.memo
   * @param {object?} args.fee
   * @param {number?} args.fee.gas
   * @param {string?} args.fee.gasPrice
   * @param {boolean} args.testnet
   * @param {string?} args.contractAddress
   * @param {string?} args.feeCurrency
   * @param {string?} args.feeCurrencyContractAddress
   */
  constructor({ feeCurrency, feeCurrencyContractAddress, ...args }) {
    super(args)
    this.feeCurrency = feeCurrency
    this.feeCurrencyContractAddress = feeCurrencyContractAddress
  }
}

module.exports = {
  SignedTransaction,
  TransactionResponse,
  FeeResponse,
  StellarTrustlineTransactionInput,
  RippleTransferTransactionInput,
  EthereumTransferTransactionInput,
  CeloTransferTransactionInput,
  StellarTransferTransactionInput,
  RippleTransferTransactionInput,
}
