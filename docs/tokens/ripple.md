# Tokens in Ripple

- [Establish trustline in Ripple](#establish-trustline-in-ripple)

Instantiate Cryptum SDK first:
```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY'
})
```

## Establish trustline in Ripple

#### `sdk.token.setTrustline(opts)`

Create a trustline transaction in XRPL blockchain. It is used to create or delete tokens (trustline).

* `opts.protocol` (Wallet)(__required__) - blockchain protocol must be `RIPPLE`.
* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with.
* `opts.symbol` (string)(__required__) - asset to transfer.
* `opts.issuer` (string) - required if you are transferring a custom asset so this is the issuer account, otherwise leave undefined.
* `opts.limit` (string)(__required__) - limit for the trustline. To create the trustline this limit should be bigger than 0 and to delete the trustline it should be 0.
* `opts.memo` (string)(__optional__) - message to be attached with this transaction, otherwise leave it undefined.

This function returns the hash of the transaction.

Example:
```js
// Ripple
const { hash } = await sdk.token.setTrustline({
  protocol: 'RIPPLE',
  wallet,
  symbol: 'FOO',
  issuer: 'rPT1Sjq2YGr...jKu9dyfzbpAYe',
  limit: '100000000',
  memo: 'create-trustline',
})
```
