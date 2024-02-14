class Interface {
    /**
     * Method to configure required adapters and general configs
     *
     * @param {import("../../../..").Config} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
     */
    constructor(config) {
      this.config = config
    }
  }
  
  module.exports = Interface
  