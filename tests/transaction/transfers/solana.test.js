const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../axios')
const TransactionController = require('../../../src/features/transaction/controller')
const { Protocol, TRANSFER_METHOD_ABI } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const { TransactionType } = require('../../../src/features/transaction/entity')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
let wallets = {}

describe.only('Solana transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/block/latest`)
      .query({ protocol: Protocol.SOLANA })
      .reply(200, "EiaCnDbWndWJBTzPrdTvZ1RHEcsSk5UbGW8F624poefE")
      .persist()
    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.ETHEREUM}`, {
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
      .post(`/fee?protocol=${Protocol.ETHEREUM}`, {
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

  it('create SOL transfer', async () => {
    const transaction = await txController.createSolanaTransferTransaction({
      wallet: wallets.solana,
      token: 'SOL',
      amount: '0.01',
      destination: 'EiaCnDbWndWJBTzPrdTvZ1RHEcsSk5UbGW8F624poefE',
      testnet: true,
    })
    assert.ok(transaction.signedTx)
    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer token', async () => {
    const transaction = await txController.createSolanaTransferTransaction({
      wallet: wallets.solana,
      token: '7thXUk5oYYZGNFhRVm5B1P2THkymW1Ycq8rmChADdud1',
      amount: '1',
      destination: 'EiaCnDbWndWJBTzPrdTvZ1RHEcsSk5UbGW8F624poefE',
      testnet: true,
    })
    assert.ok(transaction.signedTx)
    // console.log(await txController.sendTransaction(transaction))
  })
})
