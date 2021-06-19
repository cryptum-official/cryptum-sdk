const { NotImplementedException } = require('../../../../errors')
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
   */
   sendTransaction(transaction) {
    throw new NotImplementedException()
  }
  /**
   * Method to get fee info
   */
  async getFee({ type, from, destination, assetSymbol, protocol }) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
