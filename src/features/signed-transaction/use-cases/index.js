const { NotCanMountException } = require('../../../../errors')

const SignedTransactionCryptum = require('../entity')
const Interface = require('./interface')

class UseCases extends Interface {
  mountTransactionToSend(signedTransaction) {
    if (!signedTransaction) throw new NotCanMountException('SignedTransactionCryptum')
    if (!SignedTransactionCryptum.canSend(signedTransaction))
      throw new NotCanMountException('SignedTransactionCryptum')

    return new SignedTransactionCryptum(signedTransaction)
  }

  mountSignedTransaction(signedTransaction) {
    if (!signedTransaction) throw new NotCanMountException('SignedTransactionCryptum')
    if (!SignedTransactionCryptum.validateMandatoryValues(signedTransaction))
      throw new NotCanMountException('SignedTransactionCryptum')

    return new SignedTransactionCryptum(signedTransaction)
  }
}

module.exports = new UseCases()
