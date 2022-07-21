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
- `opts.destination` (string) - destination address.
- `opts.amount` (string) - amount to transfer.
- `opts.destinations` (array of Outputs) - destination outputs.
  - `opts.destinations[].address` (string)(**required**) - recipient address.
  - `opts.destinations[].amount` (string)(**required**) - amount to receive.

Use `destination` and `amount` if you want to transfer to one address.

Use `destinations` to transfer to many addresses at once.

This function returns the transaction hash.

Example:
```js

const { hash } = await sdk.token.transfer({
  protocol: 'BITCOIN',
  wallet,
  destination: 'address-1',
  amount: '0.03744'
})

const { hash } = await sdk.token.transfer({
  protocol: 'BITCOIN',
  wallet,
  destinations: [
    { address: 'address-1', amount: '0.05' },
    { address: 'address-2', amount: '0.01' },
  ]
})
```