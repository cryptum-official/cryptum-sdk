const UseCases = require('../use-cases')
const UserCryptum = require('../../users/entity')
const { handleRequestError } = require('../../../services')
const { InvalidTypeException } = require('../../../../errors')

const Adapter = require('../adapter')
const Interface = require('./interface')

class Controller extends Interface {
  async getApiKeys(user) {
    try {
      if (!UserCryptum.isUserCryptum(user))
        throw new InvalidTypeException('user', 'UserCryptum')

      const { data } = await Adapter.getApiKeys(user, this.config)
      return UseCases.mountApiKeys(data.apikeys)
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
