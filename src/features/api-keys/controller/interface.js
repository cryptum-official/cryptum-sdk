const { NotImplementedException } = require('../../../../errors')
const UserCryptum = require('../../user/entity')

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
   * Is an async method to get api keys and your respective data, how key, name, accessLevel and more.
   *
   * @param {UserCryptum} user an object UserCryptum returned of the login
   */
  getApiKeys(user) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
