const { NotImplementedException } = require('../../../../errors')

class Interface {
  /**
   * Method to mount and validate an Cryptum user
   * @param {Object} user an Object with all user data needed
   */
  mount(user) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
