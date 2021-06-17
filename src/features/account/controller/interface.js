const { NotImplementedException } = require('../../../../errors')
class Interface {
  /**
   * Method to configure required adapters and general configs
   *
   * @param {Object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   * @param {String} apiKey an string with apikey provided in configuration
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Method to create an user account to Cryptum
   * 
   * @param {Object} account an Object with { internalId, name, phone, email }
   */
   create(account) {
    throw new NotImplementedException()
  }

  /**
   * Method to update an user account to Cryptum
   * 
   * @param {Object} account an Object with { internalId, name, phone, email }
   */
   update(account) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
