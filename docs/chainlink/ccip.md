# CCIP

Chainlink CCIP provides a single simple interface through which dApps and web3 entrepreneurs can securely meet all their cross-chain needs. You can use CCIP to transfer data, tokens, or both data and tokens across chains.

[Read more about Chainlink CCIP](https://docs.chain.link/ccip)

## Supported Networks

ETHEREUM, AVAXCCHAIN, POLYGON, BINANCECHAIN, CELO

### Before you begin

Before you begin, you need to ensure that you have a sufficient LINK.

Instantiate Cryptum SDK first:
```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY'
})
```
#### Transfer Tokens between EOAs

In this example, you will transfer CCIP-BnM tokens from your EOA on Arbitrum to an account on Avalanche Fuji. The destination account could be an EOA (Externally Owned Account) or a smart contract.


```js
const getWallet = async () => await sdk.wallet.generateWallet({
    protocol,
    mnemonic: process.env.MNEMONIC
})

const wallet = await getWallet();

await sdk.chainlink.sendTokenCCIPEoa({
    protocol: "ARBITRUM",
    wallet,
    to: "0x91438...6623", // destination wallet
    amount: '1',
    tokenAddress: 'CCIP-BnM', 
    destinationProtocol: "AVAXCCHAIN",
    // feeTokenAddress: '0x' // 0x for native token or token address or null for LINK token
})

/* Response:
TransactionResponse {
  hash: '0x082a35d8172700ec2c97538034d774feb44ec5d4e81b45116c4c368fc3bb79cc'
}
*/
```
#### Get Status By Message ID

```js
const getStatusCCIP = async (messageId, destinationProtocol) => {
    const data = await sdk.chainlink.getStatusCCIP({
        protocol,
        messageId,
        destinationProtocol
    })

    return data
}
```

#### Get Status By Transaction Hash

```js
const getStatusCCIPByHash = async(hash) => {
    const data = await sdk.chainlink.getStatusCCIPByHash({
        hash
    })

    return data
}

/* Response:
{
  nodes: [
    {
      transactionHash: '0x24442dd3252b9d21f70f9bf336a9acf9f386250085ad2ac7b67284da3e1f4dc6',
      destTransactionHash: '0x3aa9d998ddb97e099df597e068eab4f0fe336df05319605fc8bade13f8862091',
      onrampAddress: '0x0477ca0a35ee05d3f9f424d88bc0977cecf339d4',
      offrampAddress: '0x9e5e4324f8608d54a50a317832d456a392e4f8c2',
      commitStoreAddress: '0x92a51ed3f041b39ebd1e464c1f7cb1e8f8a8c63f',
      state: 2,
      sourceChainId: '11155111',
      sourceNetworkName: 'ethereum-testnet-sepolia',
      sender: '0xb9f97a89a378aaa1a1e6811eb17807cc60411322',
      receiver: '0x91438e6149891941c3da2e36b0aceb84f30f6623',
      messageId: '0xfbc7cb335e0abf9abb86c81ee538419fe5fad5983c2a4eeecd36f60876cd27d8',
      destChainId: '43113',
      destNetworkName: 'avalanche-testnet-fuji',
      blockTimestamp: '2024-07-18T05:22:00',
      data: '',
      strict: false,
      nonce: 1,
      gasLimit: '0',
      sequenceNumber: 9353,
      feeToken: '0x779877a7b0d9e8603169ddbd7836e478b4624789',
      feeTokenAmount: '33890460193260785',
      tokenAmounts: [Array]
    }
  ]
}
*/

```
## OnChain
#### Deploy Contract


Retrieve your wallet using the following command:

```js
const wallet = await sdk.wallet.generateWallet({
    protocol: "ETHEREUM",
    mnemonic: process.env.MNEMONIC
})
```
For more information about wallets, see: [Wallet](../wallets.md)

Now, deploy your contract on the desired source and destination networks. 
In our example, we will use the Ethereum Sepolia and Avalanche Fuji networks.

```js
const { hash } = await sdk.chainlink.createCCIP({
        protocol: "ETHEREUM",
        wallet
})

/* Example Response:
TransactionResponse {
  hash: '0x500f9948df4dacd92e71bde7b99934661fe5776f4a6289aba84a423c15a932a4'
}
*/
```

#### Get Contract Address By Hash

Use the getTransactionReceiptByHash function to obtain the newly generated contract address.
 
```js
const { contractAddress } = await sdk.transaction.getTransactionReceiptByHash({
    protocol: "ETHEREUM",
    hash
})

console.log('contractAddress: ', contractAddress)
```
#### Add Funds

You need to add funds to the generated contracts. Add ETH, LINK, and CCIP-BnM to your wallet.

You can obtain faucets through the link: https://docs.chain.link/ccip/test-tokens

CCIP-BnM: https://docs.chain.link/ccip/test-tokens

Note: The CCIP-BnM token is what we will send across networks, so it can be added only to the source contract. The other tokens should be added to all contracts.

For the contract on the Ethereum network, add ETH and LINK; for the contract created on the Avalanche Fuji network, add AVAX and LINK; and so on for the other networks.

This is necessary to ensure we have sufficient funds for gas payments.

```js
// native token
const { hash } = await sdk.token.transfer({
  wallet,
  protocol: 'ETHEREUM',
  token: 'ETH',
  destination: '0x31ec6686ee15...931b5e12cacb920e', // contractAddress
  amount: '17.44',
})

// custom ERC20 token LINK
const { hash } = await sdk.token.transfer({
  wallet,
  protocol: 'ETHEREUM',
  token: '0x779877A7B0D9E8603169DdbD7836e478b4624789', // Address LINK
  destination: '0x31ec6686ee15...07A931b5e12cacb920e', // contractAddress
  amount: '10',
})

// custom ERC20 token CCIP-BnM
const { hash } = await sdk.token.transfer({
  wallet,
  protocol: 'ETHEREUM',
  token: '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05', // Address CCIP-BnM
  destination: '0x31ec6686ee15...07A931b5e12cacb920e', // contractAddress
  amount: '1',
})

```

#### Get Last Received Message

Retrieving the last received message.

```js
await sdk.chainlink.getLastReceivedMessageDetailsCCIP({
        protocol: "ETHEREUM",
        address: contractAddress
})

/*
Example Response:
{
  messageId: '0xad4273f646ef81c993bebb35b2d7d4daf9c8871ed6fcb6bf446b6a79b661e2ba',
  text: '',
  tokenAddress: '0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4',
  tokenAmount: '100000000000000000'
}
*/
```

#### Get Last send Message

Retrieving the last sent message.

```js
await sdk.chainlink.getLastSendMessageDetailsCCIP({
        protocol,
        address: contractAddress
})

/*
Example Response:
{
  messageId: '0xc9b6cc4c272a5c728c1513188360fa27c528fbf4c6e1b5c0395361bf54a72c86',
  text: '',
  tokenAddress: '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05',
  tokenAmount: '100000000000000000'
}
*/
```

#### Get Received Messages Id


Retrieving the list of received message IDs.

```js
await sdk.chainlink.getReceivedMessagesIdCCIP({
        protocol: "ETHEREUM",
        address: contractAddress
})

/*
Example Response:
[
  '0xeb278fe6a4bc362....0a680e791b085d9bb',
  '0x108621b1c2f....1f3ba2442f55c',
  '0xc9b6cc4c27.....b5c0395361bf54a72c86',
  '0xad4273f646ef81c993bebb35b2d7d4daf9c8871ed6fcb6bf446b6a79b661e2ba'
]
*/
```

#### Get Sended Messages Id

Retrieving the list of sent message IDs.

```js
await sdk.chainlink.getSendMessagesIdCCIP({
        protocol,
        address: contractAddress
})

/*
Example Response:
[
  '0xeb278fe6a4bc362....0a680e791b085d9bb',
  '0x108621b1c2f....1f3ba2442f55c',
  '0xc9b6cc4c27.....b5c0395361bf54a72c86',
  '0xad4273f646ef81c993bebb35b2d7d4daf9c8871ed6fcb6bf446b6a79b661e2ba'
]
*/
```

#### Allow Listed Senders

To receive messages sent from another contract, we need to authorize the origin contract address on the destination contract.

In the `allowlistedSendersCCIP` function, we check whether the specified origin contract is authorized to send messages to the destination contract.

```js
await sdk.chainlink.allowlistedSendersCCIP({
        protocol,
        address: contractAddress,
        senderAddress
})

// response true or false
```

#### Allow Sender

In the `allowSenderCCIP` function, we can authorize or revoke authorization for the specified contract.

```js
await sdk.chainlink.allowSenderCCIP({
        protocol,
        wallet,
        address: contractAddress,
        senderAddress,
        allowed // true or false
})

```

### Send Message

Using the `sendMessageCCIP` function, you can send tokens, tokens with data, and just data across different networks.

Note: Follow all the previous steps carefully to ensure there are sufficient funds for gas payments on both the source and destination networks.

#### Token

Sending tokens across blockchains.

```js
await sdk.chainlink.sendMessageCCIP({
        protocol,
        destinationProtocol,
        wallet,
        tokenAddress: '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05', // 
        amount: '0.1', 
        payLink: true, // If true, we indicate that we want to pay the gas fee with LINK.
        contractAddress: senderContractAddress, // Origin contract address.
        to: receiveContractAddress // Destination contract address.
})

/* Example Response:
TransactionResponse {
  hash: '0x500f9948df4dacd92e71bde7b99934661fe5776f4a6289aba84a423c15a932a4'
}
*/
```
#### Data

Sending data across blockchains.

```js
await sdk.chainlink.sendMessageCCIP({
        protocol,
        destinationProtocol,
        wallet,
        text: "Cryptum Sdk",
        payLink: true, // If true, we indicate that we want to pay the gas fee with LINK.
        contractAddress: senderContractAddress, // Origin contract address.
        to: receiveContractAddress // Destination contract address.
})

/* Example Response:
TransactionResponse {
  hash: '0x500f9948df4dacd92e71bde7b99934661fe5776f4a6289aba84a423c15a932a4'
}
*/
```

#### Token with Data

Sending tokens with data across blockchains.

```js
await sdk.chainlink.sendMessageCCIP({
        protocol,
        destinationProtocol,
        wallet,
        tokenAddress: '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05',
        amount: '0.1',
        text: "Cryptum Sdk",
        payLink: true, // If true, we indicate that we want to pay the gas fee with LINK.
        contractAddress: senderContractAddress, // Origin contract address.
        to: receiveContractAddress // Destination contract address.
})

/* Example Response:
TransactionResponse {
  hash: '0x500f9948df4dacd92e71bde7b99934661fe5776f4a6289aba84a423c15a932a4'
}
*/
```

After sending, if everything goes well, you will receive a hash. With this hash, you can check the status of the operation using the `sdk.chainlink.getStatusCCIPByHash` function or by visiting: https://ccip.chain.link.

### Withdraw

To withdraw the tokens contained in your contract, use the `withdrawCCIP` function.

```js
await sdk.chainlink.withdrawCCIP({
        protocol,
        wallet,
        contractAddress:address,
        to: wallet.address,
        tokenAddress
})

/* Example Response:
TransactionResponse {
  hash: '0x500f9948df4dacd92e71bde7b99934661fe5776f4a6289aba84a423c15a932a4'
}
*/
```