const CryptumSdk = require('../index')

const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: '0x',
})

const wallet = {
  protocol: 'CHILIZ',
  privateKey: '0x975eda7e45334b31c6d3ace5c1d7ece69bf613a9ad1e5ed87da1fa671af036e5',
  publicKey:
    '0x0dc8966f81a0e1e74d02d2a4f7b57ae8734bd045e32c60c265fbae20be88b436b1328c7c44564ab61eaa2ecb1607dbf24055000f9cbd53851b12528a388e8eaf',
  address: '0x41b75df18e8b416386e1abba674a08cd55b10f9b',
  xpub: 'xpub6E1bfW2Fecmm7XnDFvESQntFijA42ufkkY84YxA4vKnvJXud6r1WKhbENGgmBrehVXynVDDtEo6pR24mKZZTwYKXuqBN6Ymu5vGTQ82e7tA',
  testnet: undefined,
}

const walletTwo = {
  protocol: 'CHILIZ',
  privateKey: '0xabb220c719bd47275343f83c1a6036639c4b999f27b83c2831b167ca44b3d427',
  publicKey: null,
  address: '0x0c8bf2deb94d77a2c509d900dbdf77fe98397cec',
  xpub: undefined,
  testnet: true,
}

const getTokenInfo = async () => {
  console.log(
    await sdk.token.getInfo({ protocol: 'CHILIZ', tokenAddress: '0x840ff03C4D5881c6340B3B89FD1C83c7476eFc27' })
  )
}
// getTokenInfo()

const getTokenBalance = async () => {
  console.log(
    await sdk.token.getBalance({
      protocol: 'CHILIZ',
      address: '0x840ff03c4d5881c6340b3b89fd1c83c7476efc27',
      tokenAddress: '0x840ff03C4D5881c6340B3B89FD1C83c7476eFc27',
    })
  )
}
// getTokenBalance()

const transferToken = async () => {
  console.log(
    await sdk.token.transfer({
      wallet: wallet,
      protocol: 'CHILIZ',
      token: 'CHZ',
      amount: '0.0000001',
      destination: '0x0c8bf2deb94d77a2c509d900dbdf77fe98397cec',
    })
  )
}
// transferToken()

const createToken = async () => {
  console.log(
    await sdk.token.create({
      wallet: wallet,
      name: 'renataTEST',
      symbol: 'RTEST',
      decimals: 18,
      amount: '0',
      protocol: 'CHILIZ',
      fee: {
        gas: 7.5,
        gasPrice: 400000
      },
    })
  )
}
// createToken()

const mintToken = async () => {
  console.log(
    await sdk.token.mint({
      protocol: 'CHILIZ',
      wallet: wallet,
      tokenAddress: '0x840ff03C4D5881c6340B3B89FD1C83c7476eFc27',
      token: '',
      amount: '',
    })
  )
}
// mintToken() só com createToken funcionando

// const burnToken = async () => {
//   console.log( await sdk.token.burn({

//   }))
// }
