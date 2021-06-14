const { NotImplementedException } = require('../../../../errors')
class Interface {

  /**
   * Method to sign an transaction in Cryptum of the backend using axios
   * 
   * @param {Object} transaction object with all transaction data required: { protocol, signedTx }
   * @param {Object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
   signTransaction(transaction, config) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
