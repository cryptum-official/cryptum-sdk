# Solana Tokens

- [Create tokens](#create-tokens)
- [Mint tokens](#mint-tokens)
- [Burn tokens](#burn-tokens)

Instantiate Cryptum SDK first:

```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY',
})
```

## Create tokens

Solana tokens follow the SPL Token standard alongside the Metaplex NFT protocol.

### `sdk.token.create(opts)`

- `opts.protocol` (string)(**required**) - blockchain protocol must be `SOLANA`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.name` (string)(**required**) - token name.
- `opts.symbol` (string)(**required**) - token symbol.
- `opts.amount` (string)(**required**) - token amount to be first minted.
- `opts.fixedSupply` (boolean)(**required**) - whether future minting will be restricted or not.
- `opts.decimals` (number)(**required**) - amount of decimal units for this token.

This function returns hash of the token created.

```js
const { hash } = await sdk.token.create({
  protocol: 'SOLANA',
  wallet,
  symbol: 'TEST',
  name: 'TEST',
  amount: '1000000',
  fixedSupply: false,
  decimals: 9,
})
```

## Mint tokens

Mint an additional amount of an existing token.

#### `sdk.token.mint(opts)`

- `opts.protocol` (string)(**required**) - blockchain protocol must be `SOLANA`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.token` (string)(**required**) - address of the token that will be minted.
- `opts.amount` (string)(**required**) - token amount to be minted.
- `opts.destination` (string)(**required**) - destination address.

This function returns the hash of the minting transaction.

```js
const { hash } = await sdk.token.mint({
  wallet,
  protocol: 'SOLANA',
  token,
  amount: '20.42',
  destination: 'DohbPo7UFV6phQ9DJF...psM2uwLQxEj94hmj2ohr',
})
```

## Burn tokens

#### `sdk.token.burn(opts)`

- `opts.protocol` (string)(**required**) - blockchain protocol must be `SOLANA`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.token` (string)(**required**) - address of the token that will be burned.
- `opts.amount` (string)(**required**) - token amount to be burned.

This function returns the hash of the burning transaction.

```js
const { hash } = await sdk.token.burn({
  protocol: 'SOLANA',
  wallet,
  token: 'EzqZ...qnCNd',
  amount: '100.34',
})
```
