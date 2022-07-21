# Webhooks

## Create a Webhook

```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY'
})

const webhook = await sdk.webhook.createWebhook({
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

## List you Webhooks

```js
const webhooks = await sdk.webhook.getWebhooks({ protocol: 'BITCOIN' })
console.log(webhooks)
// Log your WebhookCryptum list
```

## Delete a Webhook

```js
const webhooks = await sdk.webhook.destroyWebhook({
  protocol: 'BITCOIN',
  webhookId: 'ba291cc3-1e29-4c70-b716-b4185891c569',
})
```
