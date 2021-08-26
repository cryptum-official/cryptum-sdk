# Wallets

You need only to instantiate Wallet controller to manage wallets.

```js
const walletController = sdk.getWalletController()
// generate random wallet for blockchain protocol
const wallet = await walletController.generateWallet({ protocol: Protocol.STELLAR })

// or using an existing mnemonic
const wallet = await walletController.generateWallet({
  protocol: Protocol.ETHEREUM,
  mnemonic: '<words>...',
})
console.log(wallet)
// Wallet {
//   mnemonic: '<words>...',
//   privateKey: '...',
//   publicKey: '...',
//   protocol: 'ETHEREUM',
// }

// or using an existing private key
const wallet = await walletController.generateWalletFromPrivateKey({
  privateKey: '0x...',
  protocol: Protocol.ETHEREUM,
})
```
