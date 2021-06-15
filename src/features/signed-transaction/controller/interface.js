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
   * Method to send an signedTransaction to Cryptum
   * 
   * @param {Object} signedTransaction object with all signedTransaction data required: { protocol, transaction }
   */
   sendSignedTransaction(signedTransaction) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
