const UserController = require('./src/features/users/controller')
const ApiKeyController = require('./src/features/api-keys/controller')

class CryptumSDK {
  constructor({ config }) {
    this.config = config
  }

  /**
   * Method to get an controller to manipulate a user using cryptum.
   * 
   * @returns an UserController instance class to manipulate
   */
  getUserController() {
    return new UserController(this.config)
  }

  /**
   * Method to get an controller to manipulate a api keys using cryptum.
   * 
   * @returns an ApiKeyController instance class to manipulate
   */
  getApiKeyController() {
    return new ApiKeyController(this.config)
  }
}

module.exports = CryptumSDK
