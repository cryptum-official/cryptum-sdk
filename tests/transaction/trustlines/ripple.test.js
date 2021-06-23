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

describe.only('Ripple trustline transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.ripple.address}/info`)
      .query({ protocol: Protocol.RIPPLE })
      .reply(200, {
        account_data: { Sequence: 6259566 },
        ledger_current_index: 1,
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
      '12001422800000002401186A39201B011981CA63D6838D7EA4C68000000000000000000000000000464F4F0000000000F667B0CA50CC7709A220B0561B85E53A48461FA8684000000000000064732102C9A41967E29CF6B363D099128CF1F2F72E98589F96CDE7B767C735B5269A951074463044022042DBF7C9FA8D702F07FC7CB1A38F2C44E5FE0EE0B2E669B026A393FD87545B83022003A3EEE2BF20EE78A50764B009EEA35DDA706E374072595B0A2E0813FC7E664C811402F4263E604CC4EDF5E76E95436E536B6B87D686F9EA7C04746573747D106372656174652D74727573746C696E657E0A746578742F706C61696EE1F1'
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
      '12001422800000002401186A39201B011981CA638000000000000000000000000000000000000000464F4F0000000000F667B0CA50CC7709A220B0561B85E53A48461FA8684000000000000064732102C9A41967E29CF6B363D099128CF1F2F72E98589F96CDE7B767C735B5269A951074463044022000EA1179080B20D970E68BCE6DBCF2CD49F421CD5E8B8E251C4850605FFBE0AB02203FC8CA496E33175175D54A0F85363717C4724D82647C4C6A28093FC4B87B37E5811402F4263E604CC4EDF5E76E95436E536B6B87D686F9EA7C04746573747D1064656C6574652D74727573746C696E657E0A746578742F706C61696EE1F1'
    )
  })
})
