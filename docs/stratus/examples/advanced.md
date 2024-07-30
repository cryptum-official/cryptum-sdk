# Advanced Operations with Cryptum SDK and Stratus

This guide explores advanced functionalities provided by the Cryptum SDK for interacting with the Stratus blockchain. It covers smart contract interactions, the token approval process, and event handling, offering developers the tools needed to create feature-rich decentralized applications (dApps).

## Smart Contract Interactions

Interacting with smart contracts is a fundamental aspect of blockchain development, enabling the execution of complex logic and the functionality of decentralized applications.

### Example: Interacting with a Smart Contract

```javascript
async function callSmartContractMethod(wallet, tokenId) {
  const operator = '0x6F90ffd7C6014a2B93e7F8914b6DF9Cd4563b8f0';
  const nft = '0x20279886fA27798A3EF8A86C6818C7C02459DC1f';
  const contractAbi = [{ inputs: [{ name: 'tokenId', type: 'uint256' }], name: 'getApproved', outputs: [{ type: 'address', name: '' }], stateMutability: 'nonpayable', type: 'function' }];
  const method = 'getApproved';
  const params = [tokenId];
  
  const methodCall = await sdk.contract.callMethod({
    protocol: 'STRATUS',
    from: wallet,
    contractAddress: nft,
    contractAbi,
    method,
    params 
  });
  console.log('It should NOT be approved for anyone here -> ', methodCall);
  
  const tx = await sdk.nft.approve({ 
    protocol: 'STRATUS', 
    wallet, 
    token: nft, 
    operator, 
    tokenId 
  });
  console.log(tx);
}

callSmartContractMethod(wallet, tokenId); // Ensure to pass appropriate 'wallet' and 'tokenId' values
```

**Output**:

```
It should NOT be approved for anyone here ->  SmartContractCallResponse {
  result: '0x0000000000000000000000000000000000000000'
}
TransactionResponse {
  hash: '0xd341c7fc23091e985942150b356b03bfdc9afaeb896256c75a755867fc9b875b'
}
It should be approved here for address "0x6F90ffd7C6014a2B93e7F8914b6DF9Cd4563b8f0" ->  SmartContractCallResponse {
  result: '0x6F90ffd7C6014a2B93e7F8914b6DF9Cd4563b8f0'
}
```

## Conclusion

This guide has introduced advanced operations using the Cryptum SDK for the Stratus blockchain, including smart contract interactions, the token approval process, and event handling. These advanced features are integral to building sophisticated and dynamic decentralized applications.

Developers are encouraged to explore these functionalities further and consult the Cryptum SDK documentation for detailed information on parameters, return types, error handling, and more advanced features not covered in this guide.
