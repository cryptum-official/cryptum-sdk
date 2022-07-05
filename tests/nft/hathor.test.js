const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../src/axios')
const NftController = require('../../src/features/nft/controller')
const { Protocol } = require('../../src/services/blockchain/constants')
const { config } = require('../wallet/constants')
const nftController = new NftController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)

describe.only('Hathor blockchain info', () => {
  before(async () => {
    nock(baseUrl)
      .get(`/nft/000024f0ad325bd5ae8bd8710d2341d1df5ed9b97e2afaf559534ae77d160edd/info`)
      .query({
        protocol: Protocol.HATHOR,
      })
      .reply(200, {
        name: 'Shapes',
        symbol: 'SHAPS',
        tokenUid: '000024f0ad325bd5ae8bd8710d2341d1df5ed9b97e2afaf559534ae77d160edd',
        totalSupply: '1',
        nftData: 'ipfs://Qmex96KX4evfWD5AhuKLcgocyjtsYsKt66rkGNgCRijynB'
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('get token info', async () => {
    const res = await nftController.getInfo({
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
})