# Transactions

- [Create transfer transactions](#create-transfer-transactions)
- [Create trustline transactions](#create-trustline-transactions)
- [Send transactions](#send-transactions)

## Create transfer transactions

### Ethereum

```js
// transfer ETH
const transaction = await txController.createEthereumTransferTransaction({
  wallet,
  tokenSymbol: 'ETH',
  amount: '0.01',
  destination: '0x3f2f3D45196...5e8f530165eCb93e772',
  testnet: true,
})
// transfer ethereum token MTK
const transaction = await txController.createEthereumTransferTransaction({
  wallet,
  tokenSymbol: 'MTK',
  contractAddress: '0xcf1caf3f6aa5...50dd1206a7cc3c76dc10',
  amount: '0.01',
  destination: '0x3f2f3D45196D7...15e8f530165eCb93e772',
  testnet: true,
})
```

### Binance Smart Chain (BSC)

```js
// transfer BNB
const transaction = await txController.createBscTransferTransaction({
  wallet,
  tokenSymbol: 'BNB',
  amount: '0.01',
  destination: '0x3f2f3D451...15e8f530165eCb93e772',
  testnet: true,
})
// transfer bsc token
const transaction = await txController.createBscTransferTransaction({
  wallet,
  tokenSymbol: 'MTK',
  contractAddress: '0xcf1caf3f6aa...0dd1206a7cc3c76dc10',
  amount: '0.01',
  destination: '0x3f2f3D45196D...e8f530165eCb93e772',
  testnet: true,
})
```

### Celo

```js
// transfer cUSD token and pay fee with cUSD too
const transaction = await txController.createCeloTransferTransaction({
  wallet,
  tokenSymbol: 'cUSD',
  amount: '0.01',
  destination: '0x3f2f3D45196...8f530165eCb93e772',
  feeCurrency: 'cUSD',
  testnet: true,
})
```

### Bitcoin

```js
// transfer BTC
const transaction = await txController.createBitcoinTransferTransaction({
  wallet,
  outputs: [
    { address: 'btc-address1', amount: '0.05' },
    { address: 'btc-address2', amount: '0.449996' },
  ],
  testnet: true,
})
```

### Stellar

```js
// transfer XLM
const transaction = await txController.createStellarTransferTransaction({
  wallet,
  assetSymbol: 'XLM',
  amount: '1',
  destination: 'GDLCRMXZ66NFDIALVOJC...YWT7MK26NO2GJXIBHTVGUIO',
  memo: 'create-transfer',
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

### Ripple

```js
// transfer XRP
const transaction = await txController.createRippleTransferTransaction({
  wallet,
  assetSymbol: 'XRP',
  amount: '0.59',
  destination: 'rPT1Sjq2Y...HjKu9dyfzbpAYe',
  testnet: true,
})
// transfer custom asset
const transaction = await txController.createRippleTransferTransaction({
  wallet,
  assetSymbol: 'VVV',
  issuer: 'rNb3Sk...yWs83jkA',
  amount: '1',
  destination: 'rPT1Sjq2Y...HjKu9dyfzbpAYe',
  memo: 'create-transfer',
  testnet: true,
})
```

## Create trustline transactions

Only for Ripple and Stellar blockchains.

```js
// Ripple
const transaction = await txController.createRippleTrustlineTransaction({
  wallet,
  assetSymbol: 'FOO',
  issuer: 'rPT1Sjq2YGr...jKu9dyfzbpAYe',
  limit: '100000000',
  memo: 'create-trustline',
})
// Stellar
const transaction = await txController.createStellarTrustlineTransaction({
  wallet,
  assetSymbol: 'FOO',
  issuer: 'GDTAUZE6T...3EYISAOAPYIQMVP2JO',
  limit: '100000000',
  memo: 'create-trustline',
})
```

## Send transactions

After creating a transaction, use this method to broadcast the transaction.

```js
const { hash } = await txController.sendTransaction(transaction)
console.log(hash)
// Log transaction hash
```
