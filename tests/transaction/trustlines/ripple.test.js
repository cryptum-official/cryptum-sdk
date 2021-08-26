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
    assert.include(
      transaction.signedTx,
      '1200142280000000'
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
    assert.include(
      transaction.signedTx,
      '1200142280000000'
    )
  })
})
