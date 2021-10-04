# Webhooks

## Create a Webhook

You need only instantiate Webhook controller and send your webhook to cryptum 🚀

```js
const webhookController = sdk.getWebhooksController()
const webhook = await webhookController.createWebhook({
  asset: 'ETH',
  event: 'tx-confirmation',
  url: 'https://site.com',
  address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
  confirmations: 6,
  protocol: 'ETHEREUM',
})
console.log(webhook)
// Log your WebhookCryptum
```

ps.: If you not provide an WebhookCryptum valid, the Cryptum sdk return an exception.

## List you Webhooks

You need only instantiate Webhook controller and your protocol to cryptum 🚀

```js
const webhookController = sdk.getWebhooksController()
const webhooks = await webhookController.getWebhooks({ protocol: 'BITCOIN' })
console.log(webhooks)
// Log your WebhookCryptum list
```

ps.: If you not provide an asset or protocol valid, the Cryptum sdk return an exception.

## Delete a Webhook

You need only instantiate Webhook controller and send your asset, protocol and webhookId to cryptum 🚀

```js
const webhookController = sdk.getWebhooksController()
const webhooks = await webhookController.destroyWebhook({
  protocol: 'BITCOIN',
  webhookId: 'ba291cc3-1e29-4c70-b716-b4185891c569',
})
```

ps.: If you don't provide an asset, protocol and webhookId valid, the Cryptum sdk return an exception.
