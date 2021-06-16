const { NotImplementedException } = require('../../../../errors')

class Interface {
  /**
   * Method to mount and validate an Cryptum SignedTransaction to send for API
   * 
   * @param {Object} signedTransaction an Object with { protocol, blob }
   * All data required to send an new signedTransaction
   */
   mountTransactionToSend(signedTransaction) {
    throw new NotImplementedException()
  }

  /**
   * Method to mount and validate an Cryptum SignedTransaction saved in backend
   * 
   * @param {Object} signedTransaction an Object with { hash, protocol, blob: optional }
   * All data returned of the Cryptum API
   */
   mountSignedTransaction(signedTransaction) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
