<br />
<p align="center">
  <a href="https://cryptum.io" target="_blank"><img alt="Cryptum" src="./docs/images/cryptum.jpeg"></a>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
- [First Steps](#first-steps)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [How To's](#how-tos)
    - [Configuration](#configuration)
    - [Blockchain queries](docs/queries.md)
    - [Wallets](docs/wallets.md)
    - Tokens (ERC20)
      - [Ethereum and other EVMs](docs/tokens/EVMs.md)
      - [Solana](docs/tokens/solana.md)
      - [Hathor](docs/tokens/hathor.md)
      - [Stellar](docs/tokens/stellar.md)
      - [Ripple](docs/tokens/ripple.md)
      - [Bitcoin](docs/tokens/bitcoin.md)
      - [Cardano](docs/tokens/cardano.md)
    - NFTs
      - [Ethereum and other EVMs](docs/nfts/EVMs.md)
      - [Solana](docs/nfts/solana.md)
      - [Hathor](docs/nfts/hathor.md)
    - Smart contracts
      - [Loot boxes](docs/lootbox.md)
    - [Prices](docs/prices.md)
    - [Swap tokens](docs/swap.md)
    - [Webhooks](docs/webhooks.md)
    - [Staking](docs/staking/index.md)
- [Contributing](#contributing)
  - [What does my PR need to be accepted ?](#what-does-my-pr-need-to-be-accepted-)
- [License](#license)
- [Contact](#contact)

## About The Project

This project provides a handy way to integrage your JavaScript code with Cryptum's backend through simple function calls that do all the heavy lifting for you. Learn more about Cryptum <a href="https://cryptum.io" target="_blank">here</a>.

## First Steps

### Requirements

- NPM
- Node version: ^14.17.0

### Installation

Open your project

```bash
cd my-amazing-project/
```

Install using npm manager or yarn

```bash
npm install -S cryptum-sdk

yarn add cryptum-sdk
```

### How To's

Below is a short code example showing how you can use cryptum-sdk to connect your amazing application with several blockchains.

#### Configuration

To configure cryptum-sdk you need only to provide a config in format JSON.

```js
const CryptumSDK = require('cryptum-sdk')

const sdk = new CryptumSDK({
  enviroment: 'development', // 'testnet' or 'development', 'mainnet' or 'production'
  apiKey: 'my-secret-api-key',
})
```

<br>

For more in-depth examples check the docs/ folder and our guides <a href="https://docs.cryptum.io" target="_blank">here</a>.

## Contributing

Contributions are what make the open source community an incredible place to learn, inspire and create. Any contribution you make will be **much appreciated**.

1. Fork the project
2. Create a Branch for your feature (`git checkout -b feature/amazing-feature`)
3. Insert your changes (`git add .`)
4. Make a commit with your changes (`git commit -m 'feat(<folder-name>): Inserting a Amazing Feature !`)
5. Push the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### What does my PR need to be accepted ?

In order for us to accept your PR, you need to adhere to the following standards.

1. Create using the code pattern currently used in cryptum-sdk
2. Test your update and show artifacts in PR.

That's it 🤷🏻‍♂️

## License

Distributed under the MIT license. See `LICENSE` for more information.

## Contact

Blockforce - [SITE](https://blockforce.in/) - **HELLO@BLOCKFORCE.IN**
