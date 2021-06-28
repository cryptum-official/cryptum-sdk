/* eslint-disable no-unused-vars */
const { NotImplementedException } = require('../../../../errors')

class Interface {
  /**
   * Method to mount and validate an Cryptum Webhook to create in API
   * 
   * @param {object} webhook an Object with { asset, url, event, address, confirmations, protocol }
   * All data required to create an new webhook
   */
   mountWebhookToCreate(webhook) {
    throw new NotImplementedException()
  }

  /**
   * Method to mount and validate an Cryptum Webhook saved in backend
   * 
   * @param {object} webhook an Object with { id, event, url, address, confirmations }
   * All data returned of the Cryptum API
   */
   mountWebhook(webhook) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
