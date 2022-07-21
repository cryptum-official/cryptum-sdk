const { getApiMethod, mountHeaders, handleRequestError } = require('../../../services')
const Interface = require('./interface')
const Prices = require('../entity')
const requests = require('./requests.json');
const {
  InvalidTypeException,
} = require('../../../errors')

class Controller extends Interface {
  /**
   * Async method to retrieve prices of the given asset
   *
   * @param {string} asset string with the symbol of the asset
   */
  async getPrices(asset) {
    if (!asset || typeof asset !== 'string') {
      throw new InvalidTypeException('asset', 'string');
    }

    try {

      const apiRequest = getApiMethod({ requests, key: 'getPrices', config: this.config })
      const headers = mountHeaders(this.config.apiKey)

      const response = await apiRequest(`${requests.getPrices.url}/${asset}`, {
        headers,
      })

      return new Prices(response.data)
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
