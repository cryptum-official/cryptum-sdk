#!/usr/bin/env node
const fs = require('fs')
const CryptumSdk = require('../index')

if (!process.env.APIKEY) {
  throw new Error('API key is invalid')
}

const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: process.env.APIKEY,
})

const PRIVATE_KEY_PATH = `${__dirname}/.privkey`
function loadPrivateKey() {
  return fs.readFileSync(PRIVATE_KEY_PATH, { encoding: 'utf8' })
}

async function generateWallet() {
  console.log('----------------- generate wallet -------------------')
  const wallet = await sdk.getWalletController().generateWallet({ protocol: 'CELO' })
  fs.writeFileSync(PRIVATE_KEY_PATH, wallet.privateKey)
  return wallet
}

async function getBalance({ address, tokenAddresses }) {
  console.log('---------------- getBalance ---------------')
  return await sdk.getWalletController().getWalletInfo({ address, protocol: 'CELO', tokenAddresses })
}

async function transferERC20({ destination, amount, tokenAddress, tokenSymbol }) {
  console.log(`---------------- transfer -----------------`)
  const privateKey = loadPrivateKey()
  const txController = sdk.getTransactionController()
  const tx = await txController.createCeloTransferTransaction({
    wallet: await sdk.getWalletController().generateWalletFromPrivateKey({ privateKey, protocol: 'CELO' }),
    tokenSymbol,
    contractAddress: tokenAddress,
    amount,
    destination,
  })
  return await txController.sendTransaction(tx)
}

async function mintNFT({ contractAddress, to, id, uri }) {
  console.log('---------------- mintNFT ------------------------')
  const txController = sdk.getTransactionController()
  const options = {
    contractAbi: [
      {
        constant: false,
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string',
          },
        ],
        name: 'mintWithTokenURI',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    method: 'mintWithTokenURI',
    params: [to, id, uri],
  }
  const privateKey = loadPrivateKey()
  const tx = await txController.createSmartContractTransaction({
    ...options,
    wallet: await sdk.getWalletController().generateWalletFromPrivateKey({ privateKey, protocol: 'CELO' }),
    contractAddress,
    protocol: 'CELO',
  })
  return await txController.sendTransaction(tx)
}
async function transferNFT({ contractAddress, to, id }) {
  console.log('---------------- transferNFT ------------------------')
  const txController = sdk.getTransactionController()
  const options = {
    contractAbi: [
      {
        constant: false,
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        name: 'safeTransfer',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    method: 'safeTransfer',
    params: [to, id],
  }
  const privateKey = loadPrivateKey()
  const tx = await txController.createSmartContractTransaction({
    ...options,
    wallet: await sdk.getWalletController().generateWalletFromPrivateKey({ privateKey, protocol: 'CELO' }),
    contractAddress,
    protocol: 'CELO',
  })
  return await txController.sendTransaction(tx)
}
async function callSmartContractMethod() {
  console.log('---------------- callSmartContractMethod ------------------')
  const txController = sdk.getTransactionController()
  const options = {
    contractAbi: [
      {
        constant: true,
        inputs: [],
        name: 'message',
        outputs: [
          {
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
  }
  const privateKey = loadPrivateKey()
  return await txController.callSmartContractMethod({
    ...options,
    wallet: await sdk.getWalletController().generateWalletFromPrivateKey({ privateKey, protocol: 'CELO' }),
    contractAddress: '0x2B751008e680E1921161C5456a763e72788Db9Ca',
    protocol: 'CELO',
  })
}

async function deployToken({ tokenType, params }) {
  console.log(`---------------- deploy ${tokenType} -----------------`)
  const privateKey = loadPrivateKey()
  const txController = sdk.getTransactionController()
  const tx = await txController.createTokenDeployTransaction({
    wallet: await sdk.getWalletController().generateWalletFromPrivateKey({ privateKey, protocol: 'CELO' }),
    tokenType,
    params,
    protocol: 'CELO',
  })
  return await txController.sendTransaction(tx)
}

async function start() {
  switch (process.argv[2]) {
    case 'generate-wallet': {
      return await generateWallet()
    }
    case 'balance': {
      return await getBalance({
        address: process.argv[3],
        tokenAddresses: process.argv[4].split(','),
      })
    }
    case 'transfer-erc20': {
      const isNativeToken = ['CELO', 'cUSD'].includes(process.argv[3])
      return await transferERC20({
        tokenSymbol: isNativeToken ? process.argv[3] : null,
        tokenAddress: isNativeToken ? null : process.argv[3],
        amount: process.argv[4],
        destination: process.argv[5],
      })
    }
    case 'call-contract-method': {
      return await callSmartContractMethod()
    }
    case 'transfer-NFT': {
      return await transferNFT({
        contractAddress: process.argv[3],
        to: process.argv[4],
        id: process.argv[5],
      })
    }
    case 'mint-NFT': {
      return await mintNFT({
        contractAddress: process.argv[3],
        to: process.argv[4],
        id: process.argv[5],
        uri: process.argv[6],
      })
    }
    case 'deploy-token': {
      return await deployToken({ tokenType: process.argv[3], params: process.argv[4].split(',') })
    }
  }
}
start().then(console.log).catch(console.error)
