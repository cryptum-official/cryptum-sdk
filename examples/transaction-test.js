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

const sendTransaction = async () => {
  console.log(await sdk.transaction.sendTransaction({
    protocol:'CHILIZ',
    signedTx:'0xe99703f1214daea47d144f9bc59e8b427b0de1dbdc7ab2e68af86b867db27a40',
    type:''
  }))
}
// sendTransaction() arrumar

const getTransactionByHash = async () => {
  console.log(
    await sdk.transaction.getTransactionByHash({
      hash: '0x5082300acf0f27a559a3eba0c5f3a88e625bcba86767ba66afa0967dc06b7ea4',
      protocol: 'CHILIZ',
    })
  )
}
// getTransactionByHash()

const getTransactionReceiptByHash = async () => {
  console.log(
    await sdk.transaction.getTransactionReceiptByHash({
      hash: '0x5082300acf0f27a559a3eba0c5f3a88e625bcba86767ba66afa0967dc06b7ea4',
      protocol: 'CHILIZ',
    })
  )
}
// getTransactionReceiptByHash()

const getProxyAddressByHash = async () => {
  console.log(
    await sdk.transaction.getProxyAddressByHash({
      hash: '',
      protocol: 'CHILIZ',
    })
  )
}
// getProxyAddressByHash() arrumar quando criar token

const getBlock = async () => {
  console.log(
    await sdk.transaction.getBlock({
      block: '1000',
      protocol: 'CHILIZ',
    })
  )
}
// getBlock()

const createChilizTransferTransaction = async () => {
  console.log(
    await sdk.transaction.createChilizTransferTransaction({
      amount: '1',
      protocol: 'CHILIZ',
      token: '0x840ff03C4D5881c6340B3B89FD1C83c7476eFc27',
      wallet: wallet,
      destination: '0x672861244519573bf14c567F3E978E5DB8609ad1',      
    })
  )
}
// createChilizTransferTransaction() arrumar contract address

const getFeeInfo = async () => {
  console.log(await sdk.transaction._getFeeInfo({
    amount:'1',
    protocol: 'CHILIZ',
    destination:'0x672861244519573bf14c567F3E978E5DB8609ad1',
    wallet: wallet
  }))
}
// getFeeInfo() arrumar wallet infra



