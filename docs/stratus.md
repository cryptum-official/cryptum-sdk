# Stratus

The Cryptum SDK offers seamless integration with Stratus, a cutting-edge Ethereum Virtual Machine (EVM) executor and JSON-RPC server. Stratus stands out for its scalability solutions, built with the efficiency and reliability of Rust, and aligned with the power and efficiency of In-Memory and PostgreSQL storage solutions, making it a premier choice for developing decentralized applications (dApps). This documentation provides a comprehensive overview of how to utilize the Cryptum SDK to interact with the Stratus blockchain, covering everything from basic wallet operations to advanced smart contract interactions.

## Getting Started

Before diving into the specifics of working with Stratus through the Cryptum SDK, ensure you have the SDK installed and configured in your development environment. Refer to the official Cryptum SDK documentation for setup instructions and API details.

To get started with it, we first need to instantiate the SDK with the Stratus protocol:
```js
const sdk = new CryptumSdk({
  environment: 'testnet', // or 'mainnet'
  apiKey: 'your-api-key',
});
```
Then we are ready to go!

## Guide Overview

- [**Wallet Operations:**](stratus/examples/wallet.md) Learn how to create, manage, and retrieve information about wallets on the Stratus blockchain.
- [**Token Operations:**](stratus/examples/token.md) Discover how to create, transfer, mint, and burn tokens, enabling you to manage your own cryptocurrencies or utility tokens.
- [**NFT Operations:**](stratus/examples/nft.md) Explore the creation, minting, and burning of Non-Fungible Tokens (NFTs), along with retrieving NFT metadata for unique digital assets.
- [**Advanced Operations:**](stratus/examples/advanced.md) Dive deeper into smart contract interactions, token approvals, and event handling for building sophisticated dApps on Stratus.

## Why Stratus?

Stratus is designed for developers looking to leverage the full potential of blockchain technology without compromising on speed, security, or scalability. It provides:

- **High Scalability:** Handles transactions and smart contract executions efficiently, ensuring your dApps can scale with user demand.
- **Enhanced Security:** Built with Rust, Stratus offers robust security features to protect against common vulnerabilities.
- **EVM Compatibility:** Develop dApps with the familiarity of Ethereum's tooling and ecosystem, while benefiting from Stratus's performance improvements.

## Conclusion

The Stratus blockchain, in combination with the Cryptum SDK, provides a powerful platform for developing decentralized applications. From simple token transfers to complex dApp functionalities, these guides are designed to help you navigate the Stratus ecosystem and harness its capabilities for your projects.

For more information and the source code for Stratus, visit the official Stratus repository.
