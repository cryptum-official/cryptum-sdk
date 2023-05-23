const CryptumSdk = require('../index')

const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: '0x',
})

const wallet = {
  protocol: 'CHILIZ',
  privateKey: '0xe99703f1214daea47d144f9bc59e8b427b0de1dbdc7ab2e68af86b867db27a40',
  publicKey:
    '0xe968c99792820f9ea888faf64d78f511c859d061dbb9a943a905f4a795dc198fd84faa936e05596d28fb3cb6e612cfa124a3c481724e21af001ad7fe306aede9',
  address: '0x84e1B47babDd087E3B046c2c6d1606FFAB8Ddef2',
  xpub: 'xpub6EJ5C4XvWTexbxtW2YEjdSWZM455sztsUnr2wwMvYD9g2zQmuCDwrB6N1nESvZfqDEas2dgijWn3nTtVHBB5FnKfep8sMNSAxTHZfWXF6YQ',
  testnet: undefined,
}

const getInfo = async () => {
  console.log(
    await sdk.token.getInfo({ 
      protocol: 'CHILIZ', 
      tokenAddress: '0x840ff03C4D5881c6340B3B89FD1C83c7476eFc27' 
    })
  )
}
// getInfo()

const getBalance = async () => {
  console.log(
    await sdk.token.getBalance({
      protocol: 'CHILIZ',
      address: '0x43cE2726F10169d40b9F97E7ca906aecb6403581',
      tokenAddress: '0x43cE2726F10169d40b9F97E7ca906aecb6403581',
    })
  )
}
// getBalance()

const transferToken = async () => {
  console.log(
    await sdk.token.transfer({
      wallet: wallet,
      protocol: 'CHILIZ',
      token: '0x840ff03C4D5881c6340B3B89FD1C83c7476eFc27',
      amount: '1',
      destination: '0xfD1A88E2138Ac4dC1C7Edf59dbaddd599E7803bD',
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

const burnToken = async () => {
  console.log(
    await sdk.token.burn({
      protocol: 'CHILIZ',
      amount: '1',
      token: '0x840ff03C4D5881c6340B3B89FD1C83c7476eFc27',
      wallet: wallet,
    })
  )
}
// burnToken() só com createToken funcionando

const approveToken = async () => {
  console.log(
    await sdk.token.approve({
      token: '0x840ff03C4D5881c6340B3B89FD1C83c7476eFc27',
      protocol: 'CHILIZ',
      wallet: wallet,
    })
  )
}

// approveToken()

