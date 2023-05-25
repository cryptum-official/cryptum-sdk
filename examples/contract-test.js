const CryptumSdk = require('../index')

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

const callMethod = async () => {
  console.log(
    await sdk.contract.callMethod({
      protocol: 'CHILIZ',
      contractAddress:'0xc070Bcd22e88615d4092c70BEF104d80a4c213aC',
      
    })
  )
}
callMethod()

const callMethodTransaction = async () => {
  console.log(await sdk.contract.callMethodTransaction({}))
}

const buildMethodTransaction = async () => {
  console.log(await sdk.contract.buildMethodTransaction({}))
}
const deployContract = async () => {
  console.log(
    await sdk.contract.deploy({
      protocol: 'CHILIZ',
      wallet: wallet,
      contractName: 'renataCONTRACT',
      params: '',
    })
  )
}
// deployContract() 

const buildDeployTransaction = async () => {
  console.log(
    await sdk.contract.buildDeployTransaction({
      protocol: 'CHILIZ',
      wallet: wallet,
      contractName: 'renataCONTRACT',

    })
  )
}
// buildDeployTransaction()

const deployToken = async () => {
  console.log(await sdk.contract.deployToken({
    protocol:'CHILIZ',
    contractAddress:'0xc070Bcd22e88615d4092c70BEF104d80a4c213aC',
    tokenType:'ERC721',

  }))
}
// deployToken()

const buildDeployTokenTransaction = async () => {
  console.log(await sdk.contract.buildDeployTokenTransaction({}))
}
