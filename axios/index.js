const axios = require('axios')
const { GenericException } = require('../errors')

class AxiosApi {
  /**
   * Constructor to initialize configs
   *
   * @param {object} config an object with this data: { enviroment: 'development'/'production' }
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Method to get baseUrl to new axios instance
   *
   * @param {string} enviroment text with development or production to select specific url to test
   * @returns an text with base url to instance an new axios
   */
  getBaseUrl(enviroment) {
    if (enviroment === 'development') return 'https://api-dev.cryptum.io'
    if (enviroment === 'production') return 'https://prouction.url.com'

    throw new GenericException('000', 'Invalid enviroment')
  }

  /**
   * Method to get an axios instance or create an new.
   *
   * @returns axios instance
   */
  getInstance() {
    if (this.api) return this.api

    const baseURL = this.getBaseUrl(this.config.enviroment)
    this.api = axios.create({ baseURL })
    return this.api
  }
}

module.exports = AxiosApi
