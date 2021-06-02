const { NotImplementedException } = require('../../../../errors')
const UserCryptum = require('../../user/entity')

class Interface {
  /**
   * Method to check user and get your respective data in backend using axios.
   *
   * @param {UserCryptum} user You need provide you UserCryptum to this action
   * @param {Object} config an object with this data: { enviroment: 'production'/'development' }
   */
   getApiKeys(user, config) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
