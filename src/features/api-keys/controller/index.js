const UseCases = require('../use-cases')
const { handleRequestError } = require('../../../services')
const { InvalidTypeException } = require('../../../../errors')
const Interface = require('./interface')

class Controller extends Interface {
  createApiKey(apiKey) {
    try {
      return UseCases.mountApiKey(apiKey)
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
