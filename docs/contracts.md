# Tokens and Smart contracts

Protocols supported are `CELO`, `ETHEREUM` and `BSC`.

Use the transaction controller to create the transactions below:

```js
const txController = sdk.getTransactionController()
```

## Call smart contract method

### `txController.callSmartContractMethod(opts)`

Call a method of a smart contract and receive its value without creating a transaction in the blockchain.

- `opts.wallet` (Wallet) (**required**) - wallet calling the smart contract.
- `opts.contractAddress` (string) (**required**) - contract address of the smart contract.
- `opts.contractAbi` (array) (**required**) - json interface of the method (for more info on [contract ABI](https://docs.soliditylang.org/en/develop/abi-spec.html)).
- `opts.method` (string) (**required**) - smart contract method.
- `opts.params` (array) - parameters to be passed to the method.
- `opts.protocol` (string) (**required**) - blockchain protocol: `ETHEREUM`, `CELO` or `BSC`.

```js
const { result } = await txController.callSmartContractMethod({
  wallet,
  contractAddress: '0x2B751008...6a763e72788Db9Ca',
  contractAbi: [
    {
      constant: true,
      inputs: [],
      name: 'message',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ],
  method: 'message',
  params: [],
  protocol: 'CELO', // CELO, ETHEREUM, BSC only
})
console.log(result)
// Result value from smart contract method
```

## Create smart contract call transactions

### `txController.createSmartContractTransaction(opts)`

Call a method of a smart contract that will generate a transaction in the blockchain.

- `opts.wallet` (Wallet) (**required**) - wallet calling the smart contract.
- `opts.contractAddress` (string) (**required**) - contract address of the smart contract.
- `opts.contractAbi` (array) (**required**) - json interface of the method (for more info on [contract ABI](https://docs.soliditylang.org/en/develop/abi-spec.html)).
- `opts.method` (string) (**required**) - smart contract method.
- `opts.params` (array) - parameters to be passed to the method.
- `opts.protocol` (string) (**required**) - blockchain protocol: `ETHEREUM`, `CELO` or `BSC`.

```js
// for Celo, Ethereum and BSC blockchain
const transaction = await txController.createSmartContractTransaction({
  wallet,
  contractAddress: '0x3f2f3D45196...8f530165eCb93e772',
  contractAbi: [
    {
      constant: false,
      inputs: [
        { name: 'param1', type: 'string' },
        { name: 'param2', type: 'uint256' },
        { name: 'param3', type: 'uint256' },
      ],
      name: 'executeMethodName',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  method: 'executeMethodName',
  params: ['param1', 2, 3],
  protocol: 'CELO', // CELO, ETHEREUM, BSC only
})
```

## Deploy tokens

### `txController.createTokenDeployTransaction(opts)`

### ERC20 token

The smart contract used in this deployment is in the [contracts](./contracts/TokenERC20.sol) directory, so the `params` argument must be an array of three elements indicating the token name, symbol and total supply.

- `opts.wallet` (Wallet) (**required**) - wallet calling the smart contract.
- `opts.tokenType` (string) (**required**) - token type is either `ERC20` or `ERC721`.
- `opts.params` (array) - parameters to be passed to the constructor of the deployment.
- `opts.protocol` (string) (**required**) - blockchain protocol: `ETHEREUM`, `CELO` or `BSC`.

```js
const transaction = await txController.createTokenDeployTransaction({
  wallet,
  tokenType: 'ERC20',
  params: ['Token name', 'TOK', '1000000'],
  protocol: 'CELO', // CELO, ETHEREUM, BSC only
})
```

### ERC721 token

The smart contract used in this deployment is in the [contracts](./contracts/TokenERC721.sol) directory, so the `params` argument must be an array of two elements indicating the token name and symbol.

```js
const transaction = await txController.createTokenDeployTransaction({
  wallet,
  tokenType: 'ERC721',
  params: ['NFT name', 'NFT'],
  protocol: 'CELO', // CELO, ETHEREUM, BSC only
})
```

## Deploy a smart contract

### `txController.createSmartContractDeployTransaction(opts)`

Deploy a smart contract source code written in Solidity to the blockchain.

- `opts.wallet` (Wallet) (**required**) - wallet deploying the smart contract.
- `opts.contractName` (string) (**required**) - main contract name. There could be many contracts in the source code, but you must specify which one is the main one to initialize it after deployment.
- `opts.params` (array) (**required**) - parameters to be passed to the constructor of the main contract.
- `opts.source` (string) (**required**) - source code of the contract encoded in UTF-8.
- `opts.protocol` (string) (**required**) - blockchain protocol: `ETHEREUM`, `CELO` or `BSC`.

```js
const transaction = await txController.createSmartContractDeployTransaction({
  wallet,
  contractName: 'HelloWorld',
  params: ['hello'],
  source: fs.readFileSync(`${__dirname}/contracts/HelloWorld.sol`, { encoding: 'utf8' }),
  protocol: 'CELO', // CELO, ETHEREUM, BSC only
})
```

## Send transactions to the blockchain

After creating a transaction, use this method to broadcast the transaction.

```js
const { hash } = await txController.sendTransaction(transaction)
console.log(hash)
// Log transaction hash
```
