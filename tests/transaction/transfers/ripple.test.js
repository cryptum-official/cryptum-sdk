const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../src/axios')
const TransactionController = require('../../../src/features/transaction/controller')
const { Protocol } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const { TransactionType } = require('../../../src/features/transaction/entity')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
let wallets = {}

describe.only('Ripple transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.ripple.address}/info`)
      .query({ protocol: Protocol.RIPPLE })
      .reply(200, {
        sequence: 18377273,
        ledgerCurrentIndex: 18448832,
      })
      .persist()
    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.RIPPLE}`, { type: TransactionType.TRANSFER })
      .reply(200, {
        estimateValue: '10',
        unit: 'drop'
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create transfer ripple', async () => {
    const transaction = await txController.createRippleTransferTransaction({
      wallet: wallets.ripple,
      assetSymbol: 'XRP',
      amount: '0.59',
      destination: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
      memo: 'create-transfer',
      testnet: true,
    })
    assert.include(
      transaction.signedTx,
      '1200002280000000'
    )

    // console.log(await txController.sendTransaction(transaction))
  })
})
