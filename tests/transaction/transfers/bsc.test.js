const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../axios')
const TransactionController = require('../../../src/features/transaction/controller')
const { Protocol } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const { TransactionType } = require('../../../src/features/transaction/entity')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
let wallets = {}

describe.only('Bsc transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.bsc.address}/info`)
      .query({ protocol: Protocol.BSC })
      .reply(200, {
        nonce: '1',
      })
      .persist()
    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.BSC}`, {
        type: TransactionType.TRANSFER,
        from: '0x481B542b7419D8Ba305B5cc5029C12d5a68B4f69',
        destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
        amount: '0.01'
      })
      .reply(200, {
        gas: 2100,
        gasPrice: '4000000',
        chainId: 97,
      })
      .persist()
      .post(`/fee?protocol=${Protocol.BSC}`, {
        type: TransactionType.CALL_CONTRACT_METHOD,
        from: '0x481B542b7419D8Ba305B5cc5029C12d5a68B4f69',
        destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
        contractAddress: '0xfd78c660ee04357526c62e427cc2c3ff22fe5bdc',
        method: 'transfer',
        params: ['0x3f2f3D45196D7B99D0a615e8f530165eCb93e772', '10000000000000000'],
      })
      .reply(200, {
        gas: 2100,
        gasPrice: '4000000',
        chainId: 97,
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create transfer bsc', async () => {
    const transaction = await txController.createBscTransferTransaction({
      wallet: wallets.bsc,
      tokenSymbol: 'BNB',
      amount: '0.01',
      destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')

    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer token', async () => {
    const transaction = await txController.createBscTransferTransaction({
      wallet: wallets.bsc,
      tokenSymbol: 'MTK',
      amount: '0.01',
      destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
      contractAddress: '0xfd78c660ee04357526c62e427cc2c3ff22fe5bdc',
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')

    // console.log(await txController.sendTransaction(transaction))
  })
})
