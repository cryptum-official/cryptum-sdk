const { isValidProtocol } = require('../../../services')
class WebhookCryptum {
  constructor({ id, asset, event, url, address, confirmations, protocol }) {
    this.id = id
    this.asset = asset
    this.event = event
    this.url = url
    this.address = address
    this.confirmations = confirmations
    this.protocol = protocol
  }

  /**
   * Method to validate if an webhook is valid
   *
   * @param {*} webhook to validate if is an WebhookCryptum valid, to your webhook are valid.
   * The webhook need are registered in Cryptum and has  { id, event, url, address, confirmations } attributes
   * 
   * @returns true if is valid and false if not
   */
  static isWebhookCryptum(webhook) {
    if (!(webhook instanceof WebhookCryptum)) return false

    return this.validateMandatoryValues(webhook)
  }

  /**
   * Validate if an object can mount an WebhookCryptum, not create
   * if you need attributes to create an webhook in cryptum call canCreate method
   *
   * @param {*} object generic object with mandatory values: id, event, url, address, and confirmations
   * @returns true if can mount and false if not
   */
  static validateMandatoryValues(object) {
    if (!object) return false

    const { id, event, url, address, confirmations } = object
    return !!id && !!event && !!url && !!address && !!confirmations && this.isValidEvent(event)
  }

  /**
   * Method to validate if you can create an Webhook in cryptum
   *
   * @param {Object} webhook with this attributes: { asset, event: 'tx-confirmation', address, confirmations, protocol: ['BITCOIN' or 'ETHEREUM'] }
   * @returns
   */
  static canCreate(webhook) {
    if (!webhook) return false

    const { asset, url, event, address, confirmations, protocol } = webhook
    return (
      !!asset &&
      !!url &&
      !!event &&
      !!address &&
      !!confirmations &&
      !!protocol &&
      isValidProtocol(protocol) &&
      this.isValidEvent(event)
    )
  }

  /**
   * Mehtod to verify if event is valid to create an webhook wih cryptum
   * 
   * @param {string} event string with event valid, unique event valid is tx-confirmation
   * @returns true if event is valid, and false if not 
   */
  static isValidEvent(event) {
    return event === 'tx-confirmation'
  }
}

module.exports = WebhookCryptum
