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

describe('Bitcoin transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/fee`)
      .query({
        type: 'transfer',
        protocol: Protocol.BITCOIN,
      })
      .reply(200, {
        estimateValue: '80',
        unit: 'satoshi',
      }).persist()
    nock(baseUrl)
      .get(`/transaction/utxo/${wallets.bitcoin.address}`)
      .query({
        protocol: Protocol.BITCOIN,
      })
      .reply(200, [
        {
          height: 2005829,
          value: 50000000,
          txHash: 'fe5b5b9b297b50d42fe55cd6a4e1527d6d7ef95ef81a5166d414889bba22f647',
          index: 1,
        },
      ])
    nock(baseUrl)
      .get(`/transaction/fe5b5b9b297b50d42fe55cd6a4e1527d6d7ef95ef81a5166d414889bba22f647`)
      .query({
        protocol: Protocol.BITCOIN,
      })
      .reply(200, {
        hex: '020000000001015b60014e7d73eeb5e7ed9977ef98600ba429748018bd969796c93a2d37148fec0500000000fdffffff02cc906201000000001600140ea3efe9f89fa66e8d819d3e81ab546cb3bfdc7980f0fa02000000001976a914dfe789a916cf07bfe348bfd4e418c39aecc2bfae88ac0247304402207393c208f40d981a9fc86c5a28203a295a03f071f410dba917e545e92ec0e8e202205e8605c47ba0af9883d920930db64481d3e90fa6355e9b1586b6629d451ccd5a0121032d51a24c476616490c28ad6019bf0133b1757451857ae5f87586ec696729ed3a3f9b1e00',
      }).persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create transfer bitcoin with wallet', async () => {
    const transaction = await txController.createBitcoinTransferTransaction({
      wallet: wallets.bitcoin,
      outputs: [
        { address: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo', value: 5000000 },
        { address: wallets.bitcoin.address, value: 44999900 },
      ],
      testnet: true,
    })
    assert.strictEqual(transaction.signedTx, '020000000147f622ba9b8814d466511af85ef97e6d7d52e1a4d65ce52fd4507b299b5b5bfe010000006b4830450221008e676bd991a105d6b4159dc2e8447484f69287990e6f617596205709fbe1593b0220619843469a4e5385a8313eb0138ffbd1082a0d39db0db286e94dcf37b7caa08a01210292f8705e8f86de81b4f3291c1ee05ee6549146bed01d76576ece5c36545a4cfbffffffff02404b4c00000000001976a9144b57e83b4b50c8665be6beca8ca90762eb5f850f88acdca4ae02000000001976a914dfe789a916cf07bfe348bfd4e418c39aecc2bfae88ac00000000')

    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer bitcoin from UTXO', async () => {
    const transaction = await txController.createBitcoinTransferTransaction({
      fromUTXOs: [
        {
          height: 2005829,
          value: 50000000,
          txHash: 'fe5b5b9b297b50d42fe55cd6a4e1527d6d7ef95ef81a5166d414889bba22f647',
          index: 1,
        },
      ],
      fromPrivateKeys: [wallets.bitcoin.privateKey],
      outputs: [
        { address: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo', value: 5000000 },
        { address: wallets.bitcoin.address, value: 44999900 },
      ],
      testnet: true,
    })
    assert.strictEqual(transaction.signedTx, '020000000147f622ba9b8814d466511af85ef97e6d7d52e1a4d65ce52fd4507b299b5b5bfe010000006b4830450221008e676bd991a105d6b4159dc2e8447484f69287990e6f617596205709fbe1593b0220619843469a4e5385a8313eb0138ffbd1082a0d39db0db286e94dcf37b7caa08a01210292f8705e8f86de81b4f3291c1ee05ee6549146bed01d76576ece5c36545a4cfbffffffff02404b4c00000000001976a9144b57e83b4b50c8665be6beca8ca90762eb5f850f88acdca4ae02000000001976a914dfe789a916cf07bfe348bfd4e418c39aecc2bfae88ac00000000')

    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer bitcoin with error when wallet and UTXO are provided', async () => {
    assert.isRejected(
      txController.createBitcoinTransferTransaction({
        wallet: wallets.bitcoin,
        fromUTXOs: [
          {
            height: 2005829,
            value: 50000000,
            txHash: 'fe5b5b9b297b50d42fe55cd6a4e1527d6d7ef95ef81a5166d414889bba22f647',
            index: 1,
          },
        ],
        fromPrivateKeys: [wallets.bitcoin.privateKey],
        outputs: [
          { address: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo', value: 5000000 },
          { address: wallets.bitcoin.address, value: 44999900 },
        ],
        testnet: true,
      }),
      'Parameters wallet and fromUTXOs can not be sent at the same time'
    )
  })
})
