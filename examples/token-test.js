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

const getInfo = async () => {
  console.log(
    '------getInfo------: ',
    await sdk.token.getInfo({
      protocol: 'CHILIZ',
      tokenAddress: '0x840ff03C4D5881c6340B3B89FD1C83c7476eFc27',
    })
  )
}

const getBalance = async () => {
  console.log(
    '------getBalance------: ',
    await sdk.token.getBalance({
      protocol: 'CHILIZ',
      address: '0xfD1A88E2138Ac4dC1C7Edf59dbaddd599E7803bD',
      tokenAddress: '0x840ff03C4D5881c6340B3B89FD1C83c7476eFc27',
    })
  )
}

const transferToken = async () => {
  console.log(
    '------transferToken------: ',
    await sdk.token.transfer({
      wallet: wallet,
      protocol: 'CHILIZ',
      token: 'CHZ',
      amount: '2',
      destination: '0xfD1A88E2138Ac4dC1C7Edf59dbaddd599E7803bD',
    })
  )
}

const createToken = async () => {
  console.log(
    '------createToken------: ',
    await sdk.token.create({
      wallet: wallet,
      name: 'renataTEST',
      symbol: 'RNT',
      decimals: 18,
      amount: '0',
      protocol: 'CHILIZ',
    })
  )
}

const mintToken = async () => {
  console.log(
    '------mintToken------: ',
    await sdk.token.mint({
      protocol: 'CHILIZ',
      wallet: wallet,
      token: '0xc070Bcd22e88615d4092c70BEF104d80a4c213aC',
      amount: '9',
      destination: '0xfd1a88e2138ac4dc1c7edf59dbaddd599e7803bd',
    })
  )
}

const burnToken = async () => {
  console.log(
    '------burnToken------: ',
    await sdk.token.burn({
      protocol: 'CHILIZ',
      amount: '1',
      token: '0xc070Bcd22e88615d4092c70BEF104d80a4c213aC',
      wallet: wallet,
    })
  )
}

const approveToken = async () => {
  console.log(
    '------approveToken------: ',
    await sdk.token.approve({
      token: '0xc070Bcd22e88615d4092c70BEF104d80a4c213aC',
      protocol: 'CHILIZ',
      wallet: wallet,
      spender: '0x672861244519573bf14c567F3E978E5DB8609ad1',
      amount: '1',
    })
  )
}

async function run() {
  await getInfo()
  await getBalance()
  await transferToken()
  await createToken()
  await mintToken()
  await burnToken()
  await approveToken()
}
run()
