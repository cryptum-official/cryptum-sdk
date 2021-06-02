const UseCases = require('../use-cases')
const { handleRequestError } = require('../../../services')

const Adapter = require('../adapter')
const Interface = require('./interface')

class Controller extends Interface {
  async getApiKeys(user) {
    try {
      const { data } = await Adapter.getApiKeys(user, this.config)
      return UseCases.mountApiKeys(data.apikeys)
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
