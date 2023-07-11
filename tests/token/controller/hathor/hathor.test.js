
describe('Hathor Tokens', () => {
  const nock = require('nock')
  const chai = require('chai')
  chai.use(require('chai-as-promised'))
  const assert = chai.assert
  const { getTokenControllerInstance } = require('../../../../src/features/token/controller')
  const { config, getWallets } = require('../../../wallet/constants')
  const { loadNockMocks } = require('./mocks')
  const token = getTokenControllerInstance(config)
  let wallets

  before(async () => {
    wallets = await getWallets()
    loadNockMocks(nock, wallets)
  })
  after(() => {
    nock.isDone()
  })

  it('get info', async () => {
    const res = await token.getInfo({
      protocol: 'HATHOR',
      tokenUid: '000024f0ad325bd5ae8bd8710d2341d1df5ed9b97e2afaf559534ae77d160edd'
    })
    assert.deepEqual(res, {
      name: 'Token',
      symbol: 'TOK',
      tokenUid: '000024f0ad325bd5ae8bd8710d2341d1df5ed9b97e2afaf559534ae77d160edd',
      totalSupply: '1'
    })
  })
  it('get balance', async () => {
    const res = await token.getBalance({
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
  it('transfer', async () => {
    const res = await token.transfer({
      protocol: 'HATHOR',
      wallet: wallets.hathor,
      token: '00000df210d1eeca2c5eb412118f775b2138000cf64198cfb7b219690d62a82a',
      destination: 'WXK74dFXd6Ctj6EUBH3ctpWwoVR2TnHCjV',
      amount: '1'
    })
    assert.include(res.hash, '000101010200000')
  })
  // it('mint', async () => {
  //   const res = await token.mint({
  //     protocol: 'HATHOR',
  //     wallet: wallets.hathor,
  //     token: '00000df210d1eeca2c5eb412118f775b2138000cf64198cfb7b219690d62a82a',
  //     amount: '90',
  //     destination: 'WXK74dFXd6Ctj6EUBH3ctpWwoVR2TnHCjV'
  //   })
  //   assert.deepEqual(res, {
  //     tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
  //     uri: 'ipfs://Qmex96KX4evfWD5AhuKLcgocyjtsYsKt66rkGNgCRijynB',
  //     metadata: {}
  //   })
  // })
  // it('burn', async () => {
  //   const res = await token.burn({
  //     protocol: 'HATHOR',
  //     wallet: wallets.hathor,
  //     token: '00000df210d1eeca2c5eb412118f775b2138000cf64198cfb7b219690d62a82a',
  //     amount: '90',
  //     destination: 'WXK74dFXd6Ctj6EUBH3ctpWwoVR2TnHCjV'
  //   })
  //   assert.deepEqual(res, {
  //     tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
  //     uri: 'ipfs://Qmex96KX4evfWD5AhuKLcgocyjtsYsKt66rkGNgCRijynB',
  //     metadata: {}
  //   })
  // })
})
