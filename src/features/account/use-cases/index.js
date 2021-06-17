const { NotCanMountException } = require('../../../../errors')

const UserAccountCryptum = require('../entity')
const Interface = require('./interface')

class UseCases extends Interface {
  mountUserAccountToCreate(account) {
    if (!account) throw new NotCanMountException('UserAccountCryptum')

    return new UserAccountCryptum(account)
  }

  mountUserAccount(account) {
    if (!account) throw new NotCanMountException('TransactionCryptum')
    
    return new UserAccountCryptum(account)
  }
}

module.exports = new UseCases()
