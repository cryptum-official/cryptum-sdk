# NFT Operations with Cryptum SDK and Stratus

This guide details the procedures for managing Non-Fungible Tokens (NFTs) on the Stratus blockchain using the Cryptum SDK. It offers step-by-step instructions on creating, minting, burning NFTs, and querying NFT metadata, facilitating developers in integrating NFT functionalities into their decentralized applications.

## Creating NFTs

Creating NFTs is a foundational step for projects that wish to utilize unique digital assets for purposes such as gaming, collectibles, and digital art.

### Example: Create NFTs

```javascript
async function createNFTs() {
  const creationResult = await sdk.nft.create({ 
    protocol: 'STRATUS',
    wallet: wallets.stratus, 
    symbol: 'NFT',
    name: 'MyNFT',
    type: 'ERC721',
  });
  console.log(`Transaction Hash: ${creationResult.hash}`);
  console.log(`NFT Contract Address: ${creationResult.contractAddress}`);
}

createNFTs();
```

**Output**:

```
TransactionResponse {
  hash: '0xcb678da1521ed920a368f59a5f4ba697c74837ed03bcb21985d4662a8b46de48'
}
Waiting for mining tx...
=> NFT address: 0x04ed8Bb1440e95A040b54d055E8C3f258669b6AE
```

## Minting NFTs

Minting NFTs involves creating new unique tokens within the NFT contract, each identified by a tokenId.

### Example: Mint NFTs

```javascript
async function mintNFTs() {
  const mintResult = await sdk.nft.mint({ 
    wallet: wallets.stratus, 
    protocol: 'STRATUS', 
    token: nft, 
    destination: wallets.stratus.address, 
    tokenId: '0', 
    uri: 'ipfs://bafkreigaqdcjtfitytvejgsqbrrw6mvxmwvjax6euphcwrhx3ihkrftrri' 
  });
  console.log(mintResult);
}

mintNFTs();
```

**Output**:

```
TransactionResponse {
  hash: '0x3d24d7a80a49610326ca65acadffe0630fab6653d4844365ccc17c017c35b6c6'
}
```

## Burning NFTs

Burning NFTs removes them from circulation, effectively reducing the total supply of the unique tokens.

### Example: Burn NFTs

```javascript
async function burnNFTs() {
  const burnResult = await sdk.nft.burn({ 
    wallet: wallets.stratus, 
    protocol: 'STRATUS', 
    token: nft, 
    tokenId: 0 
  });
  console.log(burnResult);
}

burnNFTs();
```

**Output**:

```
TransactionResponse {
  hash: '0x832c889d81128ce8f987a1d2fca034359a0aa75123936b9b0cfa6c6f4d76957c'
}
```

## Retrieving NFT Information and Metadata

Understanding the details and metadata of NFTs is crucial for applications that need to display or utilize NFT data.

### Example: Get NFT Info

```javascript
async function getNFTInfo() {
  const nftInfo = await sdk.nft.getInfo({ 
    protocol: 'STRATUS', 
    tokenAddress: nft 
  });
  console.log(nftInfo);
}

getNFTInfo();
```

**Output**:

```
{
  token: '0x20279886fA27798A3EF8A86C6818C7C02459DC1f',
  name: 'MyNFT',
  symbol: 'NFT',
  type: 'ERC721'
}
```

### Example: Get NFT Metadata

```javascript
async function getNFTMetadata() {
  const metadata = await sdk.nft.getMetadata({ 
    protocol: 'STRATUS', 
    tokenAddress: nft, 
    tokenId: '0' 
  });
  console.log(metadata);
}

getNFTMetadata();
```

**Output**:

```
{
  token: '0x71FDbA379DC11343Aa5b365A7d624670B70947a0',
  tokenId: '0',
  uri: 'ipfs://bafkreigaqdcjtfitytvejgsqbrrw6mvxmwvjax6eup

hcwrhx3ihkrftrri',
  metadata: {
    attributes: [...],
    description: 'A black T-shirt',
    external_url: '',
    name: 'T-Shirt 6',
    image: 'ipfs://bafybeihehs2gb4zveo7zfi3ae22wlbb54ap373eyyprrpporhfuxd3yxu4'
  }
}
```

## Conclusion

This guide has provided an overview of the key NFT operations possible with the Cryptum SDK on the Stratus blockchain. From the creation of NFT contracts to the minting, burning, and querying of NFT data, these functionalities allow for the rich integration of unique digital assets into decentralized applications.

For more in-depth information on each operation and additional NFT functionalities, developers should refer to the detailed Cryptum SDK documentation.

