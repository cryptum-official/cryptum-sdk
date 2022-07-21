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

describe.only('AvaxCChain transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.avaxcchain.address}/info`)
      .query({ protocol: Protocol.AVAXCCHAIN })
      .reply(200, {
        nonce: '0',
      })
      .persist()
    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.AVAXCCHAIN}`, {
        type: TransactionType.TRANSFER,
        from: '0xcf61eaf64d895c3c71a8812e9eedc4c179b4ed60',
        destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
        amount: '0.01'
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 43113,
      })
      .persist()
    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.AVAXCCHAIN}`, {
        type: TransactionType.CALL_CONTRACT_METHOD,
        from: '0xcf61eaf64d895c3c71a8812e9eedc4c179b4ed60',
        destination: '0x363E5EDEa24fd362d300912FE6BAd02BF44c1C27',
        contractAddress: '0x0E362943Fb47FEEd9d3E2803F03B8637eB5b9b95',
        contractAbi: TRANSFER_METHOD_ABI,
        method: 'transfer',
        params: ['0x363E5EDEa24fd362d300912FE6BAd02BF44c1C27', '1000000000000000000'],
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 43113,
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create transfer AvaxCChain', async () => {
    const transaction = await txController.createAvaxCChainTransferTransaction({
      wallet: wallets.avaxcchain,
      tokenSymbol: 'AVAX',
      amount: '0.01',
      destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer token', async () => {
    const transaction = await txController.createAvaxCChainTransferTransaction({
      wallet: wallets.avaxcchain,
      tokenSymbol: 'EDC',
      amount: '1',
      destination: '0x363E5EDEa24fd362d300912FE6BAd02BF44c1C27',
      contractAddress: '0x0E362943Fb47FEEd9d3E2803F03B8637eB5b9b95',
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
})
