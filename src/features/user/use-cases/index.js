const { NotCanMountException } = require('../../../../errors')

const UserCryptum = require('../entity')
const Interface = require('./interface')

class UseCases extends Interface {
  mount(user) {
    if (!UserCryptum.validateMandatoryValues(user))
      throw new NotCanMountException('User')

    return new UserCryptum(user)
  }
}

module.exports = new UseCases()
