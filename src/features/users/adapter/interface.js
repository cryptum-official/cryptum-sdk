const { NotImplementedException } = require('../../../../errors')

class Interface {
  /**
   * Method to check user and get your respective data in backend using axios.
   *
   * @param {Object} credentials an object with this data: { email: sample@blockforce.in password: sample12!4 }
   * @param {Object} config an object with this data: { enviroment: 'production'/'development' }
   */
  auth(credentials, config) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
