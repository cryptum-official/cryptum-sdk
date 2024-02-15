const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../src/axios')
const { TransactionController } = require('../../../src/features/transaction/controller')
const { Protocol, TRANSFER_METHOD_ABI } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const { TransactionType } = require('../../../src/features/transaction/entity')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
let wallets = {}

describe.only('Stratus transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.stratus.address}/info`)
      .query({ protocol: Protocol.STRATUS })
      .reply(200, {
        nonce: '0',
      })
      .persist()
    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.STRATUS}`, {
        type: TransactionType.TRANSFER,
        from: '0xcf61eaf64d895c3c71a8812e9eedc4c179b4ed60',
        destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
        amount: '0.01'
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 4,
      })
      .persist()
    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.STRATUS}`, {
        type: TransactionType.CALL_CONTRACT_METHOD,
        from: '0xcf61eaf64d895c3c71a8812e9eedc4c179b4ed60',
        destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
        contractAddress: '0xcf1caf3f6aa5e5206b2d50dd1206a7cc3c76dc10',
        contractAbi: TRANSFER_METHOD_ABI,
        method: 'transfer',
        params: ['0x3f2f3D45196D7B99D0a615e8f530165eCb93e772', '10000000000000000'],
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 4,
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create transfer cwn', async () => {
    const transaction = await txController.createStratusTransferTransaction({
      wallet: wallets.stratus,
      tokenSymbol: 'CWN',
      amount: '0.01',
      destination: '0x59dACD2E1Dbbb5897eF0982f830BA17845874d45',
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
  
  it('create transfer token', async () => {
    const transaction = await txController.createStratusTransferTransaction({
      wallet: wallets.stratus,
      tokenSymbol: 'MTK',
      amount: '0.01',
      destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
      contractAddress: '0xcf1caf3f6aa5e5206b2d50dd1206a7cc3c76dc10',
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
})
