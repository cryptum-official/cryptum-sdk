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

describe.only('Bitcoin transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.BITCOIN}`, {
        type: 'transfer',
      })
      .reply(200, {
        estimateValue: '80',
        unit: 'satoshi',
      })
      .persist()
    nock(baseUrl)
      .get(`/transaction/utxo/${wallets.bitcoin.address}`)
      .query({
        protocol: Protocol.BITCOIN,
      })
      .reply(200, [
        {
          height: 2005980,
          value: 1396115,
          txHash: 'addecbe2b0f58993678cbfec881b9aab62d6a5c7dee3bcc6acf6ef840f3f8e8a',
          index: 1,
        },
        {
          height: 2005940,
          value: 44999600,
          txHash: 'd28c5a7ea19f1187d8d1144d0ea1976e821fb0337e03d817a53b7f93b6599081',
          index: 2,
        },
      ])
      .persist()
    nock(baseUrl)
      .get(`/transaction/addecbe2b0f58993678cbfec881b9aab62d6a5c7dee3bcc6acf6ef840f3f8e8a`)
      .query({
        protocol: Protocol.BITCOIN,
      })
      .reply(200, {
        hex: '02000000000101fc83dfaddaca076257d529fb4b5ebd06a78cddb1350ff809d6465d9768156b47000000001716001465a4323e641c60b1f53d0a7923949bcb30d292d0feffffff020ac6d10f0200000017a9140da4ba2552f8bc81ac99e2bf1669738dcca0c97f87934d1500000000001976a914dfe789a916cf07bfe348bfd4e418c39aecc2bfae88ac02473044022050fbdd68e4087d9409d77175d697edc9ebd910e0c5f6b0ce2db5660984baaba302201453bede2d6328a84b1a6fb46ba088f3f54878cccd475fe7121b50ee5b4b5a80012102f6c5c880bf768b459d72f15b662f1bc51c58d15a2af810686ad2d4f0046efd0cdb9b1e00',
      })
      .persist()
    nock(baseUrl)
      .get(`/transaction/d28c5a7ea19f1187d8d1144d0ea1976e821fb0337e03d817a53b7f93b6599081`)
      .query({
        protocol: Protocol.BITCOIN,
      })
      .reply(200, {
        hex: '020000000147f622ba9b8814d466511af85ef97e6d7d52e1a4d65ce52fd4507b299b5b5bfe010000006a47304402207b903fbb2c965ee03c0736d82be37e83549cbe0041f78ec83e23dd2d6c5ad736022033031c089a671e78ee4480be9fe2a36f521aba5829ef72bbba7d9bcac7c21b0f01210292f8705e8f86de81b4f3291c1ee05ee6549146bed01d76576ece5c36545a4cfbffffffff0300093d00000000001976a9144b57e83b4b50c8665be6beca8ca90762eb5f850f88ac40420f00000000001600140704deafedca2c760520e2ee50521e60a57b211cb0a3ae02000000001976a914dfe789a916cf07bfe348bfd4e418c39aecc2bfae88ac00000000',
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create transfer bitcoin with wallet (1-n transfer)', async () => {
    const transaction = await txController.createBitcoinTransferTransaction({
      wallet: wallets.bitcoin,
      outputs: [
        { address: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo', amount: '0.01395' },
        { address: wallets.bitcoin.address, amount: '0.45' },
      ],
      testnet: true,
    })
    assert.strictEqual(
      transaction.signedTx,
      '02000000028a8e3f0f84eff6acc6bce3dec7a5d662ab9a1b88ecbf8c679389f5b0e2cbdead010000006b483045022100cb37cf1290997ac6d8a83e86b65cbefa4cfcea2def1e79669a1d01be2f49182002205f3c2f391f93e8a3d49d78df55581ed39c357d28c88821745da52ff8ed550f0d01210292f8705e8f86de81b4f3291c1ee05ee6549146bed01d76576ece5c36545a4cfbffffffff819059b6937f3ba517d8037e33b01f826e97a10e4d14d1d887119fa17e5a8cd2020000006a473044022054726cf04e87dafc7f707cd284893f7a9d08b91b67a1d6198be36eedb894853302203b9d40faa822fdb866b3ac11d261b1b6380311ae7bb8351038cc2f477bd7b94501210292f8705e8f86de81b4f3291c1ee05ee6549146bed01d76576ece5c36545a4cfbffffffff0238491500000000001976a9144b57e83b4b50c8665be6beca8ca90762eb5f850f88ac40a5ae02000000001976a914dfe789a916cf07bfe348bfd4e418c39aecc2bfae88ac00000000'
    )

    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer bitcoin from UTXO (n-m transfer)', async () => {
    const transaction = await txController.createBitcoinTransferTransaction({
      fromUTXOs: [
        {
          height: 2005940,
          value: 44999600,
          txHash: 'd28c5a7ea19f1187d8d1144d0ea1976e821fb0337e03d817a53b7f93b6599081',
          index: 2,
        },
      ],
      fromPrivateKeys: [wallets.bitcoin.privateKey],
      outputs: [
        { address: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo', amount: '0.0219' },
        { address: 'tb1qquzdatldegk8vpfquth9q5s7vzjhkggudtf0qj', amount: '0.02809' },
        { address: wallets.bitcoin.address, amount: '0.4' },
      ],
      testnet: true,
    })
    assert.strictEqual(
      transaction.signedTx,
      '0200000001819059b6937f3ba517d8037e33b01f826e97a10e4d14d1d887119fa17e5a8cd2020000006a473044022078f76f2aea0398780b43a7d3441496564f2b452e9c798dcd482246797b85c76e02205ce03390ad158d382f1061af3120e4546f59d208a0860c0ff5a9abec4194e5e301210292f8705e8f86de81b4f3291c1ee05ee6549146bed01d76576ece5c36545a4cfbffffffff03b06a2100000000001976a9144b57e83b4b50c8665be6beca8ca90762eb5f850f88aca8dc2a00000000001600140704deafedca2c760520e2ee50521e60a57b211c005a6202000000001976a914dfe789a916cf07bfe348bfd4e418c39aecc2bfae88ac00000000'
    )

    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer bitcoin with error when wallet and UTXO are provided', async () => {
    assert.isRejected(
      txController.createBitcoinTransferTransaction({
        wallet: wallets.bitcoin,
        fromUTXOs: [
          {
            height: 2005940,
            value: 44999600,
            txHash: 'd28c5a7ea19f1187d8d1144d0ea1976e821fb0337e03d817a53b7f93b6599081',
            index: 2,
          },
        ],
        fromPrivateKeys: [wallets.bitcoin.privateKey],
        outputs: [
          { address: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo', amount: '0.03' },
          { address: wallets.bitcoin.address, amount: '0.4' },
        ],
        testnet: true,
      }),
      'Parameters wallet and fromUTXOs can not be sent at the same time'
    )
  })
})
