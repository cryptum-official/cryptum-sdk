const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../src/axios')
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
      .reply(200, { blockhash: "81TrpK1pEc5DWwXGyYs7Ff2DM323cXbBoAQS5kEPRzQC" })
      .persist()
    nock('https://api.devnet.solana.com')
      .matchHeader('content-type', 'application/json')
      .post('/')
      .reply(200, {
        id: "5f3790a5-ea32-4ca4-90a4-7a9a680aad2b", jsonrpc: '2.0', result: {
          context: { slot: 123487884 }, value: {
            data: Buffer.from([]),
            executable: true, owner: 'AsW7LnXB9UA1uec9wi9MctYTgTz7YH9snhxd16GsFaGX', lamports: 1725745920
          }
        }
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
  // it('create transfer token', async () => {
  //   const transaction = await txController.createSolanaTransferTransaction({
  //     wallet: wallets.solana,
  //     token: '7thXUk5oYYZGNFhRVm5B1P2THkymW1Ycq8rmChADdud1',
  //     amount: '1',
  //     destination: 'EiaCnDbWndWJBTzPrdTvZ1RHEcsSk5UbGW8F624poefE',
  //     testnet: true,
  //   })
  //   assert.ok(transaction.signedTx)
  //   // console.log(await txController.sendTransaction(transaction))
  // })
})
