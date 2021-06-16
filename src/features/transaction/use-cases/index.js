const { NotCanMountException } = require('../../../../errors')

const TransactionCryptum = require('../entity')
const Interface = require('./interface')

class UseCases extends Interface {
  mountTransactionToSend(transaction) {
    if (!transaction) throw new NotCanMountException('TransactionCryptum')
    if (!TransactionCryptum.canSend(transaction))
      throw new NotCanMountException('TransactionCryptum')

    return new TransactionCryptum(transaction)
  }

  mountSignedTransaction(transaction) {
    if (!transaction) throw new NotCanMountException('TransactionCryptum')
    if (!TransactionCryptum.validateMandatoryValues(transaction))
      throw new NotCanMountException('TransactionCryptum')

    return new TransactionCryptum(transaction)
  }
}

module.exports = new UseCases()
