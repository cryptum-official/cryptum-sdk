const assert = require('assert')
const WebhookCryptum = require('../../src/features/webhooks/entity')

describe.only('Test Suite of the Webhook (Entity)', function () {
  it('Check if an valid WebhookCryptum is an WebhookCryptum (With API response) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    const webhook = new WebhookCryptum(data)

    const expectedResult = true
    const result = WebhookCryptum.isWebhookCryptum(webhook)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid WebhookCryptum is an WebhookCryptum (With FULL DATA) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const webhook = new WebhookCryptum(data)

    const expectedResult = true
    const result = WebhookCryptum.isWebhookCryptum(webhook)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid WebhookCryptum is not an WebhookCryptum (Without confirmations in API response) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
    }

    const webhook = new WebhookCryptum(data)

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(webhook)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid WebhookCryptum is not an WebhookCryptum (Without address in API response) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      event: 'tx-confirmation',
      url: 'https://site.com',
      confirmations: 6,
    }

    const webhook = new WebhookCryptum(data)

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(webhook)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid WebhookCryptum is not an WebhookCryptum (Without url in API response) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    const webhook = new WebhookCryptum(data)

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(webhook)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid WebhookCryptum is not an WebhookCryptum (Without event in API response) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    const webhook = new WebhookCryptum(data)

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(webhook)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid WebhookCryptum is not an WebhookCryptum (Without id in API response) : isWebhookCryptum', async () => {
    const data = {
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    const webhook = new WebhookCryptum(data)

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(webhook)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON not is an WebhookCryptum (With API response) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON not is an WebhookCryptum (With FULL DATA) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an WebhookCryptum (Without confirmations) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an WebhookCryptum (Without address) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an WebhookCryptum (Without url) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      asset: 'BTC',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an WebhookCryptum (Without event) : isWebhookCryptum', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      asset: 'BTC',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an WebhookCryptum (Without id) : isWebhookCryptum', async () => {
    const data = {
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.isWebhookCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid WebhookCryptum contains mandatory values to an valid WebhookCryptum : validateMandatoryValues', async () => {
    const data = {
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const webhook = new WebhookCryptum(data)

    const expectedResult = false
    const result = WebhookCryptum.validateMandatoryValues(webhook)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid WebhookCryptum contains mandatory values to an valid WebhookCryptum : validateMandatoryValues', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const webhook = new WebhookCryptum(data)

    const expectedResult = true
    const result = WebhookCryptum.validateMandatoryValues(webhook)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON contains mandatory values to an valid WebhookCryptum : validateMandatoryValues', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = true
    const result = WebhookCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON contains mandatory values to an valid WebhookCryptum (Without id) : validateMandatoryValues', async () => {
    const data = {
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON contains mandatory values to an valid WebhookCryptum (Without event) : validateMandatoryValues', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    const expectedResult = false
    const result = WebhookCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON contains mandatory values to an valid WebhookCryptum (Without url) : validateMandatoryValues', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    const expectedResult = false
    const result = WebhookCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON contains mandatory values to an valid WebhookCryptum (Without address) : validateMandatoryValues', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      event: 'tx-confirmation',
      url: 'https://site.com',
      confirmations: 6,
    }

    const expectedResult = false
    const result = WebhookCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON contains mandatory values to an valid WebhookCryptum (Without confirmations) : validateMandatoryValues', async () => {
    const data = {
      id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
    }

    const expectedResult = false
    const result = WebhookCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an null contains mandatory values to an valid WebhookCryptum (With null) : validateMandatoryValues', async () => {
    const expectedResult = false
    const result = WebhookCryptum.validateMandatoryValues(null)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an undefined contains mandatory values to an valid WebhookCryptum (With undefined) : validateMandatoryValues', async () => {
    const expectedResult = false
    const result = WebhookCryptum.validateMandatoryValues(undefined)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with WebhookCryptum can create an WebhookCryptum in API (With valid data) : canCreate', async () => {
    const data = {
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const webhook = new WebhookCryptum(data)

    const expectedResult = true
    const result = WebhookCryptum.canCreate(webhook)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an WebhookCryptum (With valid data) : canCreate', async () => {
    const data = {
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = true
    const result = WebhookCryptum.canCreate(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an WebhookCryptum (Without asset) : canCreate', async () => {
    const data = {
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.canCreate(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an WebhookCryptum (Without event) : canCreate', async () => {
    const data = {
      asset: 'BTC',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.canCreate(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an WebhookCryptum (Without url) : canCreate', async () => {
    const data = {
      asset: 'BTC',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.canCreate(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an WebhookCryptum (Without address) : canCreate', async () => {
    const data = {
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.canCreate(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an WebhookCryptum (Without confirmations) : canCreate', async () => {
    const data = {
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.canCreate(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an WebhookCryptum (Without protocol) : canCreate', async () => {
    const data = {
      asset: 'BTC',
      event: 'tx-confirmation',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
    }

    const expectedResult = false
    const result = WebhookCryptum.canCreate(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an WebhookCryptum (With invalid event) : canCreate', async () => {
    const data = {
      asset: 'BTC',
      event: 'tx-confirmations',
      url: 'https://site.com',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: 6,
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = WebhookCryptum.canCreate(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if is valid event to one WebhookCryptum (Invalid) : isValidEvent', async () => {
    const expectedResult = false
    const result = WebhookCryptum.isValidEvent('tx-confirmations')
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if is valid event to one WebhookCryptum (Valid) : isValidEvent', async () => {
    const expectedResult = true
    const result = WebhookCryptum.isValidEvent('tx-confirmation')
    assert.deepStrictEqual(result, expectedResult)
  })
})
