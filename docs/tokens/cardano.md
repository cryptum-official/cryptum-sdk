# Cardano

- [Transfer tokens](#transfer-tokens)

Instantiate Cryptum SDK first:

```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY',
})
```

## Transfer tokens

#### `sdk.token.transfer(opts)`

you can transfer ADA or any other native Cardano token.

- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.outputs` (array of Output)(**required**) - outputs to transfer to.
  - `opts.outputs[].address` (string)(**required**) - address to transfer to.
  - `opts.outputs[].amount` (string)(**required**) - amount of ADA to transfer.
  - `opts.outputs[].token` (object)(**optional**) - optional token information (for tokens only).
    - `opts.outputs[].token.policy` (string) - PolicyID of the token you want to send.
    - `opts.outputs[].token.asset` (string) - Asset name (in hex) of the token you want to send.
    - `opts.outputs[].token.amount` (string) - Amount of tokens you want to send.

This function returns the transaction hash.

Example:

```js
const { hash } = await sdk.token.transfer({
  protocol: 'CARDANO',
  wallet,
  outputs: [
    { address: 'address1', amount: '1' },
    { address: 'address2', amount: '2', token: { asset: '546...a3e', policy: 'f3eb9...5f4a1', amount: '1' } },
    { address: 'address3', amount: '1.5', token: { asset: 'a9e...698', policy: 'c43a...1743f', amount: '10' } },
  ],
})
```

## Transfer token with UTXOs

### `sdk.transaction.createCardanoTransferTransactionFromUTXO(opts)`

- `opts.inputs` (array of Input) - array of inputs to be used in the transaction.
  - `opts.inputs[].txHash` (string) - transaction hash of the UTXO.
  - `opts.inputs[].index` (number) - index of the UTXO output.
  - `opts.inputs[].privateKey` (string) - spending private key to sign the transaction with.
- `opts.outputs` (array of Output)(**required**) - outputs to transfer to.
  - `opts.outputs[].address` (string) - address to transfer to.
  - `opts.outputs[].amount` (string) - amount of ADA to transfer.
  - `opts.outputs[].token` (object) - optional token information (for token transactions only).
    - `opts.outputs[].token.policy` (string) - PolicyID of the token you want to send.
    - `opts.outputs[].token.asset` (string) - Asset name (in hex) of the token you want to send.
    - `opts.outputs[].token.amount` (string) - Amount of tokens you want to send.

```js
// transfer ADA and tokens from 1 input to 3 output addresses
const transaction = await sdk.transaction.createCardanoTransferTransactionFromUTXO({
  inputs: [
    {
      txHash: 'bcc91e0...aec1f28066821',
      index: 0,
      privateKey: '9c34271d8...636667e265d0a',
    },
  ],
  outputs: [
    { address: 'address1', amount: '1' },
    { address: 'address2', amount: '2', token: { asset: '546...a3e', policy: 'f3eb9...5f4a1', amount: '1' } },
    { address: 'address3', amount: '1.5', token: { asset: 'a9e...698', policy: 'c43a...1743f', amount: '10' } },
  ],
})

const { hash } = await sdk.transaction.sendTransaction(transaction)
```
