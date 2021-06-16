class SignedTransactionCryptum {
  constructor({ protocol, blob, hash }) {
    this.protocol = protocol
    this.blob = blob
    this.hash = hash
  }

  /**
   * Method to validate if to an signedTransaction is valid
   *
   * @param {*} signedTransaction to validate if is an SignedTransactionCryptum valid, to your signedTransaction are valid.
   * The send signedTransaction need are registered in Cryptum and has  { blob, protocol, hash } attributes
   *
   * @returns true if is valid and false if not
   */
  static isSignedTransactionCryptum(signedTransaction) {
    if (!(signedTransaction instanceof SignedTransactionCryptum)) return false

    return this.validateMandatoryValues(signedTransaction)
  }

  /**
   * Validate if an object can mount an SignedTransactionCryptum, not send
   * if you need attributes to send an signedTransaction in cryptum call canSend method
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
   * Method to validate if you can send an Transaction in cryptum
   *
   * @param {Object} signedTransaction with this attributes: { blob, protocol } 
   * @returns true if can, and false if not
   */
  static canSend(signedTransaction) {
    if (!signedTransaction) return false

    const { blob, protocol } = signedTransaction
    return !!blob && !!protocol
  }
}

module.exports = SignedTransactionCryptum
