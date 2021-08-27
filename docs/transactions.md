# Transactions

- [Ethereum](#ethereum)
- [Binance Smart Chain](#binance-smart-chain-bsc)
- [Celo](#celo)
- [Stellar](#stellar)
- [Ripple](#ripple)
- [Send transactions to blockchain](#send-transactions-to-blockchain)

First create an instance of transaction controller to call all methods below.
```js
const txController = sdk.getTransactionController()
```

## Ethereum

#### `txController.createEthereumTransferTransaction(opts)`

Create a transfer transaction in Ethereum blockchain, you can transfer ETH or any other tokens.
* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.tokenSymbol` (string) - token to transfer. If you are transferring ether this parameter should be `ETH`, otherwise you can leave undefined.
* `opts.contractAddress` (string) - required if you are transferring a ERC20 token, otherwise leave undefined.
* `opts.amount` (string)(__required__) - amount to be transferred.
* `opts.destination` (string)(__required__) - destination address to be transfer to.

Examples:
```js
// transfer ETH
const transaction = await txController.createEthereumTransferTransaction({
  wallet,
  tokenSymbol: 'ETH',
  amount: '0.01',
  destination: '0x3f2f3D45196...5e8f530165eCb93e772',
})
// transfer ethereum token
const transaction = await txController.createEthereumTransferTransaction({
  wallet,
  contractAddress: '0xcf1caf3f6aa5...50dd1206a7cc3c76dc10',
  amount: '0.01',
  destination: '0x3f2f3D45196D7...15e8f530165eCb93e772',
})
```

### Binance Smart Chain (BSC)

#### `txController.createBscTransferTransaction(opts)`

Create a transfer transaction in BSC blockchain, you can transfer BNB or any other tokens.
* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.tokenSymbol` (string) - token to transfer. If you are transferring bnb this parameter should be `BNB`, otherwise you can leave undefined.
* `opts.contractAddress` (string) - required if you are transferring a BEP20 token, otherwise leave undefined.
* `opts.amount` (string)(__required__) - amount to be transferred.
* `opts.destination` (string)(__required__) - destination address to be transfer to.

Examples:

```js
// transfer BNB
const transaction = await txController.createBscTransferTransaction({
  wallet,
  tokenSymbol: 'BNB',
  amount: '0.01',
  destination: '0x3f2f3D451...15e8f530165eCb93e772',
})
// transfer bsc token
const transaction = await txController.createBscTransferTransaction({
  wallet,
  contractAddress: '0xcf1caf3f6aa...0dd1206a7cc3c76dc10',
  amount: '0.01',
  destination: '0x3f2f3D45196D...e8f530165eCb93e772',
})
```

### Celo

#### `txController.createCeloTransferTransaction(opts)`

Create a transfer transaction in Celo blockchain, you can transfer CELO, cUSD or any other tokens.
* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.tokenSymbol` (string) - required if you are transferring Celo or cUSD, this parameter should be `CELO` or `cUSD`, otherwise you can leave undefined.
* `opts.contractAddress` (string) - required if you are transferring a ERC20 token, otherwise leave undefined.
* `opts.amount` (string)(__required__) - amount to be transferred.
* `opts.destination` (string)(__required__) - destination address to be transfer to.
* `opts.feeCurrency` (string) - required if you are trying to pay the transaction with a custom token like `cUSD`, otherwise leave it undefined to pay with the native token `CELO`.

Examples:

```js
// transfer cUSD token and pay fee with cUSD too
const transaction = await txController.createCeloTransferTransaction({
  wallet,
  tokenSymbol: 'cUSD',
  amount: '0.01',
  destination: '0x3f2f3D45196...8f530165eCb93e772',
  feeCurrency: 'cUSD',
})
```

### Bitcoin

#### `txController.createBitcoinTransferTransaction(opts)`

Create a transfer transaction in Bitcoin blockchain.


```js
// transfer BTC
const transaction = await txController.createBitcoinTransferTransaction({
  wallet,
  outputs: [
    { address: 'btc-address1', amount: '0.05' },
    { address: 'btc-address2', amount: '0.449996' },
  ],
})
```

### Stellar

#### `txController.createStellarTransferTransaction(opts)`

Create a transfer transaction in Stellar blockchain, you can transfer XLM or any other tokens.

* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.assetSymbol` (string)(__required__) - asset to transfer.
* `opts.issuer` (string) - required if you are transferring a custom asset so this is the issuer account, otherwise leave undefined.
* `opts.amount` (string)(__required__) - amount to be transferred.
* `opts.destination` (string)(__required__) - destination address to be transfer to.
* `opts.memo` (string) - message to be attached with this transaction, otherwise leave it undefined. This memo must be a string up to 28-bytes long or a 32-byte hash.

Examples:

```js
// transfer XLM
const transaction = await txController.createStellarTransferTransaction({
  wallet,
  assetSymbol: 'XLM',
  amount: '1',
  destination: 'GDLCRMXZ66NFDIALVOJC...YWT7MK26NO2GJXIBHTVGUIO',
  memo: 'create-transfer',
})
// transfer XLM to create destination account
const transaction = await txController.createStellarTransferTransaction({
  wallet,
  assetSymbol: 'XLM',
  amount: '2',
  createAccount: true,
  destination: 'GDLCRMXZ66NFDIALVOJC...YWT7MK26NO2GJXIBHTVGUIO',
  memo: 'create-account',
})
// transfer custom asset
const transaction = await txController.createStellarTransferTransaction({
  wallet,
  assetSymbol: 'AAA',
  issuer: 'GCAWT7MK2...6NO2GJC',
  amount: '1',
  destination: 'GDLCRMXZ66NFDIA...WT7MK26NO2GJXIBHTVGUIO',
})
```
#### `txController.createStellarTrustlineTransaction(opts)`

Create a trustline transaction in Stellar blockchain. It is used to create or delete assets (trustline).

* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.assetSymbol` (string)(__required__) - asset symbol.
* `opts.issuer` (string)(__required__) - issuer account to be used in the trustline.
* `opts.limit` (string)(__required__) - limit for the trustline. To create the trustline this limit should be bigger than 0 and to delete the trustline it should be 0.
* `opts.memo` (string) - message to be attached with this transaction, otherwise leave it undefined. This memo must be a string up to 28-bytes long or a 32-byte hash.

Example:
```js
const transaction = await txController.createStellarTrustlineTransaction({
  wallet,
  assetSymbol: 'FOO',
  issuer: 'GDTAUZE6T...3EYISAOAPYIQMVP2JO',
  limit: '100000000',
  memo: 'create-trustline',
})
```

### Ripple (XRPL)

#### `txController.createRippleTransferTransaction(opts)`

Create a transfer transaction in XRP blockchain, you can transfer XRP or any other tokens.

* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.assetSymbol` (string)(__required__) - asset to transfer.
* `opts.issuer` (string) - required if you are transferring a custom asset so this is the issuer account, otherwise leave undefined.
* `opts.amount` (string)(__required__) - amount to be transferred.
* `opts.destination` (string)(__required__) - destination address to be transfer to.
* `opts.memo` (string) - message to be attached with this transaction, otherwise leave it undefined.

Examples:
```js
// transfer XRP
const transaction = await txController.createRippleTransferTransaction({
  wallet,
  assetSymbol: 'XRP',
  amount: '0.59',
  destination: 'rPT1Sjq2Y...HjKu9dyfzbpAYe',
})
// transfer custom asset
const transaction = await txController.createRippleTransferTransaction({
  wallet,
  assetSymbol: 'VVV',
  issuer: 'rNb3Sk...yWs83jkA',
  amount: '1',
  destination: 'rPT1Sjq2Y...HjKu9dyfzbpAYe',
  memo: 'create-transfer',
})
```

#### `txController.createRippleTrustlineTransaction(opts)`

Create a trustline transaction in XRP blockchain. It is used to create or delete assets (trustline).

* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.assetSymbol` (string)(__required__) - asset to transfer.
* `opts.issuer` (string) - required if you are transferring a custom asset so this is the issuer account, otherwise leave undefined.
* `opts.limit` (string)(__required__) - limit for the trustline. To create the trustline this limit should be bigger than 0 and to delete the trustline it should be 0.
* `opts.memo` (string) - message to be attached with this transaction, otherwise leave it undefined.

Example:
```js
// Ripple
const transaction = await txController.createRippleTrustlineTransaction({
  wallet,
  assetSymbol: 'FOO',
  issuer: 'rPT1Sjq2YGr...jKu9dyfzbpAYe',
  limit: '100000000',
  memo: 'create-trustline',
})
```

## Send transactions to blockchain

After creating a transaction, use this method to broadcast the transaction.

```js
const { hash } = await txController.sendTransaction(transaction)
console.log(hash)
// Log transaction hash
```
