const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../axios')
const WalletController = require('../../src/features/wallet/controller')
const { Protocol } = require('../../src/services/blockchain')

const mnemonic =
  'coyote cost habit float february version unique balcony pluck always cheese amount river conduct wave wonder north scale series gather skate address invite kidney'
const wallets = {
  stellar: null,
  ripple: null,
  ethereum: null,
  bsc: null,
  celo: null,
  bitcoin: null,
  binancechain: null,
}
const config = {
  enviroment: 'development',
  apiKey: process.env.CRYPTUM_APIKEY,
}

describe.only('Test Suite of the Wallet (Controller)', () => {
  describe('Random mnemonic', () => {
    it(' - generate wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      const wallet = await controller.generateWallet({
        protocol: Protocol.STELLAR,
      })
      assert.strictEqual(wallet.protocol, Protocol.STELLAR)
    })
    it(' - generate wallet error with unsupported protocol', () => {
      const controller = new WalletController({ enviroment: 'development' })
      assert.isRejected(
        controller.generateWallet({ protocol: 'TEST' }),
        Error,
        'Unsupported blockchain protocol'
      )
    })
  })

  describe('From same mnemonic', () => {
    it(' - generate ethereum wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      wallets.ethereum = await controller.generateWallet({
        protocol: Protocol.ETHEREUM,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallets.ethereum.protocol, Protocol.ETHEREUM)
      assert.strictEqual(
        wallets.ethereum.address,
        '0x481B542b7419D8Ba305B5cc5029C12d5a68B4f69'
      )
    })
    it(' - generate bitcoin wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      wallets.bitcoin = await controller.generateWallet({
        protocol: Protocol.BITCOIN,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallets.bitcoin.protocol, Protocol.BITCOIN)
      assert.strictEqual(
        wallets.bitcoin.address,
        'n1vrMMcNaAig5fgdfdtC5DUu2G4NRodHpi'
      )
    })
    it(' - generate bsc wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      wallets.bsc = await controller.generateWallet({
        protocol: Protocol.BSC,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallets.bsc.protocol, Protocol.BSC)
      assert.strictEqual(
        wallets.bsc.address,
        '0x481B542b7419D8Ba305B5cc5029C12d5a68B4f69'
      )
    })
    it(' - generate celo wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      wallets.celo = await controller.generateWallet({
        protocol: Protocol.CELO,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallets.celo.protocol, Protocol.CELO)
      assert.strictEqual(
        wallets.celo.address,
        '0x8C33DB44a78629cF60C88383d436EEc356884625'
      )
    })
    it(' - generate ripple wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      wallets.ripple = await controller.generateWallet({
        protocol: Protocol.RIPPLE,
        mnemonic,
      })
      assert.strictEqual(wallets.ripple.protocol, Protocol.RIPPLE)
      assert.strictEqual(
        wallets.ripple.address,
        'rGcqB7ciEfDQpz9znXZSYXgEozqB5Xxhm'
      )
    })
    it(' - generate stellar wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      wallets.stellar = await controller.generateWallet({
        protocol: Protocol.STELLAR,
        mnemonic,
      })
      assert.strictEqual(wallets.stellar.protocol, Protocol.STELLAR)
      assert.strictEqual(
        wallets.stellar.publicKey,
        'GAC2V7MGMTG57FZKJSXRSZ4EIDL2RBFIYVXZJMTJZ232XPZQUCTYUCWL'
      )
    })
    it(' - generate binancechain wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      wallets.binancechain = await controller.generateWallet({
        protocol: Protocol.BINANCECHAIN,
        mnemonic,
        tesnet: true,
      })
      assert.strictEqual(wallets.binancechain.protocol, Protocol.BINANCECHAIN)
      assert.strictEqual(
        wallets.binancechain.address,
        'tbnb1ggckn09nkn2kvl28aaksrj7ze5esfx58fsvfep'
      )
    })
  })

  describe('create transactions', () => {
    const axiosApi = new AxiosApi(config)
    const baseUrl = axiosApi.getBaseUrl(config.enviroment)

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
        assetCode: 'BRLT',
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
        assetCode: 'FOO',
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
        assetCode: 'BRLT',
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
        assetCode: 'FOO',
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
          assetCode: 'BRLT',
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
