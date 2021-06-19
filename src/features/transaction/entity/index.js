class TransactionCryptum {
  constructor({ protocol, blob, hash }) {
    this.protocol = protocol
    this.blob = blob
    this.hash = hash
  }

  /**
   * Method to validate if to an transaction is valid
   *
   * @param {*} transaction to validate if is an TransactionCryptum valid, to your transaction are valid.
   * The send transaction need are registered in Cryptum and has  { blob, protocol, hash } attributes
   *
   * @returns true if is valid and false if not
   */
  static isTransactionCryptum(transaction) {
    if (!(transaction instanceof TransactionCryptum)) return false

    return this.validateMandatoryValues(transaction)
  }

  /**
   * Validate if an object can mount an TransactionCryptum, not send
   * if you need attributes to send an transaction in cryptum call canSend method
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
   * @param {Object} transaction with this attributes: { blob, protocol } 
   * @returns true if can, and false if not
   */
  static canSend(transaction) {
    if (!transaction) return false

    const { blob, protocol } = transaction
    return !!blob && !!protocol
  }
}

class TransactionRequest {
  constructor({ signedTx }) {
    this.signedTx = signedTx
  }
}
class TransactionResponse {
  constructor({ hash }) {
    this.hash = hash
  }
}
class FeeResponse {
  constructor({ estimateValue, currency, gas, gasPrice, chainId }) {
    this.estimateValue = estimateValue
    this.currency = currency
    this.gas = gas
    this.gasPrice = gasPrice
    this.chainId = chainId
  }
}

module.exports = {
  TransactionCryptum,
  TransactionRequest,
  TransactionResponse,
  FeeResponse
}
