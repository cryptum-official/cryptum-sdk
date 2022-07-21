# Bitcoin

- [Transfer bitcoins](#transfer-bitcoins)

Instantiate Cryptum SDK first:
```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY'
})
```

## Transfer bitcoins.

#### `sdk.token.transfer(opts)`

- `opts.protocol` (string)(**required**) - blockchain protocol must be `BITCOIN`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.outputs` (array of Outputs)(**required**) - outputs.
  - `opts.outputs[].address` (string)(**required**) - recipient address.
  - `opts.outputs[].amount` (string)(**required**) - amount to receive.

This function returns the transaction hash.

Example:
```js
const { hash } = await sdk.token.transfer({
  protocol: 'BITCOIN',
  wallet,
  outputs: [
    { address: 'address-1', amount: '0.05' },
    { address: 'address-2', amount: '0.01' },
  ]
})
```