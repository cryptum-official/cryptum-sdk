# Hathor NFTs

- [Create NFT](#create-nft)
- [Transfer NFTs](#transfer-nfts)
- [Mint NFTs](#mint-nfts)
- [Melt NFTs](#melt-nfts)

Instantiate the Cryptum SDK first:

```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY',
})
```

## Create NFT

Create a new NFT in Hathor blockchain.

**\*Obs: In Hathor, you will always spend 1% of the amount of tokens you are minting in HTR, that is, to mint 1000 tokens you need to spend 10 HTR.**

#### `sdk.nft.create(opts)`

- `opts.protocol` (string)(**required**) - blockchain protocol must be `HATHOR`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.name` (string)(**required**) - token name.
- `opts.symbol` (string)(**required**) - token symbol.
- `opts.amount` (string)(**required**) - token amount to be first minted.
- `opts.uri` (string)(**required**) - metadata URI string.
- `opts.mintAuthorityAddress` (string)(**optional**) - wallet address to be the mint authority. Required if you want to mint more tokens later.
- `opts.meltAuthorityAddress` (string)(**optional**) - wallet address to be the melt authority. Required if you want to burn tokens later.

This function returns the transaction hash which is also the token UID (token identifier).

```js
const { hash } = await sdk.nft.create({
  protocol: 'HATHOR',
  wallet,
  symbol: 'NFT',
  name: 'NFT',
  amount: '1000000',
  uri: 'ipfs://....',
  mintAuthorityAddress: 'address...',
  meltAuthorityAddress: 'address...',
})
```

## Transfer NFTs

Transfer NFTs in Hathor is the same as any other tokens. See how to transfer here in [token transfers](../tokens/hathor.md#transfer-tokens)

## Mint NFTs

Mint more NFTs.

**\*Obs: In Hathor, you will always spend 1% of the amount of tokens you are minting in HTR, that is, to mint 1000 tokens you need to spend 10 HTR.**

### `sdk.nft.mint(opts)`

- `opts.protocol` (string)(**required**) - blockchain must be `HATHOR`.
- `opts.wallet` (Wallet)(**required**) - wallet minting tokens.
- `opts.tokenUid` (string)(**required**) - token identifier to be minted.
- `opts.amount` (string)(**required**) - token amount to be minted.
- `opts.destination` (string)(**required**) - destination wallet address to receive the minted tokens.
- `opts.mintAuthorityAddress` (string)(**optional**) - wallet address to be the mint authority. Required if you want to mint more tokens later.

This function returns the hash of this minting transaction from the blockchain.

```js
// Mint 100 NFTs
const { hash } = await sdk.nft.mint({
  protocol: 'HATHOR',
  wallet,
  token: '00000...',
  destination: 'WmpvgigZ4pNVLRPW2...sbK8pyV45WtP',
  amount: '100',
  mintAuthorityAddress: 'address...',
})
```

## Melt NFTs

Melt (burn) NFTs in Hathor blockchain.

### `sdk.nft.burn(opts)`

- `opts.protocol` (string)(**required**) - blockchain must be `HATHOR`.
- `opts.wallet` (Wallet)(**required**) - wallet to sign the transaction with.
- `opts.tokenUid` (string)(**required**) - token identifier to be burnt.
- `opts.amount` (string)(**required**) - token amount to be burnt.
- `opts.meltAuthorityAddress` (string)(**optional**) - wallet address to be the melt authority. Required if you want to melt more tokens later.

This function returns hash of the burning transaction from the blockchain.

```js
// burn 5 NFTs
const { hash } = await sdk.nft.burn({
  protocol: 'HATHOR',
  wallet,
  token: '000000...',
  amount: '5',
  meltAuthorityAddress: 'address...',
})
```
