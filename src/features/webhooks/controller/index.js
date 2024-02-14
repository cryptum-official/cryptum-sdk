module.exports.getWebhooksControllerInstance = (config) => new Controller(config)
const { makeRequest } = require("../../../services")

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
    const { protocol, address, asset, confirmations, event, url } = webhook

    return makeRequest({
      method: 'post',
      url: `/webhook?protocol=${protocol}`,
      body: { address, asset, confirmations, event, url },
      config: this.config
    })
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
    const qs = [`protocol=${protocol}`]
    if (asset) qs.push(`asset=${asset}`)
    if (startDate) qs.push(`startDate=${startDate}`)
    if (endDate) qs.push(`endDate=${endDate}`)
    if (limit) qs.push(`limit=${limit}`)
    if (offset) qs.push(`offset=${offset}`)

    return makeRequest({
      method: 'get',
      url: `/webhook?${qs.join("&")}`,
      config: this.config
    })

  }
  /**
   * Method to destroy an webhook of the Cryptum
   *
   * @param {object} webhookDestroy object with all data required to destroy: { webhookId, protocol }
   * @param {string} webhookDestroy.webhookId
   * @param {string} webhookDestroy.protocol
   */
  async destroyWebhook({ webhookId, protocol }) {
    return makeRequest({
      method: 'delete',
      url: `/webhook/${webhookId}?protocol=${protocol}`,
      config: this.config
    })
  }
}

module.exports.WebhooksController = Controller
