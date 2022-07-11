# Smart contracts on EVMs (Etherum-based blockchains)

- [Call smart contract method](#call-smart-contract-method)
- [Create smart contract call transaction](#create-smart-contract-call-transaction)
- [Deploy a smart contract](#deploy-a-smart-contract)

```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY'
})
```

## Call smart contract method

### `sdk.contract.callMethod(opts)`

Call a method of a smart contract and receive its value without creating a transaction in the blockchain.

- `opts.contractAddress` (string) (**required**) - contract address of the smart contract.
- `opts.contractAbi` (array) (**required**) - json interface of the method (for more info on [contract ABI](https://docs.soliditylang.org/en/develop/abi-spec.html)).
- `opts.method` (string) (**required**) - smart contract method.
- `opts.params` (array) - parameters to be passed to the method.
- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).

```js
const { result } = await sdk.contract.callMethod({
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
  protocol: 'CELO'
})
console.log(result)
// Result value from smart contract method
```

## Create smart contract call transaction

### `sdk.contract.callMethodTransaction(opts)`

Call a method of a smart contract that will generate a transaction in the blockchain.

- `opts.wallet` (Wallet) (**required**) - wallet calling the smart contract and signing this transaction.
- `opts.contractAddress` (string) (**required**) - contract address of the smart contract.
- `opts.contractAbi` (array) (**required**) - json interface of the method (for more info on [contract ABI](https://docs.soliditylang.org/en/develop/abi-spec.html)).
- `opts.method` (string) (**required**) - smart contract method.
- `opts.params` (array) - parameters to be passed to the method.
- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).

```js
const { hash } = await sdk.contract.callMethodTransaction({
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
  protocol: 'BSC'
})
```

## Deploy a smart contract

### `sdk.contract.deploy(opts)`

Deploy a smart contract source code written in Solidity to the blockchain.

- `opts.wallet` (Wallet) (**required**) - wallet deploying the smart contract.
- `opts.contractName` (string) (**required**) - main contract name. There could be many contracts in the source code, but you must specify which one is the main one to initialize it after deployment.
- `opts.params` (array) (**required**) - parameters to be passed to the constructor of the main contract.
- `opts.source` (string) (**required**) - source code of the contract encoded in UTF-8.
- `opts.protocol` (string) (**required**) - [EVMs only](../protocols.md#ethereum-based-blockchains-evms).

```js
const { hash } = await sdk.contract.deploy({
  wallet,
  contractName: 'HelloWorld',
  params: ['hello'],
  source: fs.readFileSync(`${__dirname}/contracts/HelloWorld.sol`, { encoding: 'utf8' }),
  protocol: 'POLYGON'
})
```
