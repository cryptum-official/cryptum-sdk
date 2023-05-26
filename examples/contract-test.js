const CryptumSdk = require('../index')
const fs = require('fs')

const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: '0x',
})

const wallet = {
  protocol: 'CHILIZ',
  privateKey: '0x2bf8ee73ce9f273c95c92f8cd2d0c01484322c96a41176d58c9528a94422f8ce',
  publicKey: null,
  address: '0xfd1a88e2138ac4dc1c7edf59dbaddd599e7803bd',
  xpub: undefined,
  testnet: true,
}

const ERC20_APPROVAL_METHOD_ABI = [
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const ERC20_MINT_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const callMethod = async () => {
  console.log('------callMethod------: ',
    await sdk.contract.callMethod({
      protocol: 'CHILIZ',
      contractAddress: '0xc070Bcd22e88615d4092c70BEF104d80a4c213aC',
      params: [],
      contractAbi: ERC20_APPROVAL_METHOD_ABI,
      method: 'decimals',
      from: wallet.address,
    })
  )
}

const callMethodTransaction = async () => {
  console.log('------callMethodTransaction------: ',
  await sdk.contract.callMethodTransaction({
    protocol: 'CHILIZ',
    contractAddress: '0xc070Bcd22e88615d4092c70BEF104d80a4c213aC',
    params: ['0xfd1a88e2138ac4dc1c7edf59dbaddd599e7803bd', 1],
    contractAbi: ERC20_MINT_METHOD_ABI,
    method: 'mint',
    wallet: wallet,
  })
  )
}

const buildMethodTransaction = async () => {
  console.log('------buildMethodTransaction------: ',
  await sdk.contract.buildMethodTransaction({
    protocol: 'CHILIZ',
    contractAddress: '0xc070Bcd22e88615d4092c70BEF104d80a4c213aC',
    params: ['0xfd1a88e2138ac4dc1c7edf59dbaddd599e7803bd', 1],
    contractAbi: ERC20_MINT_METHOD_ABI,
    method: 'mint',
    wallet: wallet,
  })
  )
}

const deployContract = async () => {
  console.log('------deployContract------: ',
  await sdk.contract.deploy({
    protocol: 'CHILIZ',
    wallet: wallet,
    contractName: 'renataCONTRACT',
    params: [],
    source: '',
  })
  )
}
// deployContract() arrumar source

const buildDeployTransaction = async () => {
  console.log('------buildDeployTransaction------: ',
  await sdk.contract.buildDeployTransaction({
    protocol: 'CHILIZ',
    wallet: wallet,
    contractName: 'renataCONTRACT',
    params: [],
    source: '',
  })
  )
}
// buildDeployTransaction() arrumar source

const deployToken = async () => {
  console.log('------deployToken------: ',
  await sdk.contract.deployToken({
    protocol: 'CHILIZ',
    contractAddress: '0xc070Bcd22e88615d4092c70BEF104d80a4c213aC',
    tokenType: 'ERC721',
    wallet: wallet,
    params: [],
  })
  )
}

const buildDeployTokenTransaction = async () => {
  console.log('------buildDeployTokenTransaction------: ',await sdk.contract.buildDeployTokenTransaction({
    protocol:'CHILIZ',
    wallet: wallet,
    params: [],
    tokenType: 'ERC721'
  }))
}

async function run() {
  await callMethod()
  await callMethodTransaction()
  await buildMethodTransaction()
  await deployToken()
  await buildDeployTokenTransaction()  
}
run()