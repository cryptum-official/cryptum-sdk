const { NotImplementedException } = require('../../../../errors')
class Interface {

  /**
   * Method to create an webhook in Cryptum of the backend using axios
   * 
   * @param {object} webhook object with all webhook data required: { asset, url, event, address, confirmations, protocol }
   * @param {object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
   createWebhook(webhook, config) {
    throw new NotImplementedException()
  }

  /**
   * Method to get webhooks of the Cryptum of the backend using axios
   * 
   * @param {string} asset asset to get respective webhooks
   * @param {string} protocol protocol to get yours webhooks
   * @param {object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   */
  getWebhooks(asset, protocol, config) {
    throw new NotImplementedException()
  }

  /**
   * Method to destroy an webhook of the Cryptum of the backend using axios
   * 
   * @param {object} webhookDestroy object with all data required to destroy: { asset, webhookId, protocol }
   * @param webhookDestroy.asset
   * @param webhookDestroy.webhookId
   * @param {object} config an object with this data: { enviroment: 'development'/'production', apiKey: XXXXXXX }
   * @param webhookDestroy.protocol
   */
  destroyWebhook({ asset, webhookId, protocol }, config) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
