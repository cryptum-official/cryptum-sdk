const { NotImplementedException } = require('../../../../errors')

class Interface {
  /**
   * Method to mount and validate an Cryptum Transaction to Sign in API
   * 
   * @param {Object} transaction an Object with { protocol, signature }
   * All data required to Sign an new transaction
   */
   mountTransactionToSign(transaction) {
    throw new NotImplementedException()
  }

  /**
   * Method to mount and validate an Cryptum Transaction saved in backend
   * 
   * @param {Object} transaction an Object with { hash, protocol, signature: optional }
   * All data returned of the Cryptum API
   */
   mountTransaction(transaction) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
