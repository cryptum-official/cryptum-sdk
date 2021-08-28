# Staking on Celo blockchain

To stake CELO basically you have to follow these steps below:

- Register your account if it isn't registered yet
- Lock tokens
- Vote for validator group
- Activate your votes

To unstake you have the following steps to do:

- Revoke active votes from validator group
- Unlock tokens
- Withdraw tokens

Use the transaction controller to make the calls below:
```js
const txController = sdk.getStakingController({ protocol: 'CELO' })
```


## Query information about account

### `txController.getAccountSummary(opts)`

* `opts.address` (string) (__required__) - wallet address.

```js
const summary = await txController.getAccountSummary({
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

### `txController.isRegisteredAccount(opts)`

Check if account is registered already for staking.

* `opts.address` (string) (__required__) - wallet address.
```js
const { result } = await txController.isRegisteredAccount({
	address: '0xaaaaaa'
}))
```

### `txController.registerAccount(opts)`

Register account.

* `opts.wallet` (Wallet) (__required__) - wallet to be registered.

```js
const transaction = await txController.registerAccount({ wallet }))
```

## Lock tokens

### `txController.lock(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to lock the amount with.
* `opts.amount` (string) (__required__) - amount to be locked.

```js
const transaction = await txController.lock({ wallet, amount: '0.22' }))
```

## Vote for validator group
### `txController.vote(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to vote.
* `opts.amount` (string) (__required__) - Celo amount used to vote.
* `opts.validator` (string) (__required__) - validator group address.

```js
const transaction = await txController.vote({
	wallet,
	amount: '1.77',
	validator: '0xbbbbbbbb',
}))
```

## Activate votes

Before activating, you'll need to wait for the next epoch to begin. One epoch takes around one day to begin.

### `txController.activate(opts)`
* `opts.wallet` (Wallet) (__required__) - wallet used to activate.
* `opts.validator` (string) (__required__) - validator group address.

```js
const transaction = await txController.activate({
	wallet,
	validator: '0xbbbbbbbb',
}))
```

## Revoke votes
### `txController.revokePending(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to revoke pending votes.
* `opts.amount` (string) (__required__) - Celo amount used to revoke.
* `opts.validator` (string) (__required__) - validator group address to revoke from.
```js
const transaction = await txController.revokePending({
	wallet,
	amount: '1',
	validator: '0x5555555555',
}))
```
### `txController.revokeActive(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to revoke active votes.
* `opts.amount` (string) (__required__) - Celo amount used to revoke.
* `opts.validator` (string) (__required__) - validator group address to revoke from.
```js
const transaction = await txController.revokeActive({
	wallet,
	amount: '0.2218',
	validator: '0xcccccccccccccc',
}))
```

## Unlock tokens
### `txController.unlock(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to unlock amount.
* `opts.amount` (string) (__required__) - Celo amount used to unlock.
```js
const transaction = await txController.unlock({
	wallet,
	amount: '0.01218',
}))
```

## Withdraw

Use this method to withdraw pending amounts. After unlocking the tokens you have to wait for 3 days to withdraw.

### `txController.getPendingWithdrawals(opts)`

* `opts.address` (string) (__required__) - wallet address to get the pending withdrawals from.

```js
const pendingWithdrawals = await txController.getPendingWithdrawals({
	address: '0xaaaaaaaaaa',
}))
```

### `txController.withdraw(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to withdraw.
* `opts.index` (number) (__required__) - index of pending withdrawals.
```js
const transaction = await txController.withdraw({ wallet, index: 1 }))
```

## Relock tokens

Relock tokens that are pending withdrawals.
### `txController.relock(opts)`

* `opts.wallet` (Wallet) (__required__) - wallet used to withdraw.
* `opts.amount` (string) (__required__) - amount to relock.
* `opts.index` (number) (__required__) - index of pending withdrawals.

```js
const transaction = await txController.relock({
	wallet,
	amount: '0.01218',
	index: 0,
}))
```
