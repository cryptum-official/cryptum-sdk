const { handleRequestError } = require('../../../services')
const { getApiMethod, mountHeaders } = require('../../../services')

const requests = require('./requests.json')
const Interface = require('./interface')

class Controller extends Interface {
  /**
   * Method to create an webhook in Cryptum
   *
   * @param {object} webhook object with all webhook data required: { asset, url, event, address, confirmations, protocol }
   * @param {string} webhook.asset
   * @param {string} webhook.url
   * @param {string} webhook.event
   * @param {string} webhook.address
   * @param {number} webhook.confirmations
   * @param {Protocol} webhook.protocol
   */
  async createWebhook(webhook) {
    try {
      const method = getApiMethod({ requests, key: 'createWebhook', config: this.config })
      const headers = mountHeaders(this.config.apiKey)

      const response = await method(requests.createWebhook.url, webhook, {
        headers,
      })
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Method to get webhooks of the Cryptum
   * @param {object} input 
   * @param {string} input.protocol protocol to get yours webhooks
   * @param {string=} input.asset asset to get respective webhooks
   * @param {string=} input.limit pagination limit
   * @param {string=} input.offset pagination offset
   * @param {string=} input.startDate pagination start date
   * @param {string=} input.endDate pagination end date
   */
  async getWebhooks({ asset, protocol, startDate, endDate, limit, offset }) {
    try {
      const method = getApiMethod({ requests, key: 'getWebhooks', config: this.config })
      const headers = mountHeaders(this.config.apiKey)

      const qs = [`protocol=${protocol}`]
      if (asset) qs.push(`asset=${asset}`)
      if (startDate) qs.push(`startDate=${startDate}`)
      if (endDate) qs.push(`endDate=${endDate}`)
      if (limit) qs.push(`limit=${asset}`)
      if (offset) qs.push(`offset=${asset}`)

      const response = await method(`${requests.getWebhooks.url}?${qs.join('&')}`, {
        headers,
      })
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Method to destroy an webhook of the Cryptum
   *
   * @param {object} webhookDestroy object with all data required to destroy: { webhookId, protocol }
   * @param {string} webhookDestroy.webhookId
   * @param {string} webhookDestroy.protocol
   */
  async destroyWebhook({ webhookId, protocol }) {
    try {
      const method = getApiMethod({ requests, key: 'destroyWebhook', config: this.config })
      const headers = mountHeaders(this.config.apiKey)

      const response = await method(`${requests.destroyWebhook.url}/${webhookId}?protocol=${protocol}`, {
        headers,
      })
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
