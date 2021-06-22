const { NotImplementedException } = require('../../../../errors')
const { Protocol } = require('../../../services/blockchain/constants')
const {
  TransactionResponse,
  StellarTrustlineTransactionInput,
  RippleTransferTransactionInput,
  StellarTransferTransactionInput,
  CeloTransferTransactionInput,
  SignedTransaction,
  EthereumTransferTransactionInput,
  UTXOResponse,
} = require('../entity')
class Interface {
  /**
   * Method to configure required adapters and general configs
   *
   * @param {Object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   * @param {String} apiKey an string with apikey provided in configuration
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Method to send an transaction to Cryptum
   *
   * @param {SignedTransaction} transaction object with all transaction data
   * @param {Protocol} transaction.protocol
   * @returns {Promise<TransactionResponse>}
   */
  sendTransaction(transaction) {
    throw new NotImplementedException()
  }
  /**
   * Method to get fee info
   * @param {object} input
   * @param {string} input.type
   * @param {string?} input.from
   * @param {string?} input.destination
   * @param {string?} input.assetSymbol
   * @param {string?} input.contractAddress
   * @param {string?} input.method
   * @param {Array?} input.params
   * @param {Protocol} input.protocol
   */
  async getFee(input) {
    throw new NotImplementedException()
  }
  /**
   * Get UTXOs from address
   * @param {object} input
   * @param {string} input.address
   * @param {Protocol} input.protocol
   * @returns {Array<UTXOResponse>}
   */
  async getUTXOs({ address, protocol }) {
    throw new NotImplementedException()
  }
  /**
   * Create stellar trustline transaction
   * @param {StellarTrustlineTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createStellarTrustlineTransaction(input) {
    throw new NotImplementedException()
  }
  /**
   * Create ripple trustline transaction
   * @param {RippleTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createRippleTrustlineTransaction(input) {
    throw new NotImplementedException()
  }
  /**
   * Create stellar transfer transaction
   * @param {StellarTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createStellarTransferTransaction(input) {
    throw new NotImplementedException()
  }
  /**
   * Create ripple transfer transaction
   * @param {RippleTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createRippleTransferTransaction(input) {
    throw new NotImplementedException()
  }
  /**
   * Create celo transfer transaction
   * @param {CeloTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createCeloTransferTransaction(input) {
    throw new NotImplementedException()
  }
  /**
   * Create ethereum transfer transaction
   * @param {EthereumTransferTransactionInput} input
   * @param {Protocol} protocol
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createEthereumTransferTransaction(input, protocol) {
    throw new NotImplementedException()
  }
  /**
   * Create bsc transfer transaction
   * @param {EthereumTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createBscTransferTransaction(input) {
    throw new NotImplementedException()
  }
  /**
   * Create bitcoin transfer transaction
   * @param {BitcoinTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createBitcoinTransferTransaction(input) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
