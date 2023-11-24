# VRF

Chainlink VRF (Verifiable Random Function) is a provably fair and verifiable random number generator (RNG) that enables smart contracts to access random values without compromising security or usability. For each request, Chainlink VRF generates one or more random values and cryptographic proof of how those values were determined. The proof is published and verified on-chain before any consuming applications can use it. This process ensures that results cannot be tampered with or manipulated by any single entity including oracle operators, miners, users, or smart contract developers.

[Read more about Chainlink VRF](https://docs.chain.link/vrf)


#### Create VRF

Deploy contract responsible for request and managing random words.

```js
// This contract is compatible with Upkeep Automation
// To use the "updateIntervalUpkeep" parameter
// "updateIntervalUpkeep" == Number of blocks
// Each "updateIntervalUpkeep" block will perform the action of requesting a random word
const { hash } = await sdk.chainlink.createVRF({
    protocol,
    wallet,
    updateIntervalUpkeep // default: 0
})

const { contractAddress } = await sdk.transaction.getTransactionReceiptByHash({
    protocol,
    hash
})
```

#### Get Subscription

Get the subscription ID and more information about the generated contract.

```js
sdk.chainlink.getSubscriptionVRF({
    protocol,
    address
})
```

#### Get Subscription By Id

Retrieve additional information about the subscription by searching for it using its ID.

```js
sdk.chainlink.getSubscriptionByIdVRF({
    protocol,
    id: 6329
})
```

#### TopUp Subscription

Add funds to your subscription.

```js
sdk.chainlink.topUpVRF({
    protocol,
    address,
    wallet,
    amount: 10
})
```

#### Request RandomWords

Request new random words, and you can pass the quantity of words to be generated as a parameter. Ensure that there are sufficient funds in your wallet.

```js
sdk.chainlink.requestRandomWordsVRF({
    protocol,
    address,
    wallet,
    numWords: 2
})
```

#### List requests

List all the IDs of the requests made through the provided contract.

```js
sdk.chainlink.requestsVRF({
    protocol,
    address
})
```

#### Get Latest Request

Return the ID of the last request made.

```js
sdk.chainlink.latestRequestVRF({
    protocol,
    address
})
```

#### Get Randomwords

Through the `requestID`, you can query whether the random words have already been generated or not. In case of true, all requested random words will be returned according to the `numWords` argument passed.

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