const assert = require('assert')
const WebhookCryptum = require('../../src/features/webhooks/entity')
const WebhookCryptumUseCase = require('../../src/features/webhooks/use-cases')

describe.only('Test Suite of the Webhook (Use Cases)', function () {

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (With valid data) : mountWebhookToCreate', async () => {
    const data = {
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = new WebhookCryptum(data)

    const result = WebhookCryptumUseCase.mountWebhookToCreate(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (Without asset) : mountWebhookToCreate', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      asset: 'BTC',
      url: 'https://site.com',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: '6',
      protocol: 'BITCOIN',
    }

    try {
      WebhookCryptumUseCase.mountWebhookToCreate(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (Without url) : mountWebhookToCreate', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      asset: 'BTC',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: '6',
      protocol: 'BITCOIN',
    }

    try {
      WebhookCryptumUseCase.mountWebhookToCreate(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (Without event) : mountWebhookToCreate', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      asset: 'BTC',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: '6',
      protocol: 'BITCOIN',
    }

    try {
      WebhookCryptumUseCase.mountWebhookToCreate(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (Without address) : mountWebhookToCreate', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      asset: 'BTC',
      url: 'https://site.com',
      event: 'tx-confirmation',
      confirmations: '6',
      protocol: 'BITCOIN',
    }

    try {
      WebhookCryptumUseCase.mountWebhookToCreate(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (Without confirmations) : mountWebhookToCreate', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      asset: 'BTC',
      url: 'https://site.com',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      protocol: 'BITCOIN',
    }

    try {
      WebhookCryptumUseCase.mountWebhookToCreate(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (Without protocol) : mountWebhookToCreate', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      asset: 'BTC',
      url: 'https://site.com',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: '6',
    }

    try {
      WebhookCryptumUseCase.mountWebhookToCreate(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (With invalid protocol) : mountWebhookToCreate', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      asset: 'BTC',
      url: 'https://site.com',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: '6',
      protocol: 'BITCOINS',
    }

    try {
      WebhookCryptumUseCase.mountWebhookToCreate(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (With invalid event) : mountWebhookToCreate', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      asset: 'BTC',
      url: 'https://site.com',
      event: 'tx-confirmations',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: '6',
      protocol: 'BITCOIN',
    }

    try {
      WebhookCryptumUseCase.mountWebhookToCreate(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (With invalid event - Using WebhookCryptumObject) : mountWebhookToCreate', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      asset: 'BTC',
      url: 'https://site.com',
      event: 'tx-confirmations',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: '6',
      protocol: 'BITCOIN',
    }

    try {
      const webhook = new WebhookCryptum(data)
      WebhookCryptumUseCase.mountWebhookToCreate(webhook)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (With invalid protocol - Using WebhookCryptumObject) : mountWebhookToCreate', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      asset: 'BTC',
      url: 'https://site.com',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: '6',
      protocol: 'BITCOINS',
    }

    try {
      const webhook = new WebhookCryptum(data)
      WebhookCryptumUseCase.mountWebhookToCreate(webhook)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (With valid data) : mountWebhook', async () => {
    const data = {
      id: 'ed34b1e3-9689-4976-8277-c8e97768beaa',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    const expectedResult = new WebhookCryptum(data)

    const result = WebhookCryptumUseCase.mountWebhook(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (Without url) : mountWebhook', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      id: 'ed34b1e3-9689-4976-8277-c8e97768beaa',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    try {
      WebhookCryptumUseCase.mountWebhook(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (Without event) : mountWebhook', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      id: 'ed34b1e3-9689-4976-8277-c8e97768beaa',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    try {
      WebhookCryptumUseCase.mountWebhook(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (Without address) : mountWebhook', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      id: 'ed34b1e3-9689-4976-8277-c8e97768beaa',
      event: 'tx-confirmation',
      url: 'https://site.com',
      confirmations: 6,
    }

    try {
      WebhookCryptumUseCase.mountWebhook(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (Without confirmations) : mountWebhook', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      id: 'ed34b1e3-9689-4976-8277-c8e97768beaa',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
    }

    try {
      WebhookCryptumUseCase.mountWebhook(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (With invalid event) : mountWebhook', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      id: 'ed34b1e3-9689-4976-8277-c8e97768beaa',
      event: 'tx-confirmations',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    try {
      WebhookCryptumUseCase.mountWebhook(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Webhook Cryptum to create in Cryptum API (With invalid event - Using WebhookCryptumObject) : mountWebhook', async () => {
    const expectedResult = 'Not can mount WebhookCryptum entity'

    const data = {
      id: 'ed34b1e3-9689-4976-8277-c8e97768beaa',
      event: 'tx-confirmations',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    try {
      const webhook = new WebhookCryptum(data)
      WebhookCryptumUseCase.mountWebhook(webhook)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })
})
