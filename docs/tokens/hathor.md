# Hathor Tokens

- [Create Hathor tokens](#create-hathor-tokens)
- [Mint Hathor tokens](#mint-hathor-tokens)
- [Melt Hathor tokens](#melt-hathor-tokens)
- [Create Hathor NFTs](#create-hathor-nfts)

Use the transaction controller to create transactions:

```js
const txController = sdk.getTransactionController()
```

## Create Hathor tokens

Create a signed transaction to create a new token.

In Hathor, you will always spend 1% of the amount of tokens you are minting in HTR, that is, to mint 1000 tokens you need to spend 10 HTR.

#### `txController.createHathorTokenTransactionFromWallet(opts)`
- `opts.type` (TransactionType)(**required**) - transaction type. It must be `"HATHOR_TOKEN_CREATION"`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.tokenName` (string)(**required**) - token name.
- `opts.tokenSymbol` (string)(**required**) - token symbol.
- `opts.amount` (string)(**required**) - token amount to be first minted.
- `opts.mintAuthorityAddress` (string)(**optional**) - wallet address to be the mint authority. Required if you want to mint more tokens later.
- `opts.meltAuthorityAddress` (string)(**optional**) - wallet address to be the melt authority. Required if you want to burn tokens later.

```js
// Create token transaction, mint 100 tokens and do not want to mint or burn tokens later
const transaction = await txController.createHathorTokenTransactionFromWallet({
  type: TransactionType.HATHOR_TOKEN_CREATION,
  wallet,
  tokenSymbol: 'TOK',
  tokenName: 'TOKEN',
  amount: '100',
})
// Create token transaction, mint 3000 tokens and want to mint or burn tokens later
const transaction = await txController.createHathorTokenTransactionFromWallet({
  type: TransactionType.HATHOR_TOKEN_CREATION,
  wallet,
  tokenSymbol: 'TOK',
  tokenName: 'TOKEN',
  amount: '3000',
  mintAuthorityAddress: 'address-1',
  meltAuthorityAddress: 'address-2',
})
```

#### `txController.createHathorTokenTransactionFromUTXO(opts)`

- `opts.type` (TransactionType)(**required**) - transaction type. It must be `"HATHOR_TOKEN_CREATION"`.
- `opts.inputs` (array of Input)(**required**) - array of inputs to include in the transaction.
  - `opts.inputs[].txHash` (string) - transaction hash of the UTXO.
  - `opts.inputs[].index` (number) - index of the UTXO output.
  - `opts.inputs[].privateKey` (string) - input private key to sign the transaction with.
- `opts.tokenName` (string)(**required**) - token name.
- `opts.tokenSymbol` (string)(**required**) - token symbol.
- `opts.amount` (string)(**required**) - token amount to be first minted.
- `opts.address` (string)(**required**) - destination wallet address to receive the minted tokens.
- `opts.changeAddress` (string)(**required**) - wallet address to receive the change in HTR if there's any.
- `opts.mintAuthorityAddress` (string)(**optional**) - wallet address to be the mint authority. Required if you want to mint more tokens later.
- `opts.meltAuthorityAddress` (string)(**optional**) - wallet address to be the melt authority. Required if you want to burn tokens later.
```js
// Create token transaction, mint 100 tokens and do not want to mint or burn tokens later
const transaction = await txController.createHathorTokenTransactionFromUTXO({
  type: TransactionType.HATHOR_TOKEN_CREATION,
  inputs: [
    {
      txHash: 'cf4c5da8b45...3785df8687f55c337299cc38c',
      index: 0,
      privateKey: '696007545...ed03b2af3b900a678318160',
    },
  ],
  tokenSymbol: 'TOK',
  tokenName: 'TOKEN',
  amount: '100',
  address: 'address-1',
  changeAddress: 'address-1',
})
// Create token transaction, mint 3000 tokens and want to mint or burn tokens later
const transaction = await txController.createHathorTokenTransactionFromUTXO({
  type: TransactionType.HATHOR_TOKEN_CREATION,
  inputs: [
    {
      txHash: 'cf4c5da8b45...3785df8687f55c337299cc38c',
      index: 0,
      privateKey: '696007545...ed03b2af3b900a678318160',
    },
  ],
  tokenSymbol: 'TOK',
  tokenName: 'TOKEN',
  amount: '3000',
  address: 'address-1',
  changeAddress: 'address-1',
  mintAuthorityAddress: 'address-1',
  meltAuthorityAddress: 'address-2',
})
```

## Mint Hathor tokens

Create and sign a transaction to mint an existing token in Hathor blockchain. Keep in mind that you need enough HTR tokens to pay for this transaction depending on the minting amount, as already explained above.

### `txController.createHathorTokenTransactionFromWallet(opts)`

- `opts.type` (TransactionType)(**required**) - transaction type. It must be `"HATHOR_TOKEN_MINT"`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.tokenUid` (string)(**required**) - token uid.
- `opts.amount` (string)(**required**) - token amount to be minted.
- `opts.address` (string)(**required**) - destination wallet address to receive the minted tokens.
- `opts.changeAddress` (string)(**required**) - wallet address to receive the change in HTR if there's any.
- `opts.mintAuthorityAddress` (string)(**optional**) - wallet address to be the mint authority. Required if you want to mint more tokens later.
```js
// Create token transaction to mint 100 tokens
const transaction = await txController.createHathorTokenTransactionFromUTXO({
  type: TransactionType.HATHOR_TOKEN_MINT,
  wallet,
  tokenUid: '0000...00000',
  amount: '100',
  address: 'address-1',
  changeAddress: 'address-1',
  mintAuthorityAddress: 'address-1',
})
```

### `txController.createHathorTokenTransactionFromUTXO(opts)`

- `opts.type` (TransactionType)(**required**) - transaction type. It must be `"HATHOR_TOKEN_MINT"`.
- `opts.inputs` (array of Input)(**required**) - array of inputs to include in the transaction.
  - `opts.inputs[].txHash` (string) - transaction hash of the UTXO.
  - `opts.inputs[].index` (number) - index of the UTXO output.
  - `opts.inputs[].privateKey` (string) - input private key to sign the transaction with.
- `opts.tokenUid` (string)(**required**) - token uid.
- `opts.amount` (string)(**required**) - token amount to be minted.
- `opts.address` (string)(**required**) - destination wallet address to receive the minted tokens.
- `opts.changeAddress` (string)(**required**) - wallet address to receive the change in HTR if there's any.
- `opts.mintAuthorityAddress` (string)(**optional**) - wallet address to be the mint authority. Required if you want to mint more tokens later.
```js
// Create token transaction to mint 100 tokens
const transaction = await txController.createHathorTokenTransactionFromUTXO({
  type: TransactionType.HATHOR_TOKEN_MINT,
  inputs: [
    {
      txHash: 'cf4c5da8b45...3785df8687f55c337299cc38c',
      index: 0,
      privateKey: '696007545...ed03b2af3b900a678318160',
    },
  ],
  tokenUid: '0000...00000',
  amount: '100',
  address: 'address-1',
  changeAddress: 'address-1',
  mintAuthorityAddress: 'address-1',
})
```

## Melt Hathor tokens

Create and sign a transaction to melt (burn) an existing token in Hathor blockchain.

### `txController.createHathorTokenTransactionFromWallet(opts)`

- `opts.type` (TransactionType)(**required**) - transaction type. It must be `"HATHOR_TOKEN_MELT"`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.tokenUid` (string)(**required**) - token uid.
- `opts.amount` (string)(**required**) - token amount to be minted.
- `opts.address` (string)(**required**) - destination wallet address to receive the HTR tokens.
- `opts.changeAddress` (string)(**required**) - wallet address to receive the change in custom token if there's any.
- `opts.meltAuthorityAddress` (string)(**optional**) - wallet address to be the melt authority. Required if you want to melt more tokens later.
```js
// Create token transaction to mint 100 tokens
const transaction = await txController.createHathorTokenTransactionFromUTXO({
  type: TransactionType.HATHOR_TOKEN_MELT,
  wallet,
  tokenUid: '0000d...00000',
  amount: '100',
  address: 'address-1',
  changeAddress: 'address-1',
  mintAuthorityAddress: 'address-1',
})
```

### `txController.createHathorTokenTransactionFromUTXO(opts)`

- `opts.type` (TransactionType)(**required**) - transaction type. It must be `"HATHOR_TOKEN_MELT"`.
- `opts.inputs` (array of Input)(**required**) - array of inputs to include in the transaction.
  - `opts.inputs[].txHash` (string) - transaction hash of the UTXO.
  - `opts.inputs[].index` (number) - index of the UTXO output.
  - `opts.inputs[].privateKey` (string) - input private key to sign the transaction with.
- `opts.tokenUid` (string)(**required**) - token uid.
- `opts.amount` (string)(**required**) - token amount to be minted.
- `opts.address` (string)(**required**) - destination wallet address to receive the HTR tokens.
- `opts.changeAddress` (string)(**required**) - wallet address to receive the change in custom token if there's any.
- `opts.meltAuthorityAddress` (string)(**optional**) - wallet address to be the melt authority. Required if you want to melt more tokens later.
```js
// Create token transaction to melt 100 tokens
const transaction = await txController.createHathorTokenTransactionFromUTXO({
  type: TransactionType.HATHOR_TOKEN_MELT,
  inputs: [
    {
      txHash: 'cf4c5da8b45...3785df8687f55c337299cc38c',
      index: 0,
      privateKey: '696007545...ed03b2af3b900a678318160',
    },
  ],
  tokenUid: '0000...00000',
  amount: '100',
  address: 'address-1',
  changeAddress: 'address-1',
  meltAuthorityAddress: 'address-1',
})
```

## Create Hathor NFTs

Create a signed transaction to create a new NFT.

#### `txController.createHathorTokenTransactionFromWallet(opts)`
- `opts.type` (TransactionType)(**required**) - transaction type. It must be `"HATHOR_TOKEN_CREATION"`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.tokenName` (string)(**required**) - token name.
- `opts.tokenSymbol` (string)(**required**) - token symbol.
- `opts.amount` (string)(**required**) - token amount to be minted.
- `opts.nftData` (string)(**required**) - NFT URI (ex: "ipfs://QmlpA2jdiwwo23SchWTxk...") or any string.
- `opts.mintAuthorityAddress` (string)(**optional**) - wallet address to be the mint authority. Required if you want to mint more tokens later.
- `opts.meltAuthorityAddress` (string)(**optional**) - wallet address to be the melt authority. Required if you want to burn tokens later.

```js
// Create token transaction, mint 1 NFT and do not want to mint or burn tokens later
const transaction = await txController.createHathorTokenTransactionFromWallet({
  type: TransactionType.HATHOR_TOKEN_CREATION,
  wallet,
  tokenName: 'Shapes',
  tokenSymbol: 'SHAPS',
  amount: '1',
  nftData: 'ipfs://Qmex96KX4evfWD5AvuKLcgtcyjtsYsKt66rkGNgCFijynB',
})
// Create token transaction, mint 3000 tokens and want to mint or burn tokens later
const transaction = await txController.createHathorTokenTransactionFromWallet({
  type: TransactionType.HATHOR_TOKEN_CREATION,
  wallet,
  tokenSymbol: 'NFT2',
  tokenName: 'Nft 2',
  amount: '3000',
  nftData: 'ipfs://QlpE96KX4evfWD5AvuKLcgtcyjtsYsKt66rkGNgCFijynB',
  mintAuthorityAddress: 'address-1',
  meltAuthorityAddress: 'address-2',
})
```

## Send transactions to the blockchain

After creating a transaction, use this method to broadcast the transaction.

```js
const { hash } = await txController.sendTransaction(transaction)
// Log transaction hash
console.log(hash)
```
