const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../axios')
const WalletController = require('../../src/features/wallet/controller')
const { Protocol } = require('../../src/services/blockchain/constants')
const { config, getWallets } = require('./constants')

const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.enviroment)
let wallets = {}

describe.only('Test Suite of the Wallet (Controller)', () => {
  before(async () => {
    wallets = await getWallets()
  })
  describe('trustline transactions', () => {
    it(' - create trustline stellar', async () => {
      nock(baseUrl)
        .get(
          `/wallet/${wallets.stellar.publicKey}/info?protocol=${Protocol.STELLAR}`
        )
        .reply(200, {
          sequence: '6259566941569025',
        })
      const controller = new WalletController(config)

      const transaction = await controller.createTrustlineTransaction({
        wallet: wallets.stellar,
        assetSymbol: 'BRLT',
        issuer: 'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO',
        limit: '100000000',
        fee: '100',
        memo: 'create-trustline',
        protocol: Protocol.STELLAR,
      })
      assert.include(transaction, 'AAAAAgAAAAAFqv2GZM3flypMrxlnhEDXqISoxW')
    })
    it(' - create trustline ripple', async () => {
      nock(baseUrl)
        .get(
          `/wallet/${wallets.ripple.address}/info?protocol=${Protocol.RIPPLE}`
        )
        .reply(200, {
          account_data: { Sequence: 6259566 },
          ledger_current_index: 1,
        })
      const controller = new WalletController(config)

      const transaction = await controller.createTrustlineTransaction({
        wallet: wallets.ripple,
        assetSymbol: 'FOO',
        issuer: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
        limit: '100000000',
        fee: '100',
        memo: 'create-trustline',
        protocol: Protocol.RIPPLE,
      })
      assert.strictEqual(
        transaction,
        '120014228000000024005F836E201B0000000B63D6838D7EA4C68000000000000000000000000000464F4F0000000000F667B0CA50CC7709A220B0561B85E53A48461FA8684000000000000064732102C9A41967E29CF6B363D099128CF1F2F72E98589F96CDE7B767C735B5269A951074473045022100AB9D7E12365A4BDA1CA18586FBA66CBA66174213A3CE3CCEAFF71E36299DEAC2022002707506E7268D0AD5A19E4725595FD59C02C3B3A35AA2C5E3430519FFEE6C79811402F4263E604CC4EDF5E76E95436E536B6B87D686F9EA7C04746573747D106372656174652D74727573746C696E657E0A746578742F706C61696EE1F1'
      )
    })
    it(' - delete trustline stellar', async () => {
      nock(baseUrl)
        .get(
          `/wallet/${wallets.stellar.publicKey}/info?protocol=${Protocol.STELLAR}`
        )
        .reply(200, {
          sequence: '6259566941569025',
        })
      const controller = new WalletController(config)

      const transaction = await controller.createTrustlineTransaction({
        wallet: wallets.stellar,
        assetSymbol: 'BRLT',
        issuer: 'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO',
        limit: '0',
        fee: '100',
        memo: 'delete-trustline',
        protocol: Protocol.STELLAR,
      })
      assert.include(transaction, 'AAAAAgAAAAAFqv2GZM3flypMrxlnhEDXqISoxW')
    })
    it(' - delete trustline ripple', async () => {
      nock(baseUrl)
        .get(
          `/wallet/${wallets.ripple.address}/info?protocol=${Protocol.RIPPLE}`
        )
        .reply(200, {
          account_data: { Sequence: 6259566 },
          ledger_current_index: 1,
        })
      const controller = new WalletController(config)
      const transaction = await controller.createTrustlineTransaction({
        wallet: wallets.ripple,
        assetSymbol: 'FOO',
        issuer: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
        limit: '0',
        fee: '100',
        memo: 'delete-trustline',
        protocol: Protocol.RIPPLE,
      })
      assert.strictEqual(
        transaction,
        '120014228000000024005F836E201B0000000B638000000000000000000000000000000000000000464F4F0000000000F667B0CA50CC7709A220B0561B85E53A48461FA8684000000000000064732102C9A41967E29CF6B363D099128CF1F2F72E98589F96CDE7B767C735B5269A951074473045022100CDBA164D1024F0F8AC97901B33467C3B2B0BCAF43ECC4BAD726FB393ADE151A4022063A6AC6E935F98FDC8F628D9BFFB9565EA24E80845101A9EF82535E55CC18BFE811402F4263E604CC4EDF5E76E95436E536B6B87D686F9EA7C04746573747D1064656C6574652D74727573746C696E657E0A746578742F706C61696EE1F1'
      )
    })
    it(' - create trustline stellar error with invalid issuer', async () => {
      nock(baseUrl)
        .get(
          `/wallet/${wallets.stellar.publicKey}/info?protocol=${Protocol.STELLAR}`
        )
        .reply(200, {
          sequence: '6259566941569025',
        })
      const controller = new WalletController(config)

      assert.isRejected(
        controller.createTrustlineTransaction({
          wallet: wallets.stellar,
          assetSymbol: 'BRLT',
          issuer: 'xxxxx',
          limit: '100000000',
          fee: '100',
          memo: 'create-trustline',
          protocol: Protocol.STELLAR,
        }),
        'Issuer is invalid'
      )
    })
  })
})
