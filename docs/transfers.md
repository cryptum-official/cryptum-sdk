# Transfers

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
* `opts.fee` - optional fee object.
  * `opts.fee.gas` (number) - gas value.
  * `opts.fee.gasPrice` (string) - gas price.

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

## Binance Smart Chain (BSC)

#### `txController.createBscTransferTransaction(opts)`

Create a transfer transaction in BSC blockchain, you can transfer BNB or any other tokens.
* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.tokenSymbol` (string) - token to transfer. If you are transferring bnb this parameter should be `BNB`, otherwise you can leave undefined.
* `opts.contractAddress` (string) - required if you are transferring a BEP20 token, otherwise leave undefined.
* `opts.amount` (string)(__required__) - amount to be transferred.
* `opts.destination` (string)(__required__) - destination address to be transfer to.
* `opts.fee` - optional fee object.
  * `opts.fee.gas` (number) - gas value.
  * `opts.fee.gasPrice` (string) - gas price.

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

## Celo

#### `txController.createCeloTransferTransaction(opts)`

Create a transfer transaction in Celo blockchain, you can transfer CELO, cUSD or any other tokens.
* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.tokenSymbol` (string) - required if you are transferring Celo or cUSD, this parameter should be `CELO` or `cUSD`, otherwise you can leave undefined.
* `opts.contractAddress` (string) - required if you are transferring a ERC20 token, otherwise leave undefined.
* `opts.amount` (string)(__required__) - amount to be transferred.
* `opts.destination` (string)(__required__) - destination address to be transfer to.
* `opts.feeCurrency` (string) - required if you are trying to pay the transaction with a custom token, otherwise leave it undefined to pay with the native token `CELO`. You can input `cUSD` to pay with Celo dollar or any other approved token address here.
* `opts.fee` - optional fee object.
  * `opts.fee.gas` (number) - gas value.
  * `opts.fee.gasPrice` (string) - gas price.

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

## Bitcoin

#### `txController.createBitcoinTransferTransaction(opts)`

Create a transfer transaction in Bitcoin blockchain.

* `opts.wallet` (Wallet) - wallet to sign the transaction with. Required if `inputs` is not used.
* `opts.inputs` (array of Input) - optional array of inputs to include in the transaction. Required if `wallet` is not used.
  * `opts.inputs[].txHash` (string) - transaction hash of the UTXO.
  * `opts.inputs[].index` (number) - index of the UTXO output.
  * `opts.inputs[].privateKey` (string) - input private key to sign the transaction with.
* `opts.outputs` (array of Output)(__required__) - outputs to transfer to.
  * `opts.outputs[].address` (string) - address to transfer to.
  * `opts.outputs[].amount` (string) - amount in BTC to transfer.

 __Obs:__ It is important to note that the sum of the amount of the inputs must be equal to the sum of the amount of the outputs plus the fee. To set the fee amount, you need to subtract the total amount of the outputs. It's up to the user to decide the fee amount.

```js
// transfer BTC from wallet to 2 output addresses
const transaction = await txController.createBitcoinTransferTransaction({
  wallet,
  outputs: [
    { address: 'btc-address1', amount: '0.05' },
    { address: 'btc-address2', amount: '0.449996' },
  ],
})

// transfer BTC from 1 input to 2 output addresses
const transaction = await txController.createBitcoinTransferTransaction({
  inputs: [
    {
      txHash: 'cf4c5da8b45...3785df8687f55c337299cc38c',
      index: 0,
      privateKey: '696007545...ed03b2af3b900a678318160'
    }
  ],
  outputs: [
    { address: 'btc-address1', amount: '0.05' },
    { address: 'btc-address2', amount: '0.449996' },
  ],
})
```

## Stellar

#### `txController.createStellarTransferTransaction(opts)`

Create a transfer transaction in Stellar blockchain, you can transfer XLM or any other tokens.

* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.assetSymbol` (string)(__required__) - asset to transfer.
* `opts.issuer` (string) - required if you are transferring a custom asset so this is the issuer account, otherwise leave undefined.
* `opts.amount` (string)(__required__) - amount to be transferred.
* `opts.destination` (string)(__required__) - destination address to be transfer to.
* `opts.memo` (string) - message to be attached with this transaction, otherwise leave it undefined. This memo must be a string up to 28-bytes long or a 32-byte hash.
* `opts.fee` (string) - optional fee in stroops (XLM).
* `opts.timeout` (number) - optional timeout in seconds.

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

## Ripple

#### `txController.createRippleTransferTransaction(opts)`

Create a transfer transaction in XRP blockchain, you can transfer XRP or any other tokens.

* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.assetSymbol` (string)(__required__) - asset to transfer.
* `opts.issuer` (string) - required if you are transferring a custom asset so this is the issuer account, otherwise leave undefined.
* `opts.amount` (string)(__required__) - amount to be transferred.
* `opts.destination` (string)(__required__) - destination address to be transfer to.
* `opts.memo` (string) - optional message to be attached with this transaction, otherwise leave it undefined.
* `opts.fee` (string) - optional fee in drops (XRP).

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

## Hathor

#### `txController.createHathorTransferTransaction(opts)`

Create a transfer transaction for Hathor blockchain, you can transfer HTR or any other tokens.

* `opts.wallet` (Wallet) - wallet to sign the transaction with. Required if `inputs` is not used.
* `opts.inputs` (array of Input) - optional array of inputs to include in the transaction. Required if `wallet` is not used.
  * `opts.inputs[].txHash` (string) - transaction hash of the UTXO.
  * `opts.inputs[].index` (number) - index of the UTXO output.
  * `opts.inputs[].privateKey` (string) - input private key to sign the transaction with.
* `opts.outputs` (array of Output)(__required__) - outputs to transfer to.
  * `opts.outputs[].address` (string) - address to transfer to.
  * `opts.outputs[].amount` (string) - amount to transfer.
  * `opts.token` (string) - token uid or HTR.
* `opts.tokens` (array of string) - array of token uid.

```js
// transfer BTC from 1 input to 2 output addresses
const transaction = await txController.createHathorTransferTransaction({
  inputs: [
    {
      txHash: 'cf4c5da8b45...3785df8687f55c337299cc38c',
      index: 0,
      privateKey: '696007545...ed03b2af3b900a678318160'
    }
  ],
  outputs: [
    { address: 'address1', amount: '0.05', token: 'HTR' },
    { address: 'address2', amount: '0.449996', token: '0739933...484949' },
    { address: 'address3', amount: '1.5', token: 'HTR' },
  ],
})
```

## Send transactions to blockchain

After creating a transaction, use this method to broadcast the transaction.

```js
const { hash } = await txController.sendTransaction(transaction)
console.log(hash)
// Log transaction hash
```
