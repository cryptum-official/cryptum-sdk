<br />
<p align="center">
  <h3 align="center">Cryptum SDK</h3>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About Project](#about-project)
- [Starting](#starting)
  - [Installation](#installation)
    - [Requirements for install](#requirements-for-install)
    - [Language used](#language-used)
    - [Commons Steps](#commons-steps)
  - [How To Use](#how-to-use)
    - [Configuration](#configuration)
    - [Wallets](docs/wallets.md)
    - [Webhooks](docs/webhooks.md)
    - [Transactions](docs/transactions.md)
    - [Tokens and Smart contracts](docs/contracts.md)
    - [Prices](docs/prices.md)
    - [Staking](docs/staking/index.md)
- [Contributing](#contributing)
  - [What does my PR need to be accepted ? 🤔](#what-does-my-pr-need-to-be-accepted--)
- [License](#license)
- [Contact](#contact)

## About Project

This project is to provide an integration with the Cryptum backend. This project calls Cryptum API using Clean Architecture and NodeJS.

## Starting

### Installation

#### Requirements for install

- NPM installed
- Node version: ^14.17.0

#### Language used

- Javascript

#### Commons Steps

Open your project

```bash
cd my-amazing-project/
```

Install using npm manager or yarn

```bash
npm install -S cryptum-sdk

yarn add cryptum-sdk
```

### How To Use

Below is an short description using code how you can use cryptum-sdk to integrate your amazing application with us.

#### Configuration

To configure cryptum-sdk you need only provide an config in format JSON.

```js
const CryptumSDK = require('cryptum-sdk')

const sdk = new CryptumSDK({
  enviroment: 'development',
  apiKey: 'my-secret-api-key',
})
```

To see environments available you can see here:
| Environments available |
|------------------------|
| development |
| production |

<br>

## Contributing

Contributions are what make the open source community an incredible place to learn, inspire and create. Any contribution you make will be **much appreciated**.

1. Make a project Fork
2. Create a Branch for your feature (`git checkout -b feature/amazing-feature`)
3. Insert your changes (`git add .`)
4. Make a commit with your changes (`git commit -m 'feat(<folder-name>): Inserting a Amazing Feature !`)
5. Push the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### What does my PR need to be accepted ? 🤔

In order for us to accept your PR, you need to adhere to the following standards.

1. Create using the code pattern currently used in cryptum-sk
2. Test your update and show artifacts in PR.

It's all 🤷🏻‍♂️

## License

Distributed under the MIT license. See `LICENSE` for more information.

## Contact

Blockforce - [SITE](https://blockforce.in/) - **HELLO@BLOCKFORCE.IN**
