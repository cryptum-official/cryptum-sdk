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



const getWallet = async () => {
  console.log(
    await sdk.wallet.getWalletInfo({
      address: '0xfD1A88E2138Ac4dC1C7Edf59dbaddd599E7803bD',
      protocol: 'CHILIZ'      
    })
  )
}

getWallet()
