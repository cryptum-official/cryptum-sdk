const CryptumSdk = require('../index')
const fs = require('fs')

const sdk = new CryptumSdk({
    environment: 'development',
    apiKey: '123',
})

async function TOKENDEPLOY() {
    const wallet = await sdk.getWalletController().generateWallet({
        mnemonic: 'hen script plate injury bronze actual flower enable benefit imitate silent order owner trial absent great draw chair hair south property second pool thought',
        protocol: 'AVAXCCHAIN'
    })
    const txController = sdk.getTransactionController()
    const transaction = await txController.createTokenDeployTransaction({
        wallet,
        tokenType: 'ERC20',
        params: ['Token name', 'TOK', '1000000'],
        protocol: 'AVAXCCHAIN', // CELO, ETHEREUM, BSC only
    })

    // console.log(transaction)
    const { hash } = await txController.sendTransaction(transaction)
    console.log(hash)
    // Log transaction hash
}

// TOKENDEPLOY()


async function deploySmartContract() {
    const wallet = await sdk.getWalletController().generateWallet({
        mnemonic: 'hen script plate injury bronze actual flower enable benefit imitate silent order owner trial absent great draw chair hair south property second pool thought',
        protocol: 'AVAXCCHAIN'
    })
    console.log(`---------------- deploy smart contract -----------------`)
    const txController = sdk.getTransactionController()
    const tx = await txController.createSmartContractDeployTransaction({
        wallet,
        contractName: 'HelloWorld',
        params: ['hello'],
        source: fs.readFileSync(`${__dirname}/HelloWorld.sol`, { encoding: 'utf8' }),
        protocol: 'AVAXCCHAIN',
    })
    const transaction = await txController.sendTransaction(tx)
    console.log(transaction)
}

// deploySmartContract()



async function mintNFT() {
    const wallet = await sdk.getWalletController().generateWallet({
        mnemonic: 'hen script plate injury bronze actual flower enable benefit imitate silent order owner trial absent great draw chair hair south property second pool thought',
        protocol: 'AVAXCCHAIN'
    })
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
                name: 'safeMint',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        method: 'safeMint',
        params: ['0x0616504c45573f4cc5C46188021A514106A4c382', '0', 'google.com'],
    }

    const tx = await txController.createSmartContractTransaction({
        ...options,
        wallet,
        contractAddress: '0x301CCF6Cc27E11c76608d3E03276EA853b17e266',
        protocol: 'AVAXCCHAIN',
    })
    const resp = await txController.sendTransaction(tx)
    console.log(resp)
}

// mintNFT()


async function callSmartContractMethod() {
    console.log('---------------- callSmartContractMethod ------------------')
    const wallet = await sdk.getWalletController().generateWallet({
        mnemonic: 'hen script plate injury bronze actual flower enable benefit imitate silent order owner trial absent great draw chair hair south property second pool thought',
        protocol: 'AVAXCCHAIN'
    })
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
    const res = await txController.callSmartContractMethod({
        ...options,
        wallet,
        contractAddress: '0xDB75Be7D7c3e3D83A837702B710160D5cEDDC67D',
        protocol: 'AVAXCCHAIN',
    })
    console.log(res)
}

// callSmartContractMethod()



async function transferNFT() {
    console.log('---------------- transferNFT ------------------------')
    const txController = sdk.getTransactionController()
    const wallet = await sdk.getWalletController().generateWallet({
        mnemonic: 'hen script plate injury bronze actual flower enable benefit imitate silent order owner trial absent great draw chair hair south property second pool thought',
        protocol: 'AVAXCCHAIN'
    })
    const options = {
        contractAbi: [
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "from",
                        type: "address"
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    }
                ],
                name: "safeTransferFrom",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            }
        ],
        method: 'safeTransferFrom',
        params: ['0x0616504c45573f4cc5C46188021A514106A4c382', '0x9920a69fC53492F5c4499dAe060f2226e01e1DA9', 0],
    }
    const tx = await txController.createSmartContractTransaction({
        ...options,
        wallet,
        contractAddress: '0x301CCF6Cc27E11c76608d3E03276EA853b17e266',
        protocol: 'AVAXCCHAIN',
    })
    const res = await txController.sendTransaction(tx)
    console.log(res)
}

// transferNFT()


async function transferERC20() {
    console.log(`---------------- transfer -----------------`)
    const wallet = await sdk.getWalletController().generateWallet({
        mnemonic: 'hen script plate injury bronze actual flower enable benefit imitate silent order owner trial absent great draw chair hair south property second pool thought',
        protocol: 'AVAXCCHAIN'
    })
    const txController = sdk.getTransactionController()
    const tx = await txController.createAvaxCChainTransferTransaction({
        wallet,
        tokenSymbol: 'TOK',
        contractAddress: '0x55A2DF36fFA3383f0a0dAc21E46D15e1978F1fF4',
        amount: '10',
        destination: '0x0616504c45573f4cc5C46188021A514106A4c382'
    })
    const transfer = await txController.sendTransaction(tx)
    console.log(transfer)
}

// transferERC20()


async function getBalance() {
    console.log('---------------- getBalance ---------------')
    const address = '0x0616504c45573f4cc5C46188021A514106A4c382'
    const saldo =  await sdk.getWalletController().getWalletInfo({ address, protocol: 'AVAXCCHAIN', tokenAddresses: ['0x55A2DF36fFA3383f0a0dAc21E46D15e1978F1fF4'] })
    console.log(saldo)
}

getBalance()