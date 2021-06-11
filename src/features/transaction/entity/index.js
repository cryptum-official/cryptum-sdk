const { isValidProtocol } = require('../../../services')
class TransactionCryptum {
  constructor({ protocol, signature, hash }) {
    this.protocol = protocol
    this.signature = signature
    this.hash = hash
  }

  /**
   * Method to validate if an transaction is valid
   *
   * @param {*} transaction to validate if is an TransactionCryptum valid, to your transaction are valid.
   * The transaction need are registered in Cryptum and has  { signature, protocol, hash } attributes
   *
   * @returns true if is valid and false if not
   */
  static isTransactionCryptum(transaction) {
    if (!(transaction instanceof TransactionCryptum)) return false

    return this.validateMandatoryValues(transaction)
  }

  /**
   * Validate if an object can mount an TransactionCryptum, not create
   * if you need attributes to create an transaction in cryptum call canCreate method
   *
   * @param {*} object generic object with mandatory values: { protocol, hash }
   * @returns true if can mount and false if not
   */
  static validateMandatoryValues(object) {
    if (!object) return false

    const { protocol, hash } = object
    return !!protocol && !!hash
  }

  /**
   * Method to validate if you can create an Transaction in cryptum
   *
   * @param {Object} transaction with this attributes: { signature, protocol } 
   * @returns true if can create and false if not
   */
  static canCreate(transaction) {
    if (!transaction) return false

    const { signature, protocol } = transaction
    return !!signature && !!protocol
  }
}

module.exports = TransactionCryptum
