# Loot Boxes

- [Deploy](#deploy)
- [Approve](#approve)
- [Create](#create)
- [Open](#open)
- [Get Contents](#get-contents)

Check out the in-depth guide [here](https://doc.cryptum.io/main/for-developers/sdk-integration-guides/loot-boxes) to see the workflow of the loot box contract.


## Deploy

#### `sdk.lootBox.deploy(opts)`
    
Deploy a loot box smart contract
* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.protocol` (string) (__required__) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).
* `opts.name` (string) (**required**) - name of the loot box token.
* `opts.symbol` (string) (**required**) - symbol of the loot box token.
* `opts.contractURI` (string) - URI pointing to the loot box token metadata (PS: it uses the same standard as ERC-1155).
* `opts.trustedForwarders` (string[]) - array of addresses to be set as trusted forwarders.
* `opts.royaltyRecipient` (string) - address to receive the royalties (if any).
* `opts.royaltyBps` (string) - Royalty basis points (e.g: 250 equals 2.5% and 10000 means 100%).

Examples:
```js
let { hash } = await sdk.lootBox.deploy({
    protocol: 'BSC', // Only EVM protocols are supported at the moment
    wallet,
    name: 'My Lootbox!',
    symbol: 'ML'
  });
```

## Approve

#### `sdk.lootBox.approve(opts)`
Approve the loot box contract to use your tokens as rewards.
* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.protocol` (string) (__required__) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).
* `opts.lootBoxAddress` (string) (**required**) - address of the loot box contract.
* `opts.tokenAddress` (string) (**required**) - address of the token to be used as a prize.
* `opts.tokenType` ("ERC721" | "ERC1155" | "ERC20") - type of the token that is being added as a prize.
* `opts.tokenId` (string) - tokenId of the content (if content is an ERC-721 token).
* `opts.amount` (string) - amount of tokens to be approved (if content is an ERC20 token).

Examples:

```js
await sdk.lootBox.approve({
    wallet,
    lootBoxAddress:'0xa75b...15d8',
    protocol: 'BSC',
    tokenAddress: '0xa4...E17', // Address of the token or collection
    tokenType: 'ERC1155', // 'ERC20','ERC721' or 'ERC1155'
    tokenId, // Only for 'ERC721'
    amount // Only for 'ERC20'
  });
```

## Create

#### `sdk.lootBox.create(opts)`

Creates the loot boxes
* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.protocol` (string) (__required__) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).
* `opts.lootBoxAddress` (string) (**required**) - address of the loot box contract.
* `opts.openStartTimestamp` (string) (__required__)- start time from which loot boxes can be opened (PS: Unix timestamp).
* `opts.recipient` (string) (__required__)- recipient address that will receive the boxes once they're minted. 
* `opts.rewardUnits` (string) - array that denotes the amount of units of each reward. (e.g: If one of the rewards is 10 ERC-20 tokens, rewardUnits for that content should be 10. For NFTs this will probably be 1)
* `opts.amountDistributedPerOpen` (string) - amount of rewards to be selected as prizes for each winner. 
* `opts.lootBoxURI` (string) - loot box URI. 
* `opts.contents` (LootBoxContent[]) (__required__) - array of contents to be added as prizes.
  * `LootBoxContent.tokenAddress` (string) - address of the token to be included as a prize
  * `LootBoxContent.tokenId` (string) - tokenId of the token to be included as a prize (if the prize is an NFT)
  * `LootBoxContent.tokenType` ("ERC721" | "ERC1155" | "ERC20") - type of the token that is being added as a prize.
  * `LootBoxContent.amount` (string) - amount of tokens to be approved (if content is an ERC20 

Examples:
```js
const { hash: creationHash } = await sdk.lootBox.createLootBox({
    wallet,
    contents: [{ tokenAddress, tokenId: '0', tokenType: 'ERC1155', amount: '100' }],
    lootBoxAddress:'0xa75b...15d8',
    openStartTimestamp: '0',
    protocol:'BSC',
    recipient: wallet.address
})
```
## Open

#### `sdk.lootBox.open(opts)`
Opens a loot box.
* `opts.wallet` (Wallet)(__required__) - wallet to sign the transaction with
* `opts.protocol` (string) (__required__) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).
* `opts.lootBoxId` (string) - (__required__) - ID of the loot box to be opened
* `opts.lootBoxAddress` (string) (**required**) - address of the loot box contract.


Examples:
```js
const { hash: openingHash } = await sdk.lootBox.openLootBox({
    lootBoxAddress:'0xa75b...15d8',
    wallet,
    protocol: 'BSC',
    lootBoxId: '0'
})
```
## Get Contents

#### `sdk.lootBox.getLootBoxContent(opts)`

Gets the possible contents of a loot box.

* `opts.protocol` (string) (__required__) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).
* `opts.lootBoxId` (string) - (__required__) - ID of the loot box to be opened
* `opts.lootBoxAddress` (string) (**required**) - address of the loot box contract.


```js
// transfer BTC from wallet to 2 output addresses
const contents = await sdk.lootBox.getLootBoxContent({
    lootBoxAddress:'0xa75b...15d8',
    protocol: 'BSC',
    lootBoxId: '0'
})
```
