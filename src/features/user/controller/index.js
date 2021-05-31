// THIS FILE CONTAINS A UNIQUE PURPOSE TEST IMPLEMENTATION.
// WE NEED ADD TEST FILES YET
const UseCases = require('../use-cases')
const { handleRequestError } = require('../../../services')

const Adapter = require('../adapter')
const Interface = require('./interface')
class Controller extends Interface {
  async auth(credentials) {
    try {
      const { data } = await Adapter.auth(credentials, this.config)
      return UseCases.mount(data)
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
