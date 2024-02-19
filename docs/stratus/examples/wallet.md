# Wallet Operations with Cryptum SDK and Stratus

This guide covers the essentials of wallet operations using the Cryptum SDK in the context of the Stratus blockchain. Learn how to retrieve wallet information, manage wallet assets, and interact with the Stratus network effectively.

## Creating a New Wallet

To create a new wallet, the SDK provides functionality to generate wallet addresses and keys. Here's an approach to achieve this:

### Example: Create Wallet

```javascript
async function createWallet(mnemonic) {
  const newWallet = await controller.generateWallet({
    protocol: 'STRATUS',
    mnemonic
  });
  console.log(newWallet);
}

createWallet();
```

**Output**:

```plaintext
Wallet {
  protocol: 'STRATUS',
  privateKey: '0x826a46e3680497b26a161bc0278008f50dafd9c43f986c1838d3349787c37340',
  publicKey: '0x78232f1d6930b5458c290dfe7a56941957582f3944f10b98a8c17ce965f68e9325532ee0e414356fcd7cb6907912985a586a770c5b588b99b48b987550c4c4ec',
  address: '0xbc98cb944e442aa4dabe8fb040405765b6277bcb',
  xpub: 'xpub6EvhTzz6ccjcMmueH3zb1UkHX2dJiiJ2KhSX2FTLeEwx8GWncKjkf2ehTGhZcnT2jbLcuf4UEftRMgraiGp1YDTWW16yPy1MUM156dZmtgA',
  testnet: true
}
```

## Retrieve Wallet Information

To begin with wallet operations, you might first want to retrieve information about a specific wallet, including the wallet's nonce, address, balances, and other pertinent details.

### Example: Get Wallet Info

```javascript
const address = '0x47d14112e26ce2d3067da712bf51d737350239f1';

async function getWalletInfo(address) {
    const walletInfo = await sdk.wallet.getWalletInfo({ 
      address, 
      protocol: 'STRATUS' 
    });
    console.log(walletInfo);
}

getWalletInfo(address);
```

### Output

```plaintext
WalletInfoResponse {
  nonce: 0,
  address: '0xb9bd4685d9316ebdbb075ca280f250932b6a9ea6',
  link: 'https://goerli.etherscan.io/address/0xb9bd4685d9316ebdbb075ca280f250932b6a9ea6',
  balances: [{ symbol: 'CWN', amount: '0', decimals: 18 }]
}
```

## Conclusion

This guide provides a foundational overview of managing wallets with the Cryptum SDK on the Stratus network. From retrieving wallet information to creating new wallets and managing balances, these operations form the basis of your interactions with blockchain networks.

For more advanced wallet functionalities, refer to the SDK documentation and other guides in this series.
