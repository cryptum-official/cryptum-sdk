const { getApiMethod, mountHeaders } = require('../../../services')

const Interface = require('./interface')
const requests = require('./requests.json')

class Adapter extends Interface {
  createWebhook(webhook, config) {
    const method = getApiMethod({ requests, key: 'createWebhook', config })
    const headers = mountHeaders(config.apiKey)

    return method(`${requests.createWebhook.url}/${webhook.asset}`, webhook, {
      headers,
    })
  }

  getWebhooks(asset, protocol, config) {
    const method = getApiMethod({ requests, key: 'getWebhooks', config })
    const headers = mountHeaders(config.apiKey)

    return method(`${requests.getWebhooks.url}/${asset}`, {
      headers,
      params: { protocol },
    })
  }

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
