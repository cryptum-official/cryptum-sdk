const { NotCanMountException } = require('../../../../errors')

const WebhookCryptum = require('../entity')
const Interface = require('./interface')

class UseCases extends Interface {
  mountWebhookToCreate(webhook) {
    if (!webhook) throw new NotCanMountException('WebhookCryptum')
    if (!WebhookCryptum.canCreate(webhook))
      throw new NotCanMountException('WebhookCryptum')

    return new WebhookCryptum(webhook)
  }

  mountWebhook(webhook) {
    if (!webhook) throw new NotCanMountException('WebhookCryptum')
    if (!WebhookCryptum.validateMandatoryValues(webhook))
      throw new NotCanMountException('WebhookCryptum')

    return new WebhookCryptum(webhook)
  }
}

module.exports = new UseCases()
