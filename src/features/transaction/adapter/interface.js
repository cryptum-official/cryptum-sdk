const { NotImplementedException } = require('../../../../errors')
class Interface {

  /**
   * Method to send an signedTransaction in Cryptum of the backend using axios
   * 
   * @param {Object} signedTransaction object with all signedTransaction data required: { protocol, blob }
   * @param {Object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
   sendSignedTransaction(signedTransaction, config) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
