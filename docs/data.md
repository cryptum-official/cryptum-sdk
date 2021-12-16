# Blockchain info

## Wallet info

### `walletController.getWalletInfo(opts)`

Get wallet address information from blockchain.

* `opts.address` (string)(**required**) - wallet address. 
* `opts.protocol` (string)(**required**) - blockchain protocol.
* `opts.tokenAddresses` (array)(**optional**) - array of token addresses. Only for `ETHEREUM`, `CELO`, `BSC` and `SOLANA`.

```js
const wc = sdk.getWalletController()
// For Hathor protocol
const info = await wc.getWalletInfo({ address: 'WgzYfVxZiL7bCN37Wj8myVY9HKZ5GCACsh', protocol: 'HATHOR' })
// WalletInfo {
// 	"address": "WgzYfVxZiL7bCN37Wj8myVY9HKZ5GCACsh",
// 	"link": "https://explorer.testnet.hathor.network/address/WgzYfVxZiL7bCN37Wj8myVY9HKZ5GCACsh",
// 	"balances": [
// 		{
// 			"uid": "00",
// 			"name": "Hathor",
// 			"symbol": "HTR",
// 			"amount": "39.86"
// 		}
// 	]
// }

// For Celo protocol
const info = await wc.getWalletInfo({
	address: '0x31ec6686ee1597a41747507A931b5e12cacb920e',
	protocol: 'CELO',
	tokenAddresses: ['0xC89356398B5b66F9535417354D128b6B4fa7A38E']
})
// WalletInfo {
// 	"nonce": 281,
// 	"address": "0x31ec6686ee1597a41747507A931b5e12cacb920e",
// 	"link": "https://alfajores-blockscout.celo-testnet.org/address/0x31ec6686ee1597a41747507A931b5e12cacb920e",
// 	"balances": [
// 		{
// 			"asset": "CELO",
// 			"amount": "4.893685781169700001"
// 		},
// 		{
// 			"asset": "cUSD",
// 			"amount": "19.998999954214"
// 		},
// 		{
// 			"symbol": "dinheiro",
// 			"address": "0xC89356398B5b66F9535417354D128b6B4fa7A38E",
// 			"amount": "999",
// 			"decimals": "18"
// 		}
// 	]
// }
```

## Get transaction by hash

### `txController.getTransactionByHash(opts)`

Get transaction info from blockchain using the transaction hash (transaction id).

* `opts.hash` (string)(**required**) - transaction hash.
* `opts.protocol` (string)(**required**) - blockchain protocol.

```js
const txController = sdk.getTransactionController()
const tx = await txController.getTransactionByHash({ hash: '<hash>', protocol: 'STELLAR' })
// Blockchain raw transaction returned
```

## Get UTXOs (Unspent transaction outputs)

### `txController.getUTXOs(opts)`

Get UTXOs from a wallet address.

* `opts.address` (string)(**required**) - transaction hash.
* `opts.protocol` (string)(**required**) - blockchain protocol. Only `BITCOIN`, `HATHOR` and `CARDANO`.

```js
const txController = sdk.getTransactionController()
const tx = await txController.getUTXOs({ address: 'WgzYfVxZiL7bCN37Wj8myVY9HKZ5GCACsh', protocol: 'HATHOR' })
// UTXOs [
//     {
//         "index": 0,
//         "value": 3986,
//         "txHash": "002bfddcbedab636844421fe0d098cf69accbe2d0c2473d43277483a3b0755df",
//         "token": "00"
//     }
// ]
```

## Get Block info

### `txController.getBlock(opts)`

Get block information from blockchain.

* `opts.block` (string)(**required**) - block number.
* `opts.protocol` (string)(**required**) - blockchain protocol.

```js
const txController = sdk.getTransactionController()
const tx = await txController.getBlock({ block: '111111', protocol: 'STELLAR' })
// Blockchain raw block information returned
```
