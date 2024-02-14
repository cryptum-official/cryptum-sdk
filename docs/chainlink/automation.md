# Automation

Automate your smart contracts using a secure and hyper-reliable decentralized network that uses the same external network of node operators that secures billions in value. Building on Chainlink Automation will accelerate your innovation, save you time and money, and help you get to market faster so you don't have to deal with the setup cost, ongoing maintenance, and risks associated with a centralized automation stack.

[Read more about Chainlink Automation](https://docs.chain.link/chainlink-automation)

### Before you begin

Before you begin, you need to ensure that you have a sufficient LINK balance to register the upkeep. You will also need a compatible automation contract.
[Read more](https://docs.chain.link/chainlink-automation/guides/compatible-contracts)

#### Create Automation

Deploy contract responsible for registering and managing new Upkeeps.

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

#### List all Upkeeps 

Return the IDs of the upkeeps generated for the provided contract.

```js
sdk.chainlink.listUpkeeps({
    protocol: 'POLYGON',
    address: contract
})
```

#### Get info Upkeep

Retrieve detailed information about the upkeep using its ID.

```js
sdk.chainlink.getUpkeep({
    protocol: 'POLYGON',
    upkeepID: '26...7074'
})
```

#### Balance Upkeep

Get balance e Minimum Balance upkeep by ID.

```js
sdk.chainlink.getBalanceUpkeep({
    protocol: 'POLYGON',
    address,
    upkeepID
})
```

#### Add Funds Upkeep

Add funds to the upkeep by ID.

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