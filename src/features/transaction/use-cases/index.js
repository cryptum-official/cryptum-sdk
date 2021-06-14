const { NotCanMountException } = require('../../../../errors')

const TransactionCryptum = require('../entity')
const Interface = require('./interface')

class UseCases extends Interface {
  mountTransactionToSign(transaction) {
    if (!transaction) throw new NotCanMountException('TransactionCryptum')
    if (!TransactionCryptum.canSign(transaction))
      throw new NotCanMountException('TransactionCryptum')

    return new TransactionCryptum(transaction)
  }

  mountTransaction(transaction) {
    if (!transaction) throw new NotCanMountException('TransactionCryptum')
    if (!TransactionCryptum.validateMandatoryValues(transaction))
      throw new NotCanMountException('TransactionCryptum')

    return new TransactionCryptum(transaction)
  }
}

module.exports = new UseCases()
