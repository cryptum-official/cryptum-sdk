# Token Operations with Cryptum SDK and Stratus

This guide is dedicated to exploring token-related functionalities provided by the Cryptum SDK within the Stratus blockchain environment. It offers step-by-step instructions on how to create, transfer, mint, and burn tokens, enabling developers to integrate these operations into their decentralized applications.

## Creating Tokens

Creating tokens on the Stratus blockchain can be achieved using the Cryptum SDK. This operation is fundamental for projects that require their own tokens for transactions, governance, or utility purposes.

### Example: Create Tokens

```javascript
async function createTokens() {
  const creationResult = await sdk.token.create({ 
    protocol: 'STRATUS', 
    wallet: wallets.stratus, 
    symbol: 'TEST', 
    name: 'Test Token', 
    amount: '1000000', 
    decimals: 18 
  });
  console.log(creationResult);
  const receipt = await sdk.transaction.getTransactionReceiptByHash({
    hash: creationResult.hash,
    protocol: 'STRATUS'
  });
  console.log(`=> Token address: ${receipt.contractAddress}`);
}

createTokens();
```

**Output**:

```
TransactionResponse {
  hash: '0xb630da61c61ba0bc8ced2c90ca5ea43aaef48d1440382cb1837fdf137f857bf0'
}
Waiting for transaction to be mined...
=> Token address: 0xE99eb23B9a9692d7C07d12A226e2C13503949003
```

## Transferring Tokens

Once tokens are created, they can be transferred between wallets. This operation is essential for distributing tokens to users or for transactions between parties.

### Example: Transfer Tokens

```javascript
async function transferTokens() {
  const transferResult = await sdk.token.transfer({ 
    wallet: wallets.stratus, 
    protocol: 'STRATUS', 
    token: '0x7278f891E25B2B585B418FeF862B6Fa4fe0D8cF2', 
    destination: '0x59dacd2e1dbbb5897ef0982f830ba17845874d45', 
    amount: '83.053' 
  });
  console.log(transferResult);
}

transferTokens();
```

**Output**:

```
TransactionResponse {
  hash: '0xdfab33c171f53100ccb72938f66852cd461d99084db66918e6e4e7c3c9c2d532'
}
```

## Minting Tokens

Minting allows for the creation of additional tokens after the initial supply has been generated, which can be critical for managing the token economy.

### Example: Mint Tokens

```javascript
async function mintTokens() {
  const mintResult = await sdk.token.mint({ 
    wallet: wallets.stratus, 
    protocol: 'STRATUS', 
    token: '0x7278f891E25B2B585B418FeF862B6Fa4fe0D8cF2', 
    destination: '0x59dacd2e1dbbb5897ef0982f830ba17845874d45', 
    amount: '10' 
  });
  console.log(mintResult);
}

mintTokens();
```

**Output**:

```
TransactionResponse {
  hash: '0xec2273871d2e47f78849cf2f9723d623371b8d0acd955ebd03f4ea7c2382d8af'
}
```

## Burning Tokens

Burning tokens is a mechanism to reduce the total supply, often used to manage token scarcity or value.

### Example: Burn Tokens

```javascript
async function burnTokens() {
  const burnResult = await sdk.token.burn({ 
    wallet: wallets.stratus, 
    protocol: 'STRATUS', 
    token: '0x7278f891E25B2B585B418FeF862B6Fa4fe0D8cF2', 
    amount: '100.99' 
  });
  console.log(burnResult);
}

burnTokens();
```

**Output**:

```
TransactionResponse {
  hash: '0xbc27756495cec50d9a0b1f86a5b11ddf0d0d6924aebe381836d24f225a55f984'
}
```

## Conclusion

This guide has outlined the key operations for managing tokens on the Stratus blockchain using the Cryptum SDK. From creation to transfer, minting, and burning, these functionalities provide the foundation for token management in decentralized applications.

For more detailed information on each operation and advanced token functionalities, please refer to the Cryptum SDK documentation.
