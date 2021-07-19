/**
 * Transaction type
 * @enum {string}
 */
const TransactionType = {
  TRANSFER: 'TRANSFER',
  CALL_CONTRACT_METHOD: 'CALL_CONTRACT_METHOD',
  DEPLOY_CONTRACT: 'DEPLOY_CONTRACT',
  CHANGE_TRUST: 'CHANGE_TRUST',
  TOKEN_ASSET_ISSUE: 'TOKEN_ASSET_ISSUE',
}
/**
 * @typedef {object | string} Fee
 * @property {number} gas 
 * @property {string} gasPrice
 */

class SignedTransaction {
  /**
   * Creates an instance of SignedTransaction
   *
   * @param {object} signedTxArgs
   * @param {string} signedTxArgs.signedTx signed transaction data
   * @param {Protocol} signedTxArgs.protocol blockchain protocol
   * @param {TransactionType} signedTxArgs.type transaction type
   */
  constructor({ signedTx, protocol, type }) {
    this.signedTx = signedTx
    this.protocol = protocol
    this.type = type
  }
}
class TransactionResponse {
  /**
   * Creates an instance of TransactionResponse
   *
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
class SmartContractCallResponse {
  constructor({ result }) {
    this.result = result
  }
}
class UTXO {
  constructor({ value, txHash, index, height }) {
    this.value = value
    this.txHash = txHash
    this.index = index
    this.height = height
  }
}
class Output {
  constructor(output) {
    this.address = output.address
    this.amount = output.amount
  }
}
class TrustlineTransactionInput {
  /**
   * Creates an instance of TrustlineTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.assetSymbol
   * @param {string} args.issuer
   * @param {string?} args.limit
   * @param {string?} args.memo
   * @param {Fee?} args.fee
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
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string?} args.memo
   * @param {Fee?} args.fee
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
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.assetSymbol
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string?} args.memo
   * @param {Fee?} args.fee
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
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.assetSymbol
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string?} args.memo
   * @param {Fee?} args.fee
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
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.tokenSymbol
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string?} args.memo
   * @param {Fee?} args.fee
   * @param {boolean} args.testnet
   * @param {string?} args.contractAddress
   */
  constructor({ tokenSymbol, contractAddress, ...args }) {
    super(args)
    this.tokenSymbol = tokenSymbol
    this.contractAddress = contractAddress
  }
}
class SmartContractCallTransactionInput {
  /**
   * Creates an instance of SmartContractCallTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.contractAddress
   * @param {string} args.method
   * @param {Array} args.params
   * @param {Fee?} args.fee
   * @param {boolean} args.testnet
   */
  constructor({ wallet, contractAddress, method, params, fee, testnet }) {
    this.wallet = wallet
    this.contractAddress = contractAddress
    this.method = method
    this.params = params
    this.fee = fee
    this.testnet = testnet
  }
}

class SmartContractDeployTransactionInput {
  /**
   * Creates an instance of SmartContractDeployTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.method
   * @param {string} args.name
   * @param {Array} args.params
   * @param {string} args.code
   * @param {Fee?} args.fee
   * @param {boolean} args.testnet
   */
  constructor({ wallet, method, name, params, code, fee, testnet }) {
    this.wallet = wallet
    this.method = method
    this.name = name
    this.params = params
    this.code = code
    this.fee = fee
    this.testnet = testnet
  }
}
class CeloTransferTransactionInput extends EthereumTransferTransactionInput {
  /**
   * Creates an instance of CeloTransferTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.tokenSymbol
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string?} args.memo
   * @param {Fee?} args.fee
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
class BitcoinTransferTransactionInput extends TransferTransactionInput {
  /**
   * Creates an instance of BitcoinTransferTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet?} args.wallet wallet to transfer from
   * @param {Array<UTXO>} args.fromUTXOs inputs from UTXOs to transfer from
   * @param {Array<string>} args.fromPrivateKeys input private keys to sign from
   * @param {Array<Output>} args.outputs outputs to transfer to
   * @param {Fee?} args.fee fee per byte in satoshi
   * @param {boolean} args.testnet
   */
  constructor({ outputs, fromUTXOs, fromPrivateKeys, ...args }) {
    super(args)
    this.outputs = outputs
    this.fromPrivateKeys = fromPrivateKeys
    this.fromUTXOs = fromUTXOs
  }
}

module.exports = {
  TransactionType,
  SignedTransaction,
  TransactionResponse,
  FeeResponse,
  UTXO,
  Output,
  StellarTrustlineTransactionInput,
  RippleTrustlineTransactionInput,
  EthereumTransferTransactionInput,
  CeloTransferTransactionInput,
  StellarTransferTransactionInput,
  RippleTransferTransactionInput,
  BitcoinTransferTransactionInput,
  SmartContractCallTransactionInput,
  SmartContractCallResponse,
  SmartContractDeployTransactionInput,
}
