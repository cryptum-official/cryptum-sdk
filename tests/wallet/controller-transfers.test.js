const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../axios')
const WalletController = require('../../src/features/wallet/controller')
const { Protocol } = require('../../src/services/blockchain')
const { getWallets, config } = require('./constants')

const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.enviroment)
let wallets = {}

describe.only('Test Suite of the Wallet (Controller)', () => {
  before(async () => {
    wallets = await getWallets()
  })
  describe('transfer transactions', () => {
    it(' - create transfer stellar', async () => {
      nock(baseUrl)
        .get(
          `/wallet/${wallets.stellar.publicKey}/info?protocol=${Protocol.STELLAR}`
        )
        .reply(200, {
          sequence: '40072044871681',
        })
      const controller = new WalletController(config)

      const transaction = await controller.createTransferTransaction({
        wallet: wallets.stellar,
        assetSymbol: 'XLM',
        amount: '1',
        destination: 'GDLCRMXZ66NFDIALVOJCIEOYJTITVNUFVYWT7MK26NO2GJXIBHTVGUIO',
        memo: 'create-transfer',
        protocol: Protocol.STELLAR,
      })
      assert.include(transaction, 'AAAAAgAAAAAFqv2GZM3flypMrxlnhEDXqISoxW')
    })
    it(' - create transfer ripple', async () => {
      nock(baseUrl)
        .get(
          `/wallet/${wallets.ripple.address}/info?protocol=${Protocol.RIPPLE}`
        )
        .reply(200, {
          account_data: { Sequence: 18377273 },
          ledger_current_index: 18448832,
        })
      const controller = new WalletController(config)

      const transaction = await controller.createTransferTransaction({
        wallet: wallets.ripple,
        assetSymbol: 'XRP',
        amount: '0.59',
        destination: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
        memo: 'create-transfer',
        protocol: Protocol.RIPPLE,
      })
      assert.strictEqual(
        transaction,
        '12000022800000002401186A39201B011981CA6140000000000900B0684000000000000064732102C9A41967E29CF6B363D099128CF1F2F72E98589F96CDE7B767C735B5269A951074463044022077BEE41D9FBC039BEF4627FF1D6B6723918890BF285F48D28321AAAC96B75FBB0220471B7E9A22647B6380B8662A71B5ED35702BF7690AD3A1F3CD6AE8A7899CC5A3811402F4263E604CC4EDF5E76E95436E536B6B87D6868314F667B0CA50CC7709A220B0561B85E53A48461FA8F9EA7D0F6372656174652D7472616E736665727E0A746578742F706C61696EE1F1'
      )
    })
  })
})
