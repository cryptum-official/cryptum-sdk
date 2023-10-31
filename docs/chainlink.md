# Chainlink

The Cryptum SDK integrates natively with Chainlink, the leading platform for web3 services. Users can interact with Chainlink products within the SDK with a single line of code.

- [Price Feeds](#price-feeds)
  - [Get price by Address](#get-price-by-address)
  - [Get prices by Asset](#get-prices-by-asset)
- [Automation](#automation)
  - [Create](#create-automation)
  - [Register Upkeep](#register-upkeep)
  - [List](#list-upkeeps)
  - [Get Info Upkeep](#get-info-upkeep)
  - [Balance](#balance-upkeep)
  - [Add Funds](#add-funds-upkeep)
  - [Pause](#pause-upkeep)
  - [Unpause](#unpause-upkeep)
  - [Cancel](#cancel-upkeep)
  - [Withdraw](#withdraw-upkeep)
  - [Edit Gas Limit](#edit-gas-limit-upkeep)
- [VRF](#vrf)
  - [Create](#create-vrf)
  - [Get Subscription](#get-subscription)
  - [Get Subscriptio By Id](#get-subscription-by-id)
  - [TopUp Subscription](#topup-subscription)
  - [Request RandomWords](#request-randomwords)
  - [List requests](#list-requests)
  - [Get Latest Request](#get-latest-request)
  - [Get Randomwords](#get-randomwords)
  - [Cancel Subscription](#cancel-subscription)


## Price Feeds

Smart contracts often act in real-time on data such as prices of assets. This is especially true in DeFi.
For example, Synthetix uses Data Feeds to determine prices on their derivatives platform. Lending and borrowing platforms like AAVE use Data Feeds to ensure the total value of the collateral.
Data Feeds aggregate many data sources and publish them on-chain using a combination of the Decentralized Data Model and Off-Chain Reporting.

[Read more about Chainlink Data Feeds](https://docs.chain.link/data-feeds)

Instantiate Cryptum SDK first:
```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY'
})
```

#### Get Price By Address

In our SDK, there are enums of contracts for token pairs on Ethereum mainnet and testnet. If you cannot find the pair you desire, check the available [Price Feeds Addresses](https://docs.chain.link/data-feeds/price-feeds/addresses).


```js
const address = sdk.chainlink.feeds.MAINNET.ETHEREUM.ADA_USD

const price = await sdk.chainlink.getPricesByAddress({
    protocol: "ETHEREUM",
    address: address
})
```

#### Get Prices By Asset

List currency price quotations

```js
const price = await sdk.chainlink.getPrices({
    protocol: "ETHEREUM",
    asset: 'ETH'
})
// Prices {
//   "USD": 0.3495,
//   "BTC": 7.35687406736623e-06,
//   "ETH": 0.00010271074069284932,
//   "SOL":0.00144091,
// }
```

## Automation

Automate your smart contracts using a secure and hyper-reliable decentralized network that uses the same external network of node operators that secures billions in value. Building on Chainlink Automation will accelerate your innovation, save you time and money, and help you get to market faster so you don't have to deal with the setup cost, ongoing maintenance, and risks associated with a centralized automation stack.

[Read more about Chainlink Automation](https://docs.chain.link/chainlink-automation)

### Before you begin

Before you begin, you need to ensure that you have a sufficient LINK balance to register the upkeep. You will also need a compatible automation contract.
[Read more](https://docs.chain.link/chainlink-automation/guides/compatible-contracts)

#### Create Automation

```js
const { hash } = await sdk.chainlink.createAutomation({
    protocol: 'POLYGON',
    wallet
})
```
 Get contract address

```js
 const { contractAddress } = await sdk.transaction.getTransactionReceiptByHash({
    protocol: 'POLYGON',
    hash
})
```

####  Register Upkeep

Params:

<div class="overflow-wrapper"><table><thead><tr><th>Var type</th><th>Var Name</th><th>Example value</th><th>Description</th></tr></thead><tbody><tr><td>String</td><td>name</td><td>"Test upkeep"</td><td>Name of upkeep that will be displayed in the UI.</td></tr><tr><td>bytes</td><td>encryptedEmail</td><td>0x</td><td>Can leave blank. If registering via UI we will encrypt email and store it here.</td></tr><tr><td>address</td><td>upkeepContract</td><td></td><td>Address of your Automation-compatible contract</td></tr><tr><td>uint32</td><td>gasLimit</td><td>500000</td><td>The maximum gas limit that will be used for your txns. Rather over-estimate gas since you only pay for what you use, while too low gas might mean your upkeep doesn't perform. Trade-off is higher gas means higher minimum funding requirement.</td></tr><tr><td>address</td><td>adminAddress</td><td></td><td>The address that will have admin rights for this upkeep. Use your wallet address, unless you want to make another wallet the admin.</td></tr><tr><td>uint8</td><td>triggerType</td><td>0 or 1</td><td>0 is Conditional upkeep, 1 is Log trigger upkeep</td></tr><tr><td>bytes</td><td>checkData</td><td>0x</td><td>checkData is a static input that you can specify now which will be sent into your checkUpkeep or checkLog, see interface.</td></tr><tr><td>bytes</td><td>triggerConfig</td><td>0x</td><td>The configuration for your upkeep. 0x for conditional upkeeps, or see next section for log triggers.</td></tr><tr><td>bytes</td><td>offchainConfig</td><td>0x</td><td>Leave as 0x, placeholder parameter for future.</td></tr><tr><td>uint96</td><td>amount</td><td>1000000000000000000</td><td>Ensure this is less than or equal to the allowance just given, and needs to be in WEI.</td></tr></tbody></table></div>


```js
const { hash } = await  sdk.chainlink.registerUpkeep({
    protocol: 'POLYGON',
    wallet,
    address: contract,
    name: 'Cryptum Sdk',
    encryptedEmail: '0x',
    upkeepContract: '0x', // target contract
    gasLimit: 500000,
    triggerType: 0,
    checkData: '0x',
    triggerConfig: '0x',
    offchainConfig: '0x',
    amount: '10' // lINK
})
```

#### List Upkeeps 

```js
sdk.chainlink.listUpkeeps({
    protocol: 'POLYGON',
    address: contract
})
```

#### Get info Upkeep

```js
sdk.chainlink.getUpkeep({
    protocol: 'POLYGON',
    upkeepID: '26...7074'
})
```

#### Balance Upkeep

```js
sdk.chainlink.getBalanceUpkeep({
    protocol: 'POLYGON',
    address,
    upkeepID
})
```

#### Add Funds Upkeep

```js
sdk.chainlink.addFundsUpkeep({
    protocol: 'POLYGON',
    wallet,
    amount: '10',
    upkeepID
})
```

#### Pause Upkeep

```js
sdk.chainlink.pauseUpkeep({
    protocol: 'POLYGON',
    wallet,
    upkeepID
})
```

### Unpause Upkeep

```js
sdk.chainlink.unpauseUpkeep({
    protocol: 'POLYGON',
    wallet,
    upkeepID
})
```

#### Cancel Upkeep

```js
sdk.chainlink.cancelUpkeep({
    protocol: 'POLYGON',
    wallet,
    upkeepID
})
```

#### Withdraw Upkeep

To withdraw funds, the Upkeep administrator have to cancel the Upkeep first. There is delay once an Upkeep has been cancelled before funds can be withdrawn. The number of blocks delay varies by network and once the delay has passed, you can Withdraw funds.

```js
sdk.chainlink.withdrawUpkeep({
    protocol: 'POLYGON',
    wallet,
    upkeepID
})
```

#### Edit Gas Limit Upkeep

```js
sdk.chainlink.editGasLimitUpkeep({
    protocol: 'POLYGON',
    wallet,
    upkeepID,
    gasLimit: 400000
})
```

## VRF

Chainlink VRF (Verifiable Random Function) is a provably fair and verifiable random number generator (RNG) that enables smart contracts to access random values without compromising security or usability. For each request, Chainlink VRF generates one or more random values and cryptographic proof of how those values were determined. The proof is published and verified on-chain before any consuming applications can use it. This process ensures that results cannot be tampered with or manipulated by any single entity including oracle operators, miners, users, or smart contract developers.

[Read more about Chainlink VRF](https://docs.chain.link/vrf)


#### Create VRF

```js
const { hash } = await sdk.chainlink.createVRF({
    protocol,
    wallet
})

const { contractAddress } = await sdk.transaction.getTransactionReceiptByHash({
    protocol,
    hash
})
```

#### Get Subscription

```js
sdk.chainlink.getSubscriptionVRF({
    protocol,
    address
})
```

#### Get Subscription By Id

```js
sdk.chainlink.getSubscriptionByIdVRF({
    protocol,
    id: 6329
})
```

#### TopUp Subscription

```js
sdk.chainlink.topUpVRF({
    protocol,
    address,
    wallet,
    amount: 10
})
```

#### Request RandomWords

```js
sdk.chainlink.requestRandomWordsVRF({
    protocol,
    address,
    wallet,
    numWords: 2
})
```

#### List requests

```js
sdk.chainlink.requestsVRF({
    protocol,
    address
})
```

#### Get Latest Request
```js
sdk.chainlink.latestRequestVRF({
    protocol,
    address
})
```

#### Get Randomwords

```js
sdk.chainlink.getRandomWordsVRF({
    protocol,
    address,
    requestId
})
```

#### Cancel Subscription

```js
sdk.chainlink.cancelVRF({
     protocol,
     address,
     wallet
})
```