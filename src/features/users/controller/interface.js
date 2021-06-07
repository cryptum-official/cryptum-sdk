const { NotImplementedException } = require('../../../../errors')

class Interface {

  /**
   * Method to configure required adapters and general configs
   * 
   * @param {Object} config an object with this data: { enviroment: 'development'/'production' }
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Is an async method to check user and get your respective data, how token, name, email and more.
   *
   * @param {Object} credentials an object with this data: { email: sample@blockforce.in password: sample12!4 }
   */
  auth(credentials) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
