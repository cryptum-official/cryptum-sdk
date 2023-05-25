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

const getInfo = async () => {
  console.log(
    'info',
    await sdk.nft.getInfo({
      protocol: 'CHILIZ',
      tokenAddress: '0x9f7296082dAf0615a48FEdA17Dddd2e6d0d5262F',
    })
  )
}
// getInfo()

const getMetadata = async () => {
  console.log(
    await sdk.nft.getMetadata({
      protocol: 'CHILIZ',
      tokenAddress: '0x9f7296082dAf0615a48FEdA17Dddd2e6d0d5262F',
      tokenId: 0,
    })
  )
}
// getMetadata()

const createNft = async () => {
  console.log(
    'get token info',
    await sdk.nft.create({
      protocol: 'CHILIZ',
      name: 'RENATA',
      symbol: 'RNT',
      wallet: wallet,
      type: 'ERC721',
    })
  )
}
// createNft()

const tranferNft = async () => {
  console.log(
    await sdk.nft.transfer({
      protocol: 'CHILIZ',
      token: '0x9f7296082dAf0615a48FEdA17Dddd2e6d0d5262F',
      wallet: wallet,
      amount: '1',
      destination: '0x672861244519573bf14c567F3E978E5DB8609ad1',
      tokenId: 0,
    })
  )
}
// tranferNft()

const mintNft = async () => {
  console.log(
    'mintNFT',
    await sdk.nft.mint({
      protocol: 'CHILIZ',
      destination: '0xfd1a88e2138ac4dc1c7edf59dbaddd599e7803bd',
      token: '0x9f7296082dAf0615a48FEdA17Dddd2e6d0d5262F',
      wallet: wallet,
      tokenId: 0,
    })
  )
}
// mintNft()

const burnNft = async () => {
  console.log(
    await sdk.nft.burn({
      protocol: 'CHILIZ',
      token: '0x9f7296082dAf0615a48FEdA17Dddd2e6d0d5262F',
      wallet: wallet,
      tokenId: 0,
      amount: '1'
    })
  )
}
// burnNft()

const approveNft = async () => {
  console.log(
    await sdk.nft.approve({
      protocol: 'CHILIZ',
      token: '0x9f7296082dAf0615a48FEdA17Dddd2e6d0d5262F',
      wallet: wallet,
      tokenId: 0,
    })
  )
}
// approveNft() arrumar

const setApprovalForAll = async () => {
  console.log(
    await sdk.nft.setApprovalForAll({
      protocol: 'CHILIZ',
      token: '0x9f7296082dAf0615a48FEdA17Dddd2e6d0d5262F',
      wallet: wallet,
      operator: '',
      isApproved: '',
    })
  )
}
// setApprovalForAll() arrumar
