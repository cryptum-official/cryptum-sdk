const AxiosApi = require('../../axios')
const {
  UnauthorizedException,
  GenericException,
  NotCanMountException,
  NotImplementedException,
  InvalidTypeException,
} = require('../../errors')

/**
 * Method to get an specific api method how get, post, put and delete
 *
 * All methods present in axios are compatibles with this method
 * @param {Object} setup an object with this data: { requests, key, config }, requests an list with requests,
 * an example is { key: { method: 'post' } }, key an string key to get specific request, and config is an object
 * with this data: { enviroment: 'production'/'development' }
 *
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
 * @param {*} error Error for analysis
 */
const handleRequestError = error => {
  if (error instanceof NotCanMountException) throw error
  if (error instanceof NotImplementedException) throw error
  if (error instanceof InvalidTypeException) throw error
  if (error instanceof GenericException) throw error

  if (
    !error ||
    !error.response ||
    !error.response.data ||
    !error.response.data.error
  )
    throw new Error('An error not mapped has occurred')

  if (error.response.status === 401) throw new UnauthorizedException()

  const mappedError = error.response.data.error
  throw new GenericException(
    mappedError.code ?? mappedError.type,
    mappedError.message ?? mappedError.type
  )
}

/**
 * Method to mount an hearders with api key
 *
 * @param {string} apiKeyCryptum need an api key cryptum to add key
 * @returns an object with x-api-key value
 */
const mountHeaders = apiKeyCryptum => {
  if (!apiKeyCryptum)
    throw new GenericException('0001', 'Required apiKeyCryptum')

  return { 'x-api-key': apiKeyCryptum }
}

/**
 * Mehtod to verify if protocol is supported by Cryptum
 *
 * @param {string} protocol string with protocol enum, you can use only ['ETHEREUM' or 'BITCOIN'] protocols
 * @returns true if protocol is valid, and false if not
 */
const isValidProtocol = protocol => {
  return protocol === 'ETHEREUM' || protocol === 'BITCOIN'
}

module.exports = {
  getApiMethod,
  handleRequestError,
  mountHeaders,
  isValidProtocol,
}
