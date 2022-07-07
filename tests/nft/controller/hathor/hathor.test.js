const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const { getNftControllerInstance } = require('../../../../src/features/nft/controller')
const { config, getWallets } = require('../../../wallet/constants')
const { loadNockMocks } = require('./mocks')
const nft = getNftControllerInstance(config)

describe.only('Hathor NFTs', () => {
  let wallets
  before(async () => {
    wallets = await getWallets()
    loadNockMocks(nock, wallets)
  })
  after(() => {
    nock.isDone()
  })

  it('get info', async () => {
    const res = await nft.getInfo({
      protocol: 'HATHOR',
      tokenUid: '000024f0ad325bd5ae8bd8710d2341d1df5ed9b97e2afaf559534ae77d160edd'
    })
    assert.deepEqual(res, {
      name: 'Shapes',
      symbol: 'SHAPS',
      tokenUid: '000024f0ad325bd5ae8bd8710d2341d1df5ed9b97e2afaf559534ae77d160edd',
      totalSupply: '1',
      nftData: 'ipfs://Qmex96KX4evfWD5AhuKLcgocyjtsYsKt66rkGNgCRijynB'
    })
  })
  it('get balance', async () => {
    const res = await nft.getBalance({
      protocol: 'HATHOR',
      tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
      address: 'WbrQizEXgaXu9y6VCb5fpSzhyf28U4UZFK'
    })
    assert.deepEqual(res, {
      tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
      owner: 'WbrQizEXgaXu9y6VCb5fpSzhyf28U4UZFK',
      balance: '3'
    })
  })
  it('get metadata', async () => {
    const res = await nft.getMetadata({
      protocol: 'HATHOR',
      tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
    })
    assert.deepEqual(res, {
      tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
      uri: 'ipfs://Qmex96KX4evfWD5AhuKLcgocyjtsYsKt66rkGNgCRijynB',
      metadata: {}
    })
  })
  it('transfer', async () => {
    const res = await nft.transfer({
      protocol: 'HATHOR',
      wallet: wallets.hathor,
      token: '00000df210d1eeca2c5eb412118f775b2138000cf64198cfb7b219690d62a82a',
      destination: 'WXK74dFXd6Ctj6EUBH3ctpWwoVR2TnHCjV',
      amount: '1'
    })
    assert.include(res.hash, '000101010200000')
  })
  it('mint', async () => {
    const res = await nft.getMetadata({
      protocol: 'HATHOR',
      tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
    })
    assert.deepEqual(res, {
      tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
      uri: 'ipfs://Qmex96KX4evfWD5AhuKLcgocyjtsYsKt66rkGNgCRijynB',
      metadata: {}
    })
  })
  it('burn', async () => {
    const res = await nft.getMetadata({
      protocol: 'HATHOR',
      tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
    })
    assert.deepEqual(res, {
      tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
      uri: 'ipfs://Qmex96KX4evfWD5AhuKLcgocyjtsYsKt66rkGNgCRijynB',
      metadata: {}
    })
  })
})
