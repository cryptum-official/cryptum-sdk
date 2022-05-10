# Trustlines

- [Stellar](#stellar)
- [Ripple](#ripple)
- [Send transactions to blockchain](#send-transactions-to-blockchain)

First create an instance of transaction controller to call all methods below.
```js
const txController = sdk.getTransactionController()
```

### Stellar

#### `txController.createStellarTrustlineTransaction(opts)`

Create a trustline transaction in Stellar blockchain. It is used to create or delete assets (trustline).

* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.assetSymbol` (string)(__required__) - asset symbol.
* `opts.issuer` (string)(__required__) - issuer account to be used in the trustline.
* `opts.limit` (string)(__required__) - limit for the trustline. To create the trustline this limit should be bigger than 0 and to delete the trustline it should be 0.
* `opts.memo` (string) - optional message to be attached with this transaction, otherwise leave it undefined. This memo must be a string up to 28-bytes long or a 32-byte hash.
* `opts.fee` (string) - optional fee in stroops.

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

### Ripple

#### `txController.createRippleTrustlineTransaction(opts)`

Create a trustline transaction in XRP blockchain. It is used to create or delete assets (trustline).

* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.assetSymbol` (string)(__required__) - asset to transfer.
* `opts.issuer` (string) - required if you are transferring a custom asset so this is the issuer account, otherwise leave undefined.
* `opts.limit` (string)(__required__) - limit for the trustline. To create the trustline this limit should be bigger than 0 and to delete the trustline it should be 0.
* `opts.memo` (string) - message to be attached with this transaction, otherwise leave it undefined.
* `opts.fee` (string) - optional fee in drops.

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
// Log transaction hash
console.log(hash)
```
