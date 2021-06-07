const { NotImplementedException } = require('../../../../errors')

class Interface {
  /**
   * Method to mount and validate an Cryptum Api Keys
   * 
   * @param {List<Object>} apiKeys an Object with all api keys data needed
   */
   mountApiKeys(apiKeys) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
