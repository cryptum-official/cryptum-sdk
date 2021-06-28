const UseCases = require('../use-cases')
const { handleRequestError } = require('../../../services')

const Adapter = require('../adapter')
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
      const webhookCryptum = UseCases.mountWebhookToCreate(webhook)

      const { data } = await Adapter.createWebhook(webhookCryptum, this.config)
      return UseCases.mountWebhook({ ...webhookCryptum, ...data })
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Method to get webhooks of the Cryptum
   *
   * @param {string} asset asset to get respective webhooks
   * @param {string} protocol protocol to get yours webhooks
   */
  async getWebhooks(asset, protocol) {
    try {
      const { data } = await Adapter.getWebhooks(asset, protocol, this.config)

      const webhooks = data.map((webhook) => UseCases.mountWebhook(webhook))
      return webhooks
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Method to destroy an webhook of the Cryptum
   *
   * @param {object} webhookDestroy object with all data required to destroy: { asset, webhookId, protocol }
   * @param {string} webhookDestroy.asset
   * @param {string} webhookDestroy.webhookId
   * @param {string} webhookDestroy.protocol
   */
  async destroyWebhook({ asset, webhookId, protocol }) {
    try {
      const { data } = await Adapter.destroyWebhook({ asset, webhookId, protocol }, this.config)
      return data
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
