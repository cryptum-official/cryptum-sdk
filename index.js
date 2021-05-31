const UserController = require('./src/features/user/controller')

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
}

module.exports = CryptumSDK
