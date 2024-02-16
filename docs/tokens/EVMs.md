# Tokens on EVMs (Ethereum-based blockchains)

- [Create ERC20 token](#create-erc20-token)
- [Transfer tokens](#transfer-tokens)
- [Mint tokens](#mint-tokens)
- [Burn tokens](#burn-tokens)

```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY',
})
```

## Create ERC20 token

### `sdk.token.create(opts)`

The smart contract used in this deployment is already precompiled in Cryptum.
For more details, you can see the source code here `./contracts/TokenERC20.sol`.

- `opts.wallet` (Wallet) (**required**) - wallet creating the token.
- `opts.name` (string) (**required**) - token name.
- `opts.symbol` (string) (**required**) - token symbol.
- `opts.decimals` (number) (**required**) - token decimal places.
- `opts.amount` (string) (**required**) - token amount to be first minted. (this is in largest unit ether)
- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).

This function returns the transaction hash from the blockchain. This hash can be used later to retrieve the token address.

```js
const { hash } = await sdk.token.create({
  wallet,
  name: 'Token name',
  symbol: 'TOK',
  decimals: 18,
  amount: '1000000',
  protocol: 'ETHEREUM',
})
```

## Transfer tokens

### `sdk.token.transfer(opts)`

Transfer native and ERC20 tokens.

- `opts.wallet` (Wallet) (**required**) - wallet transferring tokens.
- `opts.token` (string) (**required**) - token name if it's native, like BNB, CELO, ETH etc, or the token address for ERC20 tokens.
- `opts.amount` (string) (**required**) - token amount to be transferred. (this is in largest unit ether)
- `opts.destination` (string) (**required**) - destination address.
- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).

This function returns the hash of this transferring transaction from the blockchain.

```js
// native token
const { hash } = await sdk.token.transfer({
  wallet,
  protocol: 'POLYGON',
  token: 'MATIC',
  destination: '0x31ec6686ee15...931b5e12cacb920e',
  amount: '17.44',
})
// custom ERC20 token
const { hash } = await sdk.token.transfer({
  wallet,
  protocol: 'AVAXCCHAIN',
  token: '0x1b5e12ca...1b5e12ca',
  destination: '0x31ec6686ee15...07A931b5e12cacb920e',
  amount: '9.129045',
})
```

## Mint tokens

### `sdk.token.mint(opts)`

Mint ERC20 tokens.

**\*Obs: This method will only work for the tokens created with the method [sdk.token.create](#deploy-erc20-token).**

- `opts.wallet` (Wallet) (**required**) - wallet minting tokens.
- `opts.token` (string) (**required**) - token address.
- `opts.amount` (string) (**required**) - token amount to be minted. (this is in largest unit ether considering the token decimal places)
- `opts.destination` (string) (**required**) - destination address.
- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).

This function returns the hash of this minting transaction from the blockchain.

```js
const { hash } = await sdk.token.mint({
  wallet,
  protocol: 'CELO',
  token: '0x1b5e12ca...1b5e12ca',
  destination: '0x31ec6686ee1597...A931b5e12cacb920e',
  amount: '40',
})
```

## Burn tokens

### `sdk.token.burn(opts)`

Burn ERC20 tokens.

**\*Obs: This method will only work for the tokens created with the method [sdk.token.create](#deploy-erc20-token).**

- `opts.wallet` (Wallet) (**required**) - wallet burning tokens.
- `opts.token` (string) (**required**) - token address.
- `opts.amount` (string) (**required**) - token amount to be burnt. (this is in largest unit ether considering the token decimal places)
- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).

This function returns the hash of this burning transaction from the blockchain.

```js
const { hash } = await sdk.token.burn({
  wallet,
  protocol: 'CELO',
  token: '0x1b5e12ca...1b5e12ca',
  amount: '8.23',
})
```

## Approve tokens

### `sdk.token.approve(opts)`

Invoke method "approve" from ERC20-compatible smart contracts.

**\*Obs: This method will only work for the tokens compatible with ERC-20 standard.**

- `opts.wallet` (Wallet) (**required**) - wallet signing transaction that owns the tokens.
- `opts.token` (string) (**required**) - token address.
- `opts.amount` (string) (**required**) - token amount to be approved. (this is in largest unit ether considering the token decimal places)
- `opts.spender` (string) (**required**) - address allowed to withdraw tokens from this wallet.
- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).

This function returns the hash of this burning transaction from the blockchain.

```js
const { hash } = await sdk.token.approve({
  wallet,
  protocol: 'CELO',
  token: '0x1b5e12ca...1b5e12ca',
  amount: '8.82',
  spender: '0x9377888...3342232'
})
```
