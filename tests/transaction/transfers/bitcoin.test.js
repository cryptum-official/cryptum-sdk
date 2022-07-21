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

describe.only('Bitcoin transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .post(`/fee?protocol=${Protocol.BITCOIN}`, {
        type: TransactionType.TRANSFER,
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
          value: 2022623,
          txHash: '03fceba0863bbf2070fa2f03b20ece7ded5bf0992da2cd99948d950ff7971f94',
          index: 0,
          height: 2005940,
        },
      ])
      .persist()
    nock(baseUrl)
      .get(`/transaction/03fceba0863bbf2070fa2f03b20ece7ded5bf0992da2cd99948d950ff7971f94`)
      .query({
        protocol: Protocol.BITCOIN,
      })
      .reply(200, {
        blockhash: '0000000000242d0443cc5b1847547260dc9278a5ba6a83e73c892e6c70c459d3',
        vout: [{},{}],
        hex: '02000000000101f27eb920690ce3b0c3673c36873725b677447f09817045492faa4858d6a3d08d0100000000feffffff02dfdc1e00000000001976a9141c2187a8c42875b6256fc672d84924fbcc1b7a8d88ac5718370f0000000017a91426513f88c7013b174f970161736fa562ac77f7058702473044022008f35c495c5cd0c8953666afcf8968ba4787d0b2c985b8612bb079dc7a4286b402201b0a3009465c4b3dd598aaa9fa2a63e383cf50b44a3ea52a58ea72236a4eee3e01210224c8275f744ee80f25f230c865f242f413819e305e5c0e7cee04b5d6ceacdccd97fd1f00',
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
        { address: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo', amount: '0.01' },
        { address: wallets.bitcoin.address, amount: '0.01022223' },
      ],
    })
    assert.strictEqual(
      transaction.signedTx,
      '0200000001941f97f70f958d9499cda22d99f05bed7dce0eb2032ffa7020bf3b86a0ebfc03000000006b483045022100d095187170f6430ae7e831f9d8183d904c25944c74c136aed2e458ff6cbb1e1902203182de11b9bb37ba318a6087963f3567a783f203a4144617509cb774c5fe8a530121038706e8890e71cef61e2fa913a12791d315a51f1635a4746469f5cb74d9f327dcffffffff0240420f00000000001976a9144b57e83b4b50c8665be6beca8ca90762eb5f850f88ac0f990f00000000001976a9141c2187a8c42875b6256fc672d84924fbcc1b7a8d88ac00000000'
    )

    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer bitcoin from UTXOs (n-m transfer)', async () => {
    const transaction = await txController.createBitcoinTransferTransaction({
      inputs: [
        {
          txHash: '03fceba0863bbf2070fa2f03b20ece7ded5bf0992da2cd99948d950ff7971f94',
          index: 0,
          privateKey: wallets.bitcoin.privateKey,
        },
      ],
      outputs: [
        { address: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo', amount: '0.008' },
        { address: 'tb1qquzdatldegk8vpfquth9q5s7vzjhkggudtf0qj', amount: '0.002' },
        { address: wallets.bitcoin.address, amount: '0.01022223' },
      ],
    })
    assert.strictEqual(
      transaction.signedTx,
      '0200000001941f97f70f958d9499cda22d99f05bed7dce0eb2032ffa7020bf3b86a0ebfc03000000006b48304502210089b11f2c201aeb502ff65bc622eb125eb36c1b0c5fe06decd9cfe825102bb14c0220189ed612058484ecf7fde6fa948e6618dc2b241480429c772ea098af2383bc9c0121038706e8890e71cef61e2fa913a12791d315a51f1635a4746469f5cb74d9f327dcffffffff0300350c00000000001976a9144b57e83b4b50c8665be6beca8ca90762eb5f850f88ac400d0300000000001600140704deafedca2c760520e2ee50521e60a57b211c0f990f00000000001976a9141c2187a8c42875b6256fc672d84924fbcc1b7a8d88ac00000000'
    )

    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer bitcoin with error when wallet and inputs are provided', async () => {
    assert.isRejected(
      txController.createBitcoinTransferTransaction({
        wallet: wallets.bitcoin,
        inputs: [
          {
            txHash: '03fceba0863bbf2070fa2f03b20ece7ded5bf0992da2cd99948d950ff7971f94',
            index: 0,
            privateKey: wallets.bitcoin.privateKey,
          },
        ],
        outputs: [
          { address: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo', amount: '0.01' },
          { address: wallets.bitcoin.address, amount: '0.01' },
        ],
      }),
      'Parameters wallet and fromUTXOs can not be sent at the same time'
    )
  })
})
