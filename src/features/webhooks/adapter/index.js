const { getApiMethod, mountHeaders } = require('../../../services')

const Interface = require('./interface')
const requests = require('./requests.json')

class Adapter extends Interface {
  /**
   * Method to create an webhook in Cryptum of the backend using axios
   *
   * @param {object} webhook object with all webhook data required: { asset, url, event, address, confirmations, protocol }
   * @param {object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
  createWebhook(webhook, config) {
    const method = getApiMethod({ requests, key: 'createWebhook', config })
    const headers = mountHeaders(config.apiKey)

    return method(`${requests.createWebhook.url}/${webhook.asset}`, webhook, {
      headers,
    })
  }
  /**
   * Method to get webhooks of the Cryptum of the backend using axios
   *
   * @param {string} asset asset to get respective webhooks
   * @param {string} protocol protocol to get yours webhooks
   * @param {object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
  getWebhooks(asset, protocol, config) {
    const method = getApiMethod({ requests, key: 'getWebhooks', config })
    const headers = mountHeaders(config.apiKey)

    return method(`${requests.getWebhooks.url}/${asset}`, {
      headers,
      params: { protocol },
    })
  }
  /**
   * Method to destroy an webhook of the Cryptum of the backend using axios
   *
   * @param {object} webhookDestroy object with all data required to destroy: { asset, webhookId, protocol }
   * @param {string} webhookDestroy.asset
   * @param {string} webhookDestroy.webhookId
   * @param {object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   * @param webhookDestroy.protocol
   */
  destroyWebhook({ asset, webhookId, protocol }, config) {
    const method = getApiMethod({ requests, key: 'destroyWebhook', config })
    const headers = mountHeaders(config.apiKey)

    return method(`${requests.destroyWebhook.url}/${asset}/${webhookId}`, {
      headers,
      params: { protocol },
    })
  }
}

module.exports = new Adapter()
