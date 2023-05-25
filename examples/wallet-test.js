const CryptumSdk = require('../index')

const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: '0x',
})

const randomMnemonic =
  'chuckle hospital hire side clarify slow large proud jazz diary merge blame pull exhibit broccoli hold neutral car caught sorry fee erupt rocket silly'

const wallet = {
  protocol: 'CHILIZ',
  privateKey: '0xe99703f1214daea47d144f9bc59e8b427b0de1dbdc7ab2e68af86b867db27a40',
  publicKey:
    '0xe968c99792820f9ea888faf64d78f511c859d061dbb9a943a905f4a795dc198fd84faa936e05596d28fb3cb6e612cfa124a3c481724e21af001ad7fe306aede9',
  address: '0x84e1B47babDd087E3B046c2c6d1606FFAB8Ddef2',
  xpub: 'xpub6EJ5C4XvWTexbxtW2YEjdSWZM455sztsUnr2wwMvYD9g2zQmuCDwrB6N1nESvZfqDEas2dgijWn3nTtVHBB5FnKfep8sMNSAxTHZfWXF6YQ',
  testnet: undefined,
}

const generateRandomMnemonic = async () => {
  console.log(await sdk.wallet.generateRandomMnemonic())
}
// generateRandomMnemonic()

const generateWallet = async () => {
  console.log(
    await sdk.wallet.generateWallet({
      protocol: 'CHILIZ',
      mnemonic: randomMnemonic,
    })
  )
}
// generateWallet()

const generateWalletFromPrivateKey = async () => {
  console.log(
    await sdk.wallet.generateWalletFromPrivateKey({
      privateKey: '0x2bf8ee73ce9f273c95c92f8cd2d0c01484322c96a41176d58c9528a94422f8ce',
      protocol: 'CHILIZ',
    })
  )
}
// generateWalletFromPrivateKey()

const generateWalletAddressFromXpub = async () => {
  console.log(
    sdk.wallet.generateWalletAddressFromXpub({
      protocol: 'CHILIZ',
      xpub: 'xpub6EXGf8jsdCML3GUK1udbrH5kFj4pGfaAx8XTNk5x9iyE9tkGZmqhUC2pPD2YZbzoA3ZDNkiMh2kyviwAouq22kEwyUdLxWXMi7vaAAFq9uQ',
    })
  )
}
// generateWalletAddressFromXpub() arrumar (Pending) 

const generateChilizWallet = async () => {
  console.log(await sdk.wallet.generateChilizWallet({
    mnemonic: randomMnemonic
  }))
}
// generateChilizWallet()

const getWalletInfo = async () => {
  console.log(
    await sdk.wallet.getWalletInfo({
      address: '0xf1f2c62767518668874a02360c3f9f52cdfa196a',
      protocol: 'CHILIZ',
    })
  )
}
// getWalletInfo()

const getWalletNft = async () => {
  console.log(await sdk.wallet.getWalletNft({
    address:'0xfD1A88E2138Ac4dC1C7Edf59dbaddd599E7803bD',
    protocol: 'CHILIZ'
  }))
}
// getWalletNft()  arrumar unsupported protocol

