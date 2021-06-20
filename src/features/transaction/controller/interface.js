const { NotImplementedException } = require('../../../../errors')
const { Protocol } = require('../../../services/blockchain/constants')
const {
  TransactionResponse,
  StellarTrustlineTransactionInput,
  RippleTransferTransactionInput,
  StellarTransferTransactionInput,
  CeloTransferTransactionInput,
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
   * @param {Object} transaction object with all transaction data required: { protocol, blob }
   * @param {string} transaction.blob transaction blob
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
   * Create stellar trustline transaction
   * @param {StellarTrustlineTransactionInput} input
   */
  async createStellarTrustlineTransaction(input) {
    throw new NotImplementedException()
  }
  /**
   * Create ripple trustline transaction
   * @param {RippleTransferTransactionInput} input
   */
  async createRippleTrustlineTransaction(input) {
    throw new NotImplementedException()
  }
  /**
   * Create stellar transfer transaction
   * @param {StellarTransferTransactionInput} input
   * @returns {Promise<string>}
   */
  async createStellarTransferTransaction(input) {
    throw new NotImplementedException()
  }
  /**
   * Create ripple transfer transaction
   * @param {RippleTransferTransactionInput} input
   * @returns {Promise<string>}
   */
  async createRippleTransferTransaction(input) {
    throw new NotImplementedException()
  }
  /**
   * Create celo transfer transaction
   * @param {CeloTransferTransactionInput} input
   * @returns {Promise<string>}
   */
   async createCeloTransferTransaction(input) {
    throw new NotImplementedException()
   }
}

module.exports = Interface
