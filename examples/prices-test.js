const CryptumSdk = require('../index')

const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: '0x',
})

const getPrices = async () => {
  console.log(await sdk.prices.getPrices({
    asset:'CHILIZ'
  }))
}
// getPrices()