#!/usr/bin/env node
const fs = require('fs')
const CryptumSdk = require('../index')
const APIKEY =
  'QBtX081m3136XMwVIbSGupZmPaL1AEIh1azjgp5DUA2ssGwrhcrCZkPtH3c82E7fA3iJXwgnS221dQaldJP1IHnJef563wuHaI9VreszVznZ0BOpvgMlwbceKEAvoq0zIdA'
const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: APIKEY,
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

async function getBalance({ address, tokenAddress, tokenSymbol }) {
  console.log('---------------- getBalance ---------------')
  return await sdk.getWalletController().getWalletInfo({ address, protocol: 'CELO' })
}

async function transfer({ destination, amount, tokenAddress, tokenSymbol }) {
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

async function createSmartContractsTransaction(message) {
  console.log('---------------- createSmartContractsTransaction ------------------------')
  const txController = sdk.getTransactionController()
  const options = {
    contractAbi: [
      {
        constant: false,
        inputs: [
          {
            internalType: 'string',
            name: 'newMessage',
            type: 'string',
          },
        ],
        name: 'update',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    method: 'update',
    params: [message],
  }
  const privateKey = loadPrivateKey()
  const tx = await txController.createSmartContractTransaction({
    ...options,
    wallet: await sdk.getWalletController().generateWalletFromPrivateKey({ privateKey, protocol: 'CELO' }),
    contractAddress: '0x2B751008e680E1921161C5456a763e72788Db9Ca',
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
  }
  const privateKey = loadPrivateKey()
  return await txController.callSmartContractMethod({
    ...options,
    wallet: await sdk.getWalletController().generateWalletFromPrivateKey({ privateKey, protocol: 'CELO' }),
    contractAddress: '0x2B751008e680E1921161C5456a763e72788Db9Ca',
    protocol: 'CELO',
  })
}

async function start() {
  switch (process.argv[2]) {
    case 'generate-wallet': {
      return await generateWallet()
    }
    case 'balance': {
      const isNativeToken = process.argv[3] === 'CELO'
      return await getBalance({
        address: process.argv[3],
        tokenSymbol: isNativeToken ? process.argv[4] : null,
        tokenAddress: isNativeToken ? null : process.argv[4],
      })
    }
    case 'transfer': {
      const isNativeToken = ['CELO', 'cUSD'].includes(process.argv[3])
      return await transfer({
        tokenSymbol: isNativeToken ? process.argv[3] : null,
        tokenAddress: isNativeToken ? null : process.argv[3],
        amount: process.argv[4],
        destination: process.argv[5],
      })
    }
    case 'call-contract-method': {
      return await callSmartContractMethod()
    }
    case 'call-contract-method-transaction': {
      return await createSmartContractsTransaction(process.argv[3])
    }
  }
}
start().then(console.log).catch(console.error)
