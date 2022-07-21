const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../src/axios')
const { TransactionController } = require('../../../src/features/transaction/controller')
const { Protocol } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const { TransactionType } = require('../../../src/features/transaction/entity')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
let wallets = {}

describe.only('Stellar transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.stellar.publicKey}/info`)
      .query({ protocol: Protocol.STELLAR })
      .reply(200, {
        sequence: '40072044871681',
      })
      .persist()
      nock(baseUrl)
      .post(`/fee?protocol=${Protocol.STELLAR}`, { type: TransactionType.TRANSFER })
      .reply(200, {
        estimateValue: '100',
        unit: 'stroop'
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create transfer stellar', async () => {
    const transaction = await txController.createStellarTransferTransaction({
      wallet: wallets.stellar,
      assetSymbol: 'XLM',
      amount: '1',
      destination: 'GDLCRMXZ66NFDIALVOJCIEOYJTITVNUFVYWT7MK26NO2GJXIBHTVGUIO',
      memo: 'create-transfer',
    })
    assert.include(
      transaction.signedTx,
      'AAAAAgAAAAAFqv2GZM3flypMrxlnhEDXqISoxW'
    )

    // console.log(await txController.sendTransaction(transaction))
  })
})
