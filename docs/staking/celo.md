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

## Query information about account

```js
const txController = sdk.getStakingController('CELO')

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

```js
// Check if account is registered
const { result } = await txController.isRegisteredAccount({
	address: '0xaaaaaa',
	testnet: true
}))
// Register account
const transaction = await txController.registerAccount({ wallet }))
```

## Lock tokens

```js
const transaction = await txController.lock({ wallet, amount: '0.22', }))
```

## Vote for validator group

```js
const transaction = await txController.vote({
	wallet,
	amount: '1.77',
	validator: '0xbbbbbbbb',
}))
```

## Activate votes

Before activating, you'll need to wait for the next epoch to begin. One epoch takes around one day to begin.

```js
const transaction = await txController.activate({
	wallet,
	validator: '0xbbbbbbbb',
}))
```

## Revoke votes

```js
// revoke pending votes
const transaction = await txController.revokePending({
	wallet,
	amount: '1',
	validator: '0x5555555555',
}))

// revoke active votes
const transaction = await txController.revokeActive({
	wallet,
	amount: '0.2218',
	validator: '0xcccccccccccccc',
}))
```

## Unlock tokens

```js
const transaction = await txController.unlock({
	wallet,
	amount: '0.01218',
}))
```

## Withdraw

Use this method to withdraw pending amounts. After unlocking the tokens you have to wait for 3 days to withdraw.

```js
// check pending withdrawals
const pendingWithdrawals = await txController.getPendingWithdrawals({
	address: '0xaaaaaaaaaa',
}))

// withdraw using index of pending withdrawals
const transaction = await txController.withdraw({ wallet, index: 1, }))
```

## Relock tokens

Relock tokens that are pending withdrawals

```js
const transaction = await txController.relock({
	wallet,
	amount: '0.01218',
	index: 0,
}))
```
