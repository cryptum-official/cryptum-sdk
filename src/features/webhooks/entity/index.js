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
}

module.exports = WebhookCryptum
