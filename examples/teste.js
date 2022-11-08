const CryptumSdk = require('../index')
const apikey = "inaImMrDNlGiGTQsSy0APSB2J0IBqiw7"
const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: apikey,
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("oi")
  const protocol = 'POLYGON'
  const wallet = await sdk.wallet.generateWalletFromPrivateKey({
    privateKey: '0x8ca2092ebca2c154ba349173152a4b3f9f954a8331662f4efe284840bbb7cdda',
    protocol: 'POLYGON',
  })
  console.log(wallet.address)
  // const token1 = await sdk.token.create({
  //   protocol,
  //   wallet,
  //   name: 'token1',
  //   symbol: 't1',
  //   amount: '1000'
  // })
  // await sleep(12000)
  // const token1receipt = await sdk.transaction.getTransactionReceiptByHash({ hash: token1.hash, protocol });
  // console.log('token1: ', token1receipt.contractAddress)

  // const token2 = await sdk.token.create({
  //   protocol,
  //   wallet,
  //   name: 'token2',
  //   symbol: 't2',
  //   amount: '1000'
  // })
  // await sleep(12000)

  // const token2receipt = await sdk.transaction.getTransactionReceiptByHash({ hash: token2.hash, protocol });
  // console.log('token2: ', token2receipt.contractAddress)

  // const AtokenAddress = token1receipt.contractAddress
  // const BtokenAddress = token2receipt.contractAddress

  const AtokenAddress = "0xE3031a696aDE55789371CEA339d5fbCF2B6339f9"
  const BtokenAddress = "0xFf432f16F3d84eD1985EdFed30203F99d57Fe979"

  const tx = await sdk.uniswap.createPool({
    wallet,
    protocol,
    fee: 3000,
    tokenA: AtokenAddress,
    tokenB: BtokenAddress,
    priceNumerator: '1',
    priceDenominator: '2',
  })
  console.log('tx createpool', tx)
  await sleep(12000)
  const poolReceipt = await sdk.transaction.getTransactionReceiptByHash({ hash: tx.transaction.hash, protocol });
  console.log('poolReceipt', poolReceipt)
}

run()