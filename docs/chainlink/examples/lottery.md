# About The Project

This tutorial is a step-by-step guide to creating an automation for generating random words using Chainlink's VRF and Chainlink Automation features.

We will demonstrate how to build this project, showcasing the use of our SDK and Chainlink's resources. Follow each step carefully to generate your own automation for random words.

In this project, we will be using the following functionalities:

- Price Feeds
- VRF (Verifiable Random Function)
- Automation

In this example, we'll cover the main part of creating VRF and Automation using our SDK.

---

### DEMO

We've developed a sample project utilizing these features, and you can check out the complete implementation at:

[Cryptum - Lottery](https://github.com/Madureiradaniel/cryptum-lottery)
<p>
  <a href="https://github.com/Madureiradaniel/cryptum-lottery">
    <img src="https://skillicons.dev/icons?i=github" />
  </a>
</p>

The project involves a lottery where the user places a bet by providing 10 numbers. If the newly generated word contains 6 or more of these specified numbers, the user receives a reward.

Explore this playground to simulate bets and observe Chainlink VRF's functionality generating random numbers every 100 mined blocks on the POLYGON - MUMBAI network.

Access the link: 

[Lottery Playground](https://lottery.danielmadureira.dev/)

Provide your email and start playing.

If the game is paused, you can click to initiate.

---

## Requirements

- Basic knowledge of JavaScript.
- NPM
- Node version: ^14.17.0
- [Create account Dashboard Cryptum](../../../README.md#📁creation-of-projects-and-🔑-api-keys)
- Faucets (testnet) LINK and MAUTIC

## Faucets

Many developers and test users of Web3 applications are faced with a barrier: the lack of balance in their wallets to test.
This is because for you to carry out any transaction on the blockchain, you need to pay fees for the network to mine (validate) your transaction. 

To solve this, all blockchain protocols in Test environment (Testnet) provide websites for you to inform your wallet and receive balance to be able to use it.

- MATIC - https://mumbaifaucet.com/
- LINK - https://faucets.chain.link/mumbai



## Getting Started

Open your project

```bash
cd my-amazing-project/
```

Install using npm manager or yarn

```bash
npm install -S cryptum-sdk

yarn add cryptum-sdk
```

#### step 1

With a valid Cryptum API Key, you can then instantiate the SDK as follows:

```js
const CryptumSdk = require('cryptum-sdk')

const sdk = new CryptumSdk({
  environment: 'testnet',  // 'testnet', 'mainnet'
  apiKey: "YOUR-API-KEY-HERE",
})
```

>Implementation example in: [cryptum-lottery/service/Cryptum.js](https://github.com/Madureiradaniel/cryptum-lottery/blob/master/service/Cryptum.js)

#### step 2

Then you call the generateWallet() function passing the protocol you want:

```js
const wallet = await sdk.wallet.generateWallet({ protocol: 'POLYGON' })

```
>Implementation example in: [cryptum-lottery/controller/Wallet.js](https://github.com/Madureiradaniel/cryptum-lottery/blob/master/controller/Wallet.js)

#### step 3

Add faucets to your new wallet.

MATIC and LINK as described in: [Faucets](#faucets)


#### step 4

Create Subscription Chainlink VRF.

```js
const { hash } = await sdk.chainlink.createVRF({
    protocol,
    wallet,
    updateIntervalUpkeep: num_blocks_interval
    // Block interval, the new random word will be generated at each defined interval
})

const { contractAddress } = await sdk.transaction.getTransactionReceiptByHash({
    protocol,
    hash
})

return contractAddress
```

>Implementation example in: [cryptum-lottery/controller/Lottery.js](https://github.com/Madureiradaniel/cryptum-lottery/blob/master/controller/Lottery.js)

#### step 5

Add Funds with LINK in your Subscription.

```js
const { hash } = await sdk.chainlink.topUpVRF({
    protocol,
    address, // contract address generated in step 4
    wallet,
    amount: 10
})
```

#### step 6

Automation setup; this stage is where we create the process responsible for generating a new random word every 'N' blocks.

```js
const { hash } = await sdk.chainlink.createAutomation({
    protocol,
    wallet
})

const { contractAddress } = await sdk.transaction.getTransactionReceiptByHash({
    protocol,
    hash
})

return contractAddress
```
>Implementation example in: [cryptum-lottery/controller/Lottery.js](https://github.com/Madureiradaniel/cryptum-lottery/blob/master/controller/Lottery.js)

#### step 7

Add Funds with LINK in your Automation.

Perform a transfer of LINKs from your wallet to the contract address generated in step 6.

```js
const { hash } = await sdk.token.transfer({
    protocol,
    amount,
    wallet,
    token: LINK_TOKEN_POLYGON_MUMBAI, // 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
    destination: contractAddress // contract address generated in step 6
})
```
>Implementation example in: [cryptum-lottery/controller/Lottery.js](https://github.com/Madureiradaniel/cryptum-lottery/blob/master/controller/Lottery.js)

#### step 8

Register Upkeep.

At this stage, we will register our automation, initiating the process so that new random words are generated after every N number of blocks mined on the blockchain.

```js
const { hash } = await sdk.chainlink.registerUpkeep({
        protocol,
        wallet,
        address: upkeepContract, // contract address generated in step 6
        name: 'Cryptum Random Words',
        encryptedEmail: '0x',
        upkeepContract: subscriptionContract, // contract address generated in step 4
        gasLimit: 500000,
        triggerType: 0,
        checkData: '0x',
        triggerConfig: '0x',
        offchainConfig: '0x',
        amount: '10' // lINK
})
```

>Implementation example in: [cryptum-lottery/controller/Lottery.js](https://github.com/Madureiradaniel/cryptum-lottery/blob/master/controller/Lottery.js)

#### step 9

Getting the generated random words.

Get the last request ID generated in your subscription:

```js
const latestRequestID = await sdk.chainlink.latestRequestVRF({
    protocol,
    address // contract address generated in step 4
})

const randomWords = await sdk.chainlink.getRandomWordsVRF({
        protocol,
        address, // contract address generated in step 4
        requestId // latestRequestID
})

/*
Ex. Response:
{
    fulfilled: true,
    randomWords: [ "123456.....891011"]
}

*/
```

>Implementation example in: [cryptum-lottery/cron/index.js](https://github.com/Madureiradaniel/cryptum-lottery/blob/master/cron/index.js)

#### step 10

Getting information about your subscription and automation:

```js
const subscription = await sdk.chainlink.getSubscriptionVRF({
    protocol,
    address // contract address generated in step 4
})
```

List all upkeeps

```js
const upkeeps = await sdk.chainlink.listUpkeeps({
    protocol,
    address // contract address generated in step 6
})

```
Get info Upkeep ID:

```js
const upkeep = await sdk.chainlink.getUpkeep({
    protocol,
    upkeepID
})
```
>Implementation example in: [cryptum-lottery/controller/Lottery.js](https://github.com/Madureiradaniel/cryptum-lottery/blob/master/controller/Lottery.js)

You can also track your subscription and automation through the chainlink website.

[VRF](https://vrf.chain.link/mumbai)

[Automation](https://automation.chain.link/mumbai/)