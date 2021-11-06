const CryptumSdk = require('../index')
const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: process.env.APIKEY,
})

async function runtest() {
  const walletOne = await sdk.getWalletController().generateWallet({
    protocol: 'AVAXCCHAIN',
    mnemonic: "coyote cost habit float february version unique balcony pluck always cheese amount river conduct wave wonder north scale series gather skate address invite kidney",
    testnet: true, derivation: { account: 0 }
  })
  console.log('GENERATE FROM DERIVE PATH : ', walletOne)

  const walletTwo = await sdk.getWalletController().generateWalletAddressFromXpub({
    protocol: 'AVAXCCHAIN',
    xpub: 'xpub6Bxt5wwQHqGvkwtq44FMFB7SaJ1jrqfaKwNtymniWUi4bB6Sfn7V9iTw3P4TGkgDaht7yyiyzg3ZBbWP5GMmUBS1fSQAtLUdGYmDt9A1dWa',
    testnet: true, derivation: { account: 1 }
  })
  console.log('WALLET FROM XPUB: ', walletTwo)

  const walletThree = await sdk.getWalletController().generateWalletFromPrivateKey({
    protocol: 'AVAXCCHAIN',
    privateKey: '0x43e806089fa86e9dd5563782e4e593ee9da4f783aaac4fca67dfd29d04302515',
    testnet: true, derivation: { account: 0 }
  })
  console.log('WALLET FROM PRIVATE KEY: ', walletThree)
}

runtest()