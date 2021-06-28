const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../axios')
const TransactionController = require('../../../src/features/transaction/controller')
const { Protocol, CUSD_CONTRACT_ADDRESS, TRANSFER_METHOD_ABI } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const { TransactionType } = require('../../../src/features/transaction/entity')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
let wallets = {}

describe.only('Celo transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.celo.address}/info`)
      .query({ protocol: Protocol.CELO })
      .reply(200, {
        nonce: '2',
      })
      .persist()
    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.CELO}`, {
        type: TransactionType.TRANSFER,
        from: '0x8C33DB44a78629cF60C88383d436EEc356884625',
        destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
        amount: '0.1',
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 44787,
      })
      .persist()
    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.CELO}`, {
        type: TransactionType.CALL_CONTRACT_METHOD,
        from: '0x8C33DB44a78629cF60C88383d436EEc356884625',
        destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
        contractAddress: CUSD_CONTRACT_ADDRESS.testnet,
        contractAbi: TRANSFER_METHOD_ABI,
        method: 'transfer',
        params: ['0x3f2f3D45196D7B99D0a615e8f530165eCb93e772', '10000000000000000'],
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 44787,
      })
      .persist()
    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.CELO}`, {
        type: TransactionType.CALL_CONTRACT_METHOD,
        from: '0x8C33DB44a78629cF60C88383d436EEc356884625',
        destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
        contractAddress: '0x07274039422F722076863ADa0b4dB77ad6c163dc',
        contractAbi: TRANSFER_METHOD_ABI,
        method: 'transfer',
        params: ['0x3f2f3D45196D7B99D0a615e8f530165eCb93e772', '10000000000000000'],
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 44787,
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create transfer celo', async () => {
    const transaction = await txController.createCeloTransferTransaction({
      wallet: wallets.celo,
      tokenSymbol: 'CELO',
      amount: '0.1',
      destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer celo and pay fee with cusd', async () => {
    const transaction = await txController.createCeloTransferTransaction({
      wallet: wallets.celo,
      tokenSymbol: 'cUSD',
      amount: '0.01',
      destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
      feeCurrency: 'cUSD',
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer token', async () => {
    const transaction = await txController.createCeloTransferTransaction({
      wallet: wallets.celo,
      tokenSymbol: 'MTK',
      amount: '0.01',
      destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
      contractAddress: '0x07274039422F722076863ADa0b4dB77ad6c163dc',
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
})
