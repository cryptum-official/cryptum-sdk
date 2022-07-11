# NFTs on EVMs (Etherum-based blockchains)

- [Create NFT](#create-nft)
- [Transfer NFTs](#transfer-nfts)
- [Mint NFTs](#mint-nfts)
- [Burn NFTs](#burn-nfts)

```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY',
})
```

## Create NFT

### `sdk.nft.create(opts)`

The smart contract used in this deployment is already precompiled in Cryptum.
For more details, you can see the source code here `./contracts/TokenERC721.sol` and `./contracts/TokenERC1155.sol`.

- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).
- `opts.wallet` (Wallet) (**required**) - wallet creating the token.
- `opts.name` (string) (**required**) - token name.
- `opts.symbol` (string) (**required**) - token symbol.
- `opts.type` (string) (**required**) - token type `ERC721` or `ERC1155`.
- `opts.uri` (string) (**optional**) - token base URI. It is null by default because you can pass specific URI by minting NFTs instead.

This function returns the transaction hash from the blockchain. This hash can be used later to retrieve the token address.

```js
const { hash } = await sdk.nft.create({
  wallet,
  name: 'NFT name',
  symbol: 'NFT',
  type: 'ERC721',
  protocol: 'ETHEREUM',
})
```

## Transfer NFTs

### `sdk.nft.transfer(opts)`

Transfer NFTs.

- `opts.wallet` (Wallet) (**required**) - wallet transferring NFTs.
- `opts.token` (string) (**required**) - token address.
- `opts.amount` (string) (**required**) - token amount to be transferred. (this is in largest unit ether)
- `opts.destination` (string) (**required**) - destination address.
- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).

This function returns the hash of this transferring transaction from the blockchain.

```js
const { hash } = await sdk.nft.transfer({
  wallet,
  protocol: 'AVAXCCHAIN',
  token: '0x1b5e12ca...1b5e12ca',
  destination: '0x31ec6686ee15...07A931b5e12cacb920e',
  amount: '9.129045',
})
```

## Mint NFTs

### `sdk.nft.mint(opts)`

Mint NFTs.

**\*Obs: This method will only work for the NFTs created with the method [sdk.nft.create](#deploy-nft).**

- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).
- `opts.wallet` (Wallet) (**required**) - wallet minting NFTs.
- `opts.token` (string) (**required**) - token address.
- `opts.destination` (string) (**required**) - destination address.
- `opts.amount` (string) (**required**) - token amount to be minted.
- `opts.tokenId` (string) (**required**) - token id to be minted.
- `opts.uri` (string) (**optional**) - metadata URI.

This function returns the hash of this minting transaction from the blockchain.

```js
const { hash } = await sdk.nft.mint({
  protocol: 'CELO',
  wallet,
  token: '0x8888888...333333',
  destination: '0x3333....555555555',
  amount: '10',
  tokenId: 0,
  uri: 'ipfs://...',
})
```

## Burn NFTs

### `sdk.nft.burn(opts)`

Burn NFTs.

**\*Obs: This method will only work for the NFTs created with the method [sdk.nft.create](#deploy-nft).**

- `opts.wallet` (Wallet) (**required**) - wallet burning NFTs.
- `opts.token` (string) (**required**) - token address.
- `opts.amount` (string) (**required**) - token amount to be burnt.
- `opts.tokenId` (string) (**required**) - token id to be burnt.
- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).

This function returns the hash of this burning transaction from the blockchain.

```js
const { hash } = await sdk.nft.burn({
  wallet,
  protocol: 'CELO',
  token: '0x3333333...555555555',
  amount: '3',
  tokenId: 0,
})
```
