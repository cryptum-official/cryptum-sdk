# Solana NFTs

- [Create NFTs](#create-nfts)
- [Mint NFTs](#mint-nfts)
- [Burn NFTs](#burn-nfts)
- [Update NFT Metadata](#update-solana-nft-metadata)

Instantiate Cryptum SDK first:

```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY',
})
```

## Create NFTs

Create an NFT in Solana.

#### `sdk.nft.create(opts)`

- `opts.protocol` (string)(**required**) - blockchain protocol must be `SOLANA`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.name` (string)(**required**) - token name.
- `opts.symbol` (string)(**required**) - token symbol.
- `opts.amount` (string)(**required**) - token amount to be first minted.
- `opts.maxSupply` (number)(**required**) - maximum supply for this token. (0 for unlimited; 1 for unique; 2 or more for multiple editions)
- `opts.uri` (string)(**required**) - URI containing NFT metadata.
- `opts.creators` (array of SolanaCreators)(**optional**) - list of creators.
- `opts.royaltiesFee` (number)(**optional**) - royalties fee.
- `opts.collection` (string)(**optional**) - collection address.

This function returns the token address.

Example:

```js
const { hash } = await sdk.nft.create({
  protocol: 'SOLANA',
  wallet,
  name: 'NFT',
  symbol: 'NFT',
  amount: '1000',
  uri: 'https://....',
  maxSupply: '1000',
})
```

## Mint NFTs

Mint an additional amount of an existing token.

#### `sdk.nft.mint(opts)`

- `opts.protocol` (string)(**required**) - blockchain protocol must be `SOLANA`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.token` (string)(**required**) - token address to be minted. If this token is a master edition, this is the address of the master edition token that will be used to create copies (editions).
- `opts.destination` (string)(**required**) - destination address.
- `opts.amount` (string)(**optional**) - amount to be minted if this token doesn't have a master edition, leave it undefined otherwise.

This function returns the hash of the transaction.

Example:

```js
const { hash } = await sdk.nft.mint({
  wallet: wallets.solana,
  protocol: 'SOLANA',
  token: 'EzqZ...qnCNd',
  destination: 'Er8d....Wud3',
  amount: '1',
})
```

## Burn NFTs

#### `sdk.nft.burn(opts)`

- `opts.protocol` (string)(**required**) - blockchain protocol must be `SOLANA`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.token` (string)(**required**) - address of the token that will be burned.
- `opts.amount` (string)(**required**) - token amount to be burned (no decimals).

This function returns the hash of the transaction.

Example:

```js
const { hash } = await sdk.nft.burn({
  protocol: 'SOLANA',
  wallet,
  token: 'EzqZ...qnCNd',
  amount: '100',
})
```

## Update NFT Metadata

#### `sdk.transaction.updateSolanaNFTMetadata(opts)`

- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.token` (string)(**required**) - address of the token that will be updated.
- `opts.uri` (string)(**required**) - uri containing the updated NFT metadata.

```js
const transaction = await sdk.transaction.updateSolanaNFTMetadata({
  wallet,
  token: '5N6t...3knE9',
  uri: 'https://gateway.pinata.cloud/ipfs/zyx...dcba',
})

const { hash } = await txController.sendTransaction(transaction)
// Log transaction hash
console.log(hash)
```
