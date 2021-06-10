<br />
<p align="center">
  <h3 align="center">Cryptum SDK</h3>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About Project](#about-project)
- [Starting](#starting)
  - [Installation](#installation)
    - [Requirements for install](#requirements-for-install)
    - [Language used](#language-used)
    - [Commons Steps](#commons-steps)
  - [How To Use](#how-to-use)
    - [Configuration](#configuration)
    - [Wallets](#wallets)
    - [Webhooks](#webhooks)
      - [Create an Webhook](#create-an-webhook)
      - [List you Webhooks](#list-you-webhooks)
      - [Delete an Webhook](#delete-an-webhook)
- [Contributing](#contributing)
  - [What does my PR need to be accepted ? 🤔](#what-does-my-pr-need-to-be-accepted--)
- [License](#license)
- [Contact](#contact)

## About Project

This project is to provide an integration with the Cryptum backend. This project calls Cryptum API using Clean Architecture and NodeJS.
## Starting
### Installation
#### Requirements for install

- NPM installed
- Node version: ^14.17.0
#### Language used

- Javascript
#### Commons Steps

Open your project
```bash
cd my-amazing-project/
```

Install using npm manager or yarn
```bash
npm install cryptum-sdk
yarn add cryptum-sdk
```
### How To Use

Below is an short description using code how you can use cryptum-sdk to integrate your amazing application with us.
#### Configuration

To configure cryptum-sdk you need only provide an config in format JSON.
```js
const CryptumSDK = require('cryptum-sdk')

const cryptum = new CryptumSDK({
  config: {
    enviroment: 'development',
    apiKey: 'my-secret-api-key'
  },
})
```

To see environments available you can see here:
| Environments available |
|------------------------|
| development            |
| production             |

<br>

#### Wallets

You need only to instantiate Wallet controller to manage wallets.

```js
const walletController = cryptum.getWalletController()
// generate random wallet for blockchain protocol
const wallet = await walletController.generateWallet({ protocol: Protocol.STELLAR })

// or using an existing mnemonic
const wallet = await walletController.generateWallet({ protocol: Protocol.ETHEREUM, mnemonic: '<words>...', testnet: true })
```

#### Webhooks

##### Create an Webhook

You need only instantiate Webhook controller and send your webhook to cryptum 🚀

```js
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
// Log your WebhookCryptum
```

ps.: If you not provide an WebhookCryptum valid, the Cryptum sdk return an exception.

##### List you Webhooks

You need only instantiate Webhook controller and send your asset and your protocol to cryptum 🚀

```js
const webhookController = sdk.getWebhooksController()
const webhooks = await webhookController.getWebhooks('BTC', 'BITCOIN')
console.log(webhooks)
// Log your WebhookCryptum list
```

ps.: If you not provide an asset or protocol valid, the Cryptum sdk return an exception.

##### Delete an Webhook

You need only instantiate Webhook controller and send your asset, protocol and webhookId to cryptum 🚀

```js
const webhookController = sdk.getWebhooksController()
const webhooks = await webhookController.destroyWebhook({
  asset: 'BTC',
  protocol: 'BITCOIN',
  webhookId: 'ba291cc3-1e29-4c70-b716-b4185891c569',
})
```

ps.: If you not provide an asset, protocol and webhookId valid, the Cryptum sdk return an exception.


## Contributing

Contributions are what make the open source community an incredible place to learn, inspire and create. Any contribution you make will be **much appreciated**.
1. Make a project Fork
2. Create a Branch for your feature (`git checkout -b feature/amazing-feature`)
3. Insert your changes (`git add .`)
4. Make a commit with your changes (`git commit -m 'feat(<folder-name>): Inserting a Amazing Feature !`)
5. Push the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### What does my PR need to be accepted ? 🤔

In order for us to accept your PR, you need to adhere to the following standards.

1. Create using the code pattern currently used in cryptum-sk
2. Test your update and show artifacts in PR.

It's all 🤷🏻‍♂️
## License

Distributed under the MIT license. See `LICENSE` for more information.

## Contact

Blockforce - [SITE](https://blockforce.in/) - **HELLO@BLOCKFORCE.IN**
