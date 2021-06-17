const { NotImplementedException } = require('../../../../errors')
class Interface {

  /**
   * Method to create an user account in Cryptum of the backend using axios
   * 
   * @param {Object} account an Object with { internalId, name, phone, email }
   * @param {Object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
   createUserAccount(account, config) {
    throw new NotImplementedException()
  }

  /**
   * Method to update an user account in Cryptum of the backend using axios
   * 
   * @param {Object} account an Object with { internalId, name, phone, email }
   * @param {Object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
   updateUserAccount(account, config) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
