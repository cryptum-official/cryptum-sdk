# Blockchain queries

Use the SDK to query blockchain information like balances, transactions, etc.

```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY',
})
```

## Wallet info

### `sdk.wallet.getWalletInfo(opts)`

Get wallet address information from blockchain.

- `opts.address` (string)(**required**) - wallet address.
- `opts.protocol` (string)(**required**) - blockchain protocol.
- `opts.tokenAddresses` (array)(**optional**) - array of token addresses. Only for [EVMs](./protocols.md#ethereum-based-blockchains-evms).

```js
// For Hathor protocol
const info = await sdk.wallet.getWalletInfo({ address: 'WgzYfVxZiL7bCN37Wj8myVY9HKZ5GCACsh', protocol: 'HATHOR' })
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
const info = await sdk.wallet.getWalletInfo({
  address: '0x31ec6686ee1597a41747507A931b5e12cacb920e',
  protocol: 'CELO',
  tokenAddresses: ['0xC89356398B5b66F9535417354D128b6B4fa7A38E'],
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

### `sdk.transaction.getTransactionByHash(opts)`

Get transaction info from blockchain using the transaction hash (transaction id).

- `opts.hash` (string)(**required**) - transaction hash.
- `opts.protocol` (string)(**required**) - blockchain protocol.

```js
const tx = await sdk.transaction.getTransactionByHash({ hash: '<hash>', protocol: 'STELLAR' })
// Blockchain raw transaction returned
```

## Get transaction receipt by hash

### `sdk.transaction.getTransactionReceiptByHash(opts)`

Get transaction receipt using the transaction hash (transaction id). This method is supported only for EVMs (ETHEREUM, CELO, POLYGON, BSC, ...)

- `opts.hash` (string)(**required**) - transaction hash.
- `opts.protocol` (string)(**required**) - blockchain protocol.

```js
const tx = await sdk.transaction.getTransactionReceiptByHash({ hash: '<hash>', protocol: 'BSC' })
// Blockchain transaction receipt returned
```

## Get UTXOs (Unspent transaction outputs)

### `sdk.transaction.getUTXOs(opts)`

Get UTXOs from a wallet address.

- `opts.address` (string)(**required**) - transaction hash.
- `opts.protocol` (string)(**required**) - blockchain protocol. Only `BITCOIN`, `HATHOR` and `CARDANO`.

```js
const utxos = await sdk.transaction.getUTXOs({ address: 'WgzYfVxZiL7bCN37Wj8myVY9HKZ5GCACsh', protocol: 'HATHOR' })
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

### `sdk.transaction.getBlock(opts)`

Get block information from blockchain.

- `opts.block` (string)(**required**) - block number.
- `opts.protocol` (string)(**required**) - blockchain protocol.

```js
const tx = await sdk.transaction.getBlock({ block: '111111', protocol: 'STELLAR' })
// Raw block information returned from the Blockchain
```

## Get fees

### `sdk.transaction.getFee(opts)`

Get transaction fee information from blockchain.

If you wish to get estimate fee information for a transfer of the native token like ether, the parameters type, from, destination and amount should be passed as follows:

- `opts.type` (string)(**required**) - type of the transaction. It should be `TRANSFER` in this case.
- `opts.from` (string)(**required**) - origin or signing address.
- `opts.destination` (string)(**required**) - destination address.
- `opts.protocol` (string)(**required**) - blockchain protocol.

For smart contract method calls, just pass with the additional parameters:

- `opts.type` (string)(**required**) - type of the transaction. It should be `CALL_CONTRACT_METHOD` in this case.
- `opts.from` (string)(**required**) - origin or signing address.
- `opts.contractAddress` (string)(**required**) - contract address.
- `opts.contractAbi` (array)(**required**) - method ABI to be used.
- `opts.method` (string)(**required**) - method name.
- `opts.params` (array) - method parameters.
- `opts.protocol` (string)(**required**) - blockchain protocol.

And for smart contract deployments:

- `opts.type` (string)(**required**) - type of the transaction. It should be `DEPLOY_CONTRACT` in this case.
- `opts.from` (string)(**required**) - origin or signing address.
- `opts.contractName` (string)(**required**) - contract name.
- `opts.source` (string)(**required**) - contract source code.
- `opts.params` (array) - contract constructor parameters.
- `opts.protocol` (string)(**required**) - blockchain protocol.

```js
const fee = await sdk.transaction.getFee({
  type: 'TRANSFER',
  from: '0xaaaaaa',
  destination: '0xbbbbbbbb',
  protocol: 'POLYGON',
})
// Fee information object
// {
//   "chainId": 137,
//   "estimateValue": "0.000021",
//   "unit": "wei",
//   "gas": 21000,
//   "gasPrice": "1000000000"
// }
```

## Get NFT metadata

### `sdk.nft.getMetadata(opts)`

Get NFT metadata.

- `opts.tokenAddress` (string) - token address only for `ETHEREUM`, `CELO`, `AVAXCCHAIN`, `CHILIZ`, `BSC`, `POLYGON`, `SOLANA`, `STRATUS`, `BESU`.
- `opts.tokenId` (string) - token id for `ETHEREUM`, `CELO`, `AVAXCCHAIN`, `CHILIZ`, `BSC`, `POLYGON`, `SOLANA`, `STRATUS`, `BESU`
- `opts.tokenUid` (string) - token UID for `HATHOR`.
- `opts.protocol` (string)(**required**) - blockchain protocol. Only for `ETHEREUM`, `CELO`, `AVAXCCHAIN`, `CHILIZ`, `BSC`, `POLYGON`, `SOLANA`, `HATHOR`, `STRATUS`, `BESU`.

```js
const metadata = await sdk.nft.getMetadata({
  tokenAddress: '0x999999999999',
  tokenId: '1000',
  protocol: 'POLYGON',
})
```

## Get NFT balance

### `sdk.nft.getBalance(opts)`

Get NFT balance.

- `opts.address` (string)(**required**) - wallet address.
- `opts.tokenAddress` (string) - token address only for `ETHEREUM`, `CELO`, `AVAXCCHAIN`, `CHILIZ`, `BSC`, `POLYGON`, and `SOLANA`.
- `opts.tokenId` (string) - token id for `ETHEREUM`, `CELO`, `AVAXCCHAIN`, `CHILIZ`, `BSC`, `POLYGON`, and `SOLANA`.
- `opts.tokenUid` (string) - token UID for `HATHOR`.
- `opts.protocol` (string)(**required**) - blockchain protocol. Only for `ETHEREUM`, `CELO`, `AVAXCCHAIN`, `CHILIZ`, `BSC`, `POLYGON`, `SOLANA`, `HATHOR`, `STRATUS`, `BESU`.

```js
const metadata = await sdk.nft.getBalance({
  address: '0x1111111111111',
  tokenAddress: '0x999999999999',
  tokenId: '1000',
  protocol: 'POLYGON',
})
```
