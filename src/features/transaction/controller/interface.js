class Interface {
  /**
   * Method to configure required adapters and general configs
   *
   * @param {object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   * @param {string} apiKey an string with apikey provided in configuration
   */
  constructor(config) {
    this.config = config
  }
}

module.exports = Interface
