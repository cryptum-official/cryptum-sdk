# Solana Tokens

- [Create Solana tokens](#create-solana-tokens)
- [Mint Solana tokens](#mint-solana-tokens)
- [Burn Solana tokens](#burn-solana-tokens)
- [Update Solana NFT Metadata](#update-solana-nft-metadata)

Use the transaction controller to create transactions:

```js
const txController = sdk.getTransactionController()
```

## Create Solana tokens
Solana tokens follow the SPL Token standard alongside the Metaplex NFT protocol.

### Fungible Tokens

#### `txController.createSolanaTokenDeployTransaction(opts)`
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.destination` (string)(**required**) - wallet address to receive the newly minted tokens.
- `opts.amount` (string)(**required**) - token amount to be first minted.
- `opts.fixedSupply` (boolean)(**required**) - whether future minting will be restricted or not.
- `opts.decimals` (number)(**required**) - amount of decimal units for this token.

```js
const transaction = await txController.createSolanaTokenDeployTransaction({
    wallet,
    destination: wallet.address,
    fixedSupply: false,
    decimals: 2,
    amount: '30'
})
```
### Non Fungible Tokens

#### `txController.createSolanaNFT(opts)`
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.maxSupply` (number)(**required**) - maximum supply for this token. (0 for unlimited; 1 for unique; 2 or more for multiple editions)
- `opts.uri` (string)(**required**) - uri containing NFT metadata.

```js
const transaction = await txController.createSolanaNFT({
    wallet,
    maxSupply: 1,
    uri: 'https://gateway.pinata.cloud/ipfs/abcd....xyz'
  })
```
## Mint Solana tokens

Mint an additional amount of an existing token.

### Fungible Tokens

#### `txController.createSolanaTokenMintTransaction(opts)`
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.destination` (string)(**required**) - wallet address to receive the newly minted tokens.
- `opts.token` (string)(**required**) - address of the token that will be minted.
- `opts.amount` (string)(**required**) - token amount to be minted (no decimals).

```js
const transaction = await txController.createSolanaTokenMintTransaction({
    wallet,
    destination: wallet.address,
    token: 'EzqZ5...nCNd',
    amount: '10000'
  })
```
### Non Fungible Tokens

#### `txController.createSolanaNFTEdition(opts)`
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.masterEdition` (string)(**required**) - address of the master edition token that will be used to create copies (editions).

```js
const transaction = await txController.createSolanaNFTEdition({
    wallet,
    masterEdition: 'B7k8G...U62XD'
  })
```
## Burn Solana tokens

This method works for both SPL tokens and NFT's.
#### `txController.createSolanaTokenBurnTransaction(opts)`
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.token` (string)(**required**) - address of the token that will be burned.
- `opts.amount` (string)(**required**) - token amount to be burned (no decimals).

```js
const transaction = await txController.createSolanaTokenBurnTransaction({
    wallet,
    token: 'EzqZ...qnCNd',
    amount: '100'
  })
```
## Update Solana NFT Metadata

#### `txController.createSolanaTokenBurnTransaction(opts)`
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.token` (string)(**required**) - address of the token that will be updated.
- `opts.uri` (string)(**required**) - uri containing the updated NFT metadata.
  
```js
const transaction = await txController.updateSolanaNFTMetadata({
    wallet,
    token: '5N6t...3knE9',
    uri: 'https://gateway.pinata.cloud/ipfs/zyx...dcba'
  })
```
## Send transactions to the blockchain

After creating a transaction, use this method to broadcast the transaction.

```js
const { hash } = await txController.sendTransaction(transaction)
// Log transaction hash
console.log(hash)
```
