const CryptumSdk = require('../index')

const sdk = new CryptumSdk({
  environment: 'development',
  apiKey: '0x',
})

// const sendTransaction = async () => {
//   console.log(await sdk.transaction.sendTransaction({
//     protocol:'CHILIZ',
//     signedTx:'0xe99703f1214daea47d144f9bc59e8b427b0de1dbdc7ab2e68af86b867db27a40',
//     type:

//   }))
// }
// sendTransaction()

const getTransactionByHash = async () => {
  console.log(
    await sdk.transaction.getTransactionByHash({
      hash: '0x5082300acf0f27a559a3eba0c5f3a88e625bcba86767ba66afa0967dc06b7ea4',
      protocol: 'CHILIZ',
    })
  )
}
getTransactionByHash()