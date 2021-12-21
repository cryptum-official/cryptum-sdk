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
