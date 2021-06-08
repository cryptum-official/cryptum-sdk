const UseCases = require('../use-cases')
const { handleRequestError } = require('../../../services')

const Adapter = require('../adapter')
const Interface = require('./interface')

class Controller extends Interface {
  async createWebhook(webhook) {
    try {
      const webhookCryptum = UseCases.mountWebhookToCreate(webhook)

      const { data } = await Adapter.createWebhook(webhookCryptum, this.config)
      return UseCases.mountWebhook({ ...webhookCryptum, ...data })
    } catch (error) {
      handleRequestError(error)
    }
  }

  async getWebhooks(asset, protocol) {
    try {
      const { data } = await Adapter.getWebhooks(asset, protocol, this.config)

      const webhooks = data.map(webhook => UseCases.mountWebhook(webhook))
      return webhooks
    } catch (error) {
      handleRequestError(error)
    }
  }

  async destroyWebhook({ asset, webhookId, protocol }) {
    try {
      const { data } = await Adapter.destroyWebhook(
        { asset, webhookId, protocol },
        this.config
      )
      return data
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
