const { NotImplementedException } = require('../../../../errors')
class Interface {

  /**
   * Method to create an webhook in Cryptum of the backend using axios
   * 
   * @param {Object} webhook object with all webhook data required: { asset, url, event, address, confirmations, protocol }
   * @param {Object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
   createWebhook(webhook, config) {
    throw new NotImplementedException()
  }

  /**
   * Method to get webhooks of the Cryptum of the backend using axios
   * 
   * @param {string} asset asset to get respective webhooks
   * @param {string} protocol protocol to get yours webhooks
   * @param {Object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
  getWebhooks(asset, protocol, config) {
    throw new NotImplementedException()
  }

  /**
   * Method to destroy an webhook of the Cryptum of the backend using axios
   * 
   * @param {Object} webhookDestroy object with all data required to destroy: { asset, webhookId, protocol }
   * @param {Object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
  destroyWebhook({ asset, webhookId, protocol }, config) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
