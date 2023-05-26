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

const getTransactionByHash = async () => {
  console.log(
    '------getTransactionByHash------: ',
    await sdk.transaction.getTransactionByHash({
      hash: '0xdd1defa2acb0b58beb40ba864b24e80d42b5ee1ea2fab6bb83712da393656ea9',
      protocol: 'CHILIZ',
    })
  )
}

const getTransactionReceiptByHash = async () => {
  console.log(
    '------getTransactionReceiptByHash------: ',
    await sdk.transaction.getTransactionReceiptByHash({
      hash: '0x85c6a88cdaa399126a1e8f1bb94a229d52edf46e00e93842cd12870787de6058',
      protocol: 'CHILIZ',
    })
  )
}

const getProxyAddressByHash = async () => {
  console.log(
    '------getProxyAddressByHash------: ',
    await sdk.transaction.getProxyAddressByHash({
      protocol: 'CHILIZ',
      hash: '0x8c278b7f3d1d950778885410efd647f7b487138ad538ab7c5ef5ed1122f13c76',
    })
  )
}

const getBlock = async () => {
  console.log(
    '------getblock------: ',
    await sdk.transaction.getBlock({
      block: '3848407',
      protocol: 'CHILIZ',
    })
  )
}

const createChilizTransferTransaction = async () => {
  console.log(
    '------createChilizTransferTransaction------: ',
    await sdk.transaction.createChilizTransferTransaction({
      wallet: wallet,
      protocol: 'CHILIZ',
      contractAddress: '0xc070Bcd22e88615d4092c70BEF104d80a4c213aC',
      amount: '1',
      destination: '0x672861244519573bf14c567F3E978E5DB8609ad1',
    })
  )
}

const getFee = async () => {
  console.log(
    '------getFee------: ',
    await sdk.transaction.getFee({
      protocol: 'CHILIZ',
      wallet: wallet,
      amount: '1',
      destination: '0xfd1a88e2138ac4dc1c7edf59dbaddd599e7803bd',
      type: 'TRANSFER',
    })
  )
}

async function run() {
  await getTransactionByHash()
  await getTransactionReceiptByHash()
  //await getProxyAddressByHash() arrumar (Invalid hash) testar depois de lootbox
  await getBlock()
  await createChilizTransferTransaction()
  await getFee()
}
run()
