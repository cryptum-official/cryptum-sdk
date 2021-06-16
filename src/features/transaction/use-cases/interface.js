const { NotImplementedException } = require('../../../../errors')

class Interface {
  /**
   * Method to mount and validate an Cryptum SignedTransaction to send for API
   * 
   * @param {Object} transaction an Object with { protocol, blob }
   * All data required to send an new transaction
   */
   mountTransactionToSend(transaction) {
    throw new NotImplementedException()
  }

  /**
   * Method to mount and validate an Cryptum SignedTransaction saved in backend
   * 
   * @param {Object} transaction an Object with { hash, protocol, blob: optional }
   * All data returned of the Cryptum API
   */
   mountSignedTransaction(transaction) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
