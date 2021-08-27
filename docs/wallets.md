# Wallets

You need only to instantiate Wallet controller to manage wallets.
```js
const walletController = sdk.getWalletController()
```

#### `walletController.generateWallet(opts)`

Generate a wallet for a blockchain protocol:
* `opts.protocol` (string) (__required__) - blockchain protocol supported: `BITCOIN`, `ETHEREUM`, `BSC`, `CELO`, `STELLAR`, `RIPPLE`.
* `opts.mnemonic` (string) (__optional__) - mnemonic string to generate private and public keys.

Example:
```js
// generate random wallet for blockchain protocol
const wallet = await walletController.generateWallet({ protocol: 'STELLAR' })

// or using an existing mnemonic
const wallet = await walletController.generateWallet({
  protocol: 'ETHEREUM',
  mnemonic: '<words>...',
})
console.log(wallet)
// Wallet {
//   mnemonic: '<words>...',
//   privateKey: '...',
//   publicKey: '...',
//   protocol: 'ETHEREUM',
// }
```

#### `walletController.generateWalletFromPrivateKey(opts)`

Generate a wallet for a blockchain protocol:
* `opts.protocol` (string) (__required__) - blockchain protocol supported: `BITCOIN`, `ETHEREUM`, `BSC`, `CELO`, `STELLAR`, `RIPPLE`.
* `opts.privateKey` (string) (__required__) - private key string.

Example:
```js
// using an existing private key
const wallet = await walletController.generateWalletFromPrivateKey({
  privateKey: '0x...',
  protocol: 'BSC',
})
```


