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
   * Is an sync method to create an ApiKeyCryptum object.
   *
   * @param {Object} apikey an object with all data required how: { id, key, accessLevel: ['read' or 'write' or 'fullaccess']}
   */
  createApiKey(apikey) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
