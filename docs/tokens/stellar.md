# Tokens in Stellar

- [Establish trustline in Stellar](#establish-trustline-in-stellar)

Instantiate Cryptum SDK first:
```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY'
})
```

## Establish trustline in Stellar

#### `sdk.token.setTrustline(opts)`

Create a trustline transaction in Stellar blockchain. It is used to create or delete assets (trustline).
https://developers.stellar.org/docs/issuing-assets/how-to-issue-an-asset/

* `opts.protocol` (Wallet)(__required__) - blockchain protocol must be `STELLAR`.
* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with.
* `opts.symbol` (string)(__required__) - asset symbol.
* `opts.issuer` (string)(__required__) - issuer account to be used in the trustline.
* `opts.limit` (string)(__required__) - limit for the trustline. To create the trustline this limit should be bigger than 0 and to delete the trustline it should be 0.
* `opts.memo` (string)(__optional__) - optional message to be attached with this transaction, otherwise leave it undefined. This memo must be a string up to 28-bytes long or a 32-byte hash.

This function returns the hash of the transaction.

Example:
```js
const { hash } = await sdk.token.setTrustline({
  protocol: 'STELLAR',
  wallet,
  symbol: 'FOO',
  issuer: 'GDTAUZE6T...3EYISAOAPYIQMVP2JO',
  limit: '100000000',
  memo: 'create-trustline',
})
```
