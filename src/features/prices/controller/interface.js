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
   * Async method to retrieve prices of the given asset
   *
   * @param {string} asset string with the symbol of the asset
   */
  getPrices(asset) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
