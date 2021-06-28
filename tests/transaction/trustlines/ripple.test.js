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

describe.only('Ripple trustline transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.ripple.address}/info`)
      .query({ protocol: Protocol.RIPPLE })
      .reply(200, {
        sequence: 6259566,
        ledgerCurrentIndex: 1,
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create trustline ripple', async () => {
    const transaction = await txController.createRippleTrustlineTransaction({
      wallet: wallets.ripple,
      assetSymbol: 'FOO',
      issuer: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
      limit: '100000000',
      fee: '100',
      memo: 'create-trustline',
    })
    assert.strictEqual(
      transaction.signedTx,
      '12001422800000002401186A39201B011981CA63D6838D7EA4C68000000000000000000000000000464F4F0000000000F667B0CA50CC7709A220B0561B85E53A48461FA8684000000000000000732102C9A41967E29CF6B363D099128CF1F2F72E98589F96CDE7B767C735B5269A95107446304402205F51B054E42A1F17DA6E945DF5A0C5A6EB08B6BBBA35E5392E49DB33E250A83702202366F330E6BF8A7EE59F27CB9BF3C0720278B2C5929D025571792D56A2142D04811402F4263E604CC4EDF5E76E95436E536B6B87D686F9EA7C04746573747D106372656174652D74727573746C696E657E0A746578742F706C61696EE1F1'
    )
  })

  it('delete trustline ripple', async () => {
    const transaction = await txController.createRippleTrustlineTransaction({
      wallet: wallets.ripple,
      assetSymbol: 'FOO',
      issuer: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
      limit: '0',
      fee: '100',
      memo: 'delete-trustline',
      protocol: Protocol.RIPPLE,
    })
    assert.strictEqual(
      transaction.signedTx,
      '12001422800000002401186A39201B011981CA638000000000000000000000000000000000000000464F4F0000000000F667B0CA50CC7709A220B0561B85E53A48461FA8684000000000000000732102C9A41967E29CF6B363D099128CF1F2F72E98589F96CDE7B767C735B5269A9510744630440220022808FE360D652CFFEE2DA648D04C5DBFB0DD3746DF7CC3A1F244A58CE91F49022042311D8E15F077DE405D4BACE8F489C6A7431852C30062933AA9695EFF08CD98811402F4263E604CC4EDF5E76E95436E536B6B87D686F9EA7C04746573747D1064656C6574652D74727573746C696E657E0A746578742F706C61696EE1F1'
    )
  })
})
