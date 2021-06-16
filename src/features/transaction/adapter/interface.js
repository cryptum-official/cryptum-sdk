const { NotImplementedException } = require('../../../../errors')
class Interface {

  /**
   * Method to send an transaction in Cryptum of the backend using axios
   * 
   * @param {Object} transaction object with all transaction data required: { protocol, blob }
   * @param {Object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
   sendTransaction(transaction, config) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
