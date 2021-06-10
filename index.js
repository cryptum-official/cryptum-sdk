const ApiKeyController = require('./src/features/api-keys/controller')
const WebhooksController = require('./src/features/webhooks/controller')

class CryptumSDK {
  constructor({ config, apiKey }) {
    this.config = config
    this.apiKey = apiKey
  }

  /**
   * Method to get an controller to manipulate a api keys using cryptum.
   *
   * @returns an ApiKeyController instance class to manipulate
   */
  getApiKeyController() {
    return new ApiKeyController(this.config)
  }

  /**
   * Method to get an controller to create, get and delete webhooks
   * 
   * @returns an WebhooksController instance class to manipulate
   */
  getWebhooksController() {
    return new WebhooksController(this.config, this.apiKey)
  }
}

module.exports = CryptumSDK
