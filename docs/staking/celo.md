# Staking on Celo blockchain

To stake CELO you have to follow these steps below:

- Register your account if it isn't registered yet
- Lock tokens
- Vote for validator group
- Activate your votes

To unstake you have the following steps to do:

- Revoke active votes from validator group
- Unlock tokens
- Withdraw tokens

Use the transaction controller to make the following calls:
```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY'
})
```


## Query information about account

### `sdk.staking.celo.getAccountSummary(opts)`

* `opts.address` (string) (__required__) - wallet address.

```js
const summary = await sdk.staking.celo.getAccountSummary({
	address: '0xaaaaaaaaaaaaa',
}))
// summary {
//   total: '2.781313429852',
//   nonvoting: '1.01',
//   pendingWithdrawals: [ { amount: '0.002882006678210218', timestamp: '1625704512' } ],
//   votes: [
//     {
//       group: '0x5edfCe0bad47e24E30625c275457F5b4Bb619241',
//       pending: '0',
//       active: '1.771313429852'
//     }
//   ]
// }
```

## Register account

### `sdk.staking.celo.isRegisteredAccount(opts)`

Check if account is registered already for staking.

* `opts.address` (string) (__required__) - wallet address.
```js
const { result } = await sdk.staking.celo.isRegisteredAccount({
	address: '0xaaaaaa'
}))
```

### `sdk.staking.celo.registerAccount(opts)`

Register account.

* `opts.wallet` (Wallet) (__required__) - wallet to be registered.

```js
const transaction = await sdk.staking.celo.registerAccount({ wallet }))
```

## Lock tokens

### `sdk.staking.celo.lock(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to lock the amount with.
* `opts.amount` (string) (__required__) - amount to be locked.

```js
const transaction = await sdk.staking.celo.lock({ wallet, amount: '0.22' }))
```

## Vote for validator group
### `sdk.staking.celo.vote(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to vote.
* `opts.amount` (string) (__required__) - Celo amount used to vote.
* `opts.validator` (string) (__required__) - validator group address.

```js
const transaction = await sdk.staking.celo.vote({
	wallet,
	amount: '1.77',
	validator: '0xbbbbbbbb',
}))
```

## Activate votes

Before activating, you'll need to wait for the next epoch to begin. One epoch lasts around one day.

### `sdk.staking.celo.activate(opts)`
* `opts.wallet` (Wallet) (__required__) - wallet used to activate.
* `opts.validator` (string) (__required__) - validator group address.

```js
const transaction = await sdk.staking.celo.activate({
	wallet,
	validator: '0xbbbbbbbb',
}))
```

## Revoke votes
### `sdk.staking.celo.revokePending(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to revoke pending votes.
* `opts.amount` (string) (__required__) - Celo amount used to revoke.
* `opts.validator` (string) (__required__) - validator group address to revoke from.
```js
const transaction = await sdk.staking.celo.revokePending({
	wallet,
	amount: '1',
	validator: '0x5555555555',
}))
```
### `sdk.staking.celo.revokeActive(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to revoke active votes.
* `opts.amount` (string) (__required__) - Celo amount used to revoke.
* `opts.validator` (string) (__required__) - validator group address to revoke from.
```js
const transaction = await sdk.staking.celo.revokeActive({
	wallet,
	amount: '0.2218',
	validator: '0xcccccccccccccc',
}))
```

## Unlock tokens
### `sdk.staking.celo.unlock(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to unlock amount.
* `opts.amount` (string) (__required__) - Celo amount used to unlock.
```js
const transaction = await sdk.staking.celo.unlock({
	wallet,
	amount: '0.01218',
}))
```

## Withdraw

Use this method to withdraw pending amounts. After unlocking the tokens you have to wait for 3 days to withdraw.

### `sdk.staking.celo.getPendingWithdrawals(opts)`

* `opts.address` (string) (__required__) - wallet address to get the pending withdrawals from.

```js
const pendingWithdrawals = await sdk.staking.celo.getPendingWithdrawals({
	address: '0xaaaaaaaaaa',
}))
```

### `sdk.staking.celo.withdraw(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to withdraw.
* `opts.index` (number) (__required__) - index of pending withdrawals.
```js
const transaction = await sdk.staking.celo.withdraw({ wallet, index: 1 }))
```

## Relock tokens

Relock tokens that are pending withdrawals.
### `sdk.staking.celo.relock(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to withdraw.
* `opts.amount` (string) (__required__) - amount to relock.
* `opts.index` (number) (__required__) - index of pending withdrawals.

```js
const transaction = await sdk.staking.celo.relock({
	wallet,
	amount: '0.01218',
	index: 0,
}))
```
