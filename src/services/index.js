const AxiosApi = require('../axios')
const rawAxios = require('axios')
const { GenericException } = require('../errors')

/**
 * Method to get an specific api method how get, post, put and delete
 *
 * All methods present in axios are compatibles with this method
 *
 * @param {object} setup an object with this data: { requests, key, config }, requests an list with requests,
 * an example is { key: { method: 'post' } }, key an string key to get specific request, and config is an object
 * with this data: { enviroment: 'production'/'development' }
 * @param setup.requests
 * @param setup.key
 * @param setup.config
 * @returns an method to make an request using axios
 */
const getApiMethod = ({ requests, key, config }) => {
  const axios = new AxiosApi(config)
  const api = axios.getInstance()

  const value = requests[key]
  const method = api[value.method.toLowerCase()]
  return method
}

/**
 * Method to handle errors and throw an error by response
 *
 * @param {*} error Error for analysis
 */
const handleRequestError = (error) => {
  if (error) {
    if (error.response) {
      const message =
        (error.response.data.error && error.response.data.error.message) ||
        error.response.data.message ||
        'Service unavailable at the moment'
      const code =
        typeof error.response.data.error === 'string'
          ? error.response.data.error
          : (error.response.data.error && error.response.data.error.code) || error.response.data.code || 'InternalError'
      throw new GenericException(message, code)
    }
  }
  throw error
}

const makeRequest = async ({ method, url, params, headers, body, config }) => {
  try {
    const axios = new AxiosApi(config)
    const api = axios.getInstance()

    const response = await api({
      method,
      url,
      params,
      headers: { ...headers, ...mountHeaders(config.apiKey) },
      data: body,
    })
    return response.data
  } catch (error) {
    handleRequestError(error)
  }
}
/**
 * Method to mount an hearders with api key
 *
 * @param {string} apiKeyCryptum need an api key cryptum to add key
 * @returns an object with x-api-key value
 */
const mountHeaders = (apiKeyCryptum) => {
  if (!apiKeyCryptum) throw new GenericException('Required API Key', 'ConfigException')

  return { 'x-api-key': apiKeyCryptum }
}

/**
 * Mehtod to verify if protocol is supported by Cryptum
 *
 * @param {string} protocol string with protocol enum, you can use only ['ETHEREUM' or 'BITCOIN'] protocols
 * @returns true if protocol is valid, and false if not
 */
const isValidProtocol = (protocol) => {
  return protocol === 'ETHEREUM' || protocol === 'BITCOIN'
}

module.exports = {
  getApiMethod,
  handleRequestError,
  mountHeaders,
  isValidProtocol,
  makeRequest,
}
