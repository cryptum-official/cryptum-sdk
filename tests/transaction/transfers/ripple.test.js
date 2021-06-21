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

describe('Ripple transfer transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.ripple.address}/info`)
      .query({ protocol: Protocol.RIPPLE })
      .reply(200, {
        account_data: { Sequence: 18377273 },
        ledger_current_index: 18448832,
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create transfer ripple', async () => {
    const transaction = await txController.createRippleTransferTransaction({
      wallet: wallets.ripple,
      assetSymbol: 'XRP',
      amount: '0.59',
      destination: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
      memo: 'create-transfer',
      testnet: true,
    })
    assert.strictEqual(
      transaction.signedTx,
      '12000022800000002401186A39201B011981CA6140000000000900B0684000000000000064732102C9A41967E29CF6B363D099128CF1F2F72E98589F96CDE7B767C735B5269A951074463044022077BEE41D9FBC039BEF4627FF1D6B6723918890BF285F48D28321AAAC96B75FBB0220471B7E9A22647B6380B8662A71B5ED35702BF7690AD3A1F3CD6AE8A7899CC5A3811402F4263E604CC4EDF5E76E95436E536B6B87D6868314F667B0CA50CC7709A220B0561B85E53A48461FA8F9EA7D0F6372656174652D7472616E736665727E0A746578742F706C61696EE1F1'
    )

    // console.log(await txController.sendTransaction(transaction))
  })
})
