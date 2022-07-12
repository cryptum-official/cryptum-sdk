# Hathor Tokens

- [Create token](#create-token)
- [Transfer tokens](#transfer-token)
- [Mint tokens](#mint-tokens)
- [Melt tokens](#melt-tokens)
- [Create token with UTXOs](#create-token-with-utxos)
- [Mint tokens with UTXOs](#mint-tokens-with-utxos)
- [Melt tokens with UTXOs](#melt-tokens-with-utxos)

Instantiate the Cryptum SDK first:

```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY',
})
```

## Create token

Create a new token in Hathor blockchain.

**\*Obs: In Hathor, you will always spend 1% of the amount of tokens you are minting in HTR, that is, to mint 1000 tokens you need to spend 10 HTR.**

#### `sdk.token.create(opts)`

- `opts.protocol` (string)(**required**) - blockchain protocol must be `HATHOR`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.name` (string)(**required**) - token name.
- `opts.symbol` (string)(**required**) - token symbol.
- `opts.amount` (string)(**required**) - token amount to be first minted.
- `opts.mintAuthorityAddress` (string)(**optional**) - wallet address to be the mint authority. Required if you want to mint more tokens later.
- `opts.meltAuthorityAddress` (string)(**optional**) - wallet address to be the melt authority. Required if you want to burn tokens later.

This function returns the transaction hash which is also the token UID (token identifier).

```js
const { hash } = await sdk.token.create({
  protocol: 'HATHOR',
  wallet,
  symbol: 'TEST',
  name: 'TEST',
  amount: '1000000',
  mintAuthorityAddress: 'address...',
  meltAuthorityAddress: 'address...',
})
```

## Transfer tokens

Transfer tokens in Hathor blockchain.

#### `sdk.token.transfer(opts)`

- `opts.protocol` (string)(**required**) - blockchain protocol must be `HATHOR`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.token` (string)(**required**) - token UID to transfer or `HTR` if you're transferring the native token HTR.
- `opts.amount` (string)(**required**) - token amount to be transferred.
- `opts.destination` (string)(**optional**) - destination address.

This function returns the transaction hash.

```js
const { hash } = await sdk.token.transfer({
  protocol: 'HATHOR',
  wallet,
  token: '00000957924c03a56e773a34...7d7a9f6aceb24efeff',
  destination: 'WmpvgigZ4p...sbK8pyV45WtP',
  amount: '0.1',
})
```

## Mint tokens

Mint Hathor tokens.

**\*Obs: In Hathor, you will always spend 1% of the amount of tokens you are minting in HTR, that is, to mint 1000 tokens you need to spend 10 HTR.**

### `sdk.token.mint(opts)`

- `opts.protocol` (string)(**required**) - blockchain must be `HATHOR`.
- `opts.wallet` (Wallet)(**required**) - wallet minting tokens.
- `opts.tokenUid` (string)(**required**) - token identifier to be minted.
- `opts.amount` (string)(**required**) - token amount to be minted.
- `opts.destination` (string)(**required**) - destination wallet address to receive the minted tokens.
- `opts.mintAuthorityAddress` (string)(**optional**) - wallet address to be the mint authority. Required if you want to mint more tokens later.

This function returns the hash of this minting transaction from the blockchain.

```js
// Mint 100 tokens
const { hash } = await sdk.token.mint({
  protocol: 'HATHOR',
  wallet,
  token: '00000...',
  destination: 'WmpvgigZ4pNVLRPW2...sbK8pyV45WtP',
  amount: '100',
  mintAuthorityAddress: 'address...',
})
```

## Melt tokens

Melt (burn) tokens in Hathor blockchain.

### `sdk.token.burn(opts)`

- `opts.protocol` (string)(**required**) - blockchain must be `HATHOR`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.tokenUid` (string)(**required**) - token identifier to be burnt.
- `opts.amount` (string)(**required**) - token amount to be burnt.
- `opts.meltAuthorityAddress` (string)(**optional**) - wallet address to be the melt authority. Required if you want to melt more tokens later.

This function returns hash of the burning transaction from the blockchain.

```js
// burn 5 tokens
const { hash } = await sdk.token.burn({
  protocol: 'HATHOR',
  wallet,
  token: '000000...',
  amount: '5',
  meltAuthorityAddress: 'address...',
})
```

## Create token with UTXOs

### `sdk.transaction.createHathorTokenTransactionFromUTXO(opts)`

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
const transaction = await sdk.transaction.createHathorTokenTransactionFromUTXO({
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
const transaction = await sdk.transaction.createHathorTokenTransactionFromUTXO({
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
const { hash } = await sdk.transaction.sendTransaction(transaction)
```

## Mint tokens with UTXOs

### `sdk.transaction.createHathorTokenTransactionFromUTXO(opts)`

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
const transaction = await sdk.transaction.createHathorTokenTransactionFromUTXO({
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
const { hash } = await sdk.transaction.sendTransaction(transaction)
```

## Melt tokens with UTXOs

### `sdk.transaction.createHathorTokenTransactionFromUTXO(opts)`

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
const transaction = await sdk.transaction.createHathorTokenTransactionFromUTXO({
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
const { hash } = await sdk.transaction.sendTransaction(transaction)
```
