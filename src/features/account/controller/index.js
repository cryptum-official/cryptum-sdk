const UseCases = require('../use-cases')
const { handleRequestError } = require('../../../services')

const Adapter = require('../adapter')
const Interface = require('./interface')

class Controller extends Interface {
  async create(account) {
    try {
      const userAccountCryptum = UseCases.mountUserAccountToCreate(account)

      const { data } = await Adapter.createUserAccount(
        userAccountCryptum,
        this.config
      )

      return UseCases.mountUserAccount({ ...userAccountCryptum, ...data })
    } catch (error) {
      handleRequestError(error)
    }
  }

  async update(account) {
    try {
      const userAccountCryptum = UseCases.mountUserAccountToCreate(account)

      const { data } = await Adapter.updateUserAccount(
        userAccountCryptum,
        this.config
      )

      return UseCases.mountUserAccount({ ...userAccountCryptum, ...data })
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
