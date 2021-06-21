const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../axios')
const TransactionController = require('../../../src/features/transaction/controller')
const { Protocol } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.enviroment)
let wallets = {}

describe.skip('Bitcoin transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/fee`)
      .query({
        from: wallets.bitcoin.address,
        destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
        amount: '0.11',
        type: 'transfer',
        assetSymbol: 'BTC',
        protocol: Protocol.BITCOIN,
      })
      .reply(200, {
        gas: 2100,
        gasPrice: '4000000',
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create transfer bitcoin', async () => {
    const transaction = await txController.createBscTransferTransaction({
      wallet: wallets.bitcoin,
      tokenSymbol: 'BTC',
      amount: '0.01',
      destination: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo',
      testnet: true,
    })
    assert.strictEqual(transaction.signedTx, '')
    console.log(transaction)

    // console.log(await txController.sendTransaction(transaction))
  })
})
