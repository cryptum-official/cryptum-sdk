const CryptumSDK = require('../index')
const sdk = new CryptumSDK({ apiKey: 'VBHtKsFN6DE7w9Yx8OMThdFIIFBjP9Df', environment: 'testnet' })

async function run() {
  const wallet = await sdk.wallet.generateWallet({
    protocol: 'CELO',
    mnemonic:
      'toast change range butter yard enact federal minor hidden draft horn battle arrange life wink chronic gym eagle online imitate unhappy water girl final',
  })

  const mintTx = await sdk.token.transfer({
    wallet,
    protocol: 'CELO',
    token: '0x26c2426De4f109acAd1012e600701F510968844E',
    amount: '1',
    destination: '0xD09cB824b21e25370CeB930C9dF7cc4E79Bb6E20',
  })
  console.log('mintx', mintTx)
}
run()
