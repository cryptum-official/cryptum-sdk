const CryptumSDK = require('./index')

const configuration = {
  config: {
    enviroment: 'development',
    apiKey:
      'QBtX081m3136XMwVIbSGupZmPaL1AEIh1azjgp5DUA2ssGwrhcrCZkPtH3c82E7fA3iJXwgnS221dQaldJP1IHnJef563wuHaI9VreszVznZ0BOpvgMlwbceKEAvoq0zIdA',
  },
}

const sdk = new CryptumSDK(configuration)

const testCreateWebhook = async () => {
  const webhookController = sdk.getWebhooksController()
  const webhook = await webhookController.createWebhook({
    asset: 'BTC',
    event: 'tx-confirmation',
    url: 'https://site.com',
    address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
    confirmations: 6,
    protocol: 'BITCOIN',
  })
  console.log(webhook)
}

const testGetWebhooks = async () => {
  const webhookController = sdk.getWebhooksController()
  const webhooks = await webhookController.getWebhooks('BTC', 'BITCOIN')
  console.log(webhooks)
}

const testDestroyWebhook = async () => {
  const webhookController = sdk.getWebhooksController()
  const webhooks = await webhookController.destroyWebhook({
    asset: 'BTC',
    protocol: 'BITCOIN',
    webhookId: 'ba291cc3-1e29-4c70-b716-b4185891c569',
  })
  console.log(webhooks)
}

testGetWebhooks()
