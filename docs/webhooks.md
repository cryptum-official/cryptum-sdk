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

ps.: If you not provide a valid WebhookCryptum, the Cryptum sdk will throw an exception.

## List you Webhooks

```js
const webhookController = sdk.getWebhooksController()
const webhooks = await webhookController.getWebhooks({ protocol: 'BITCOIN' })
console.log(webhooks)
// Log your WebhookCryptum list
```

## Delete a Webhook

```js
const webhookController = sdk.getWebhooksController()
const webhooks = await webhookController.destroyWebhook({
  protocol: 'BITCOIN',
  webhookId: 'ba291cc3-1e29-4c70-b716-b4185891c569',
})
```
