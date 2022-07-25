const axios = require('axios')
const { GenericException } = require('../errors')

class AxiosApi {
  /**
   * Constructor to initialize configs
   *
   * @param {import('../..').Config} config
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Method to get baseUrl to new axios instance
   *
   * @param {string} environment text with development or production to select specific url to test
   * @returns an text with base url to instance an new axios
   */
  getBaseUrl(environment) {
    if (process.env.CRYPTUM_API_URL) return process.env.CRYPTUM_API_URL
    if (['testnet', 'development'].includes(environment)) return 'https://api-hml.cryptum.io'
    if (['mainnet', 'production'].includes(environment)) return 'https://api.cryptum.io'

    throw new GenericException('Invalid environment', 'ConfigException')
  }

  /**
   * Method to get an axios instance or create an new.
   *
   * @returns axios instance
   */
  getInstance() {
    if (this.api) return this.api

    const baseURL = this.getBaseUrl(this.config.environment)
    this.api = axios.create({ baseURL })
    return this.api
  }
}

module.exports = AxiosApi
