const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const WalletController = require('../../src/features/wallet/controller')
const { Protocol } = require('../../src/services/blockchain')
const mnemonic =
  'coyote cost habit float february version unique balcony pluck always cheese amount river conduct wave wonder north scale series gather skate address invite kidney'

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
      const wallet = await controller.generateWallet({
        protocol: Protocol.ETHEREUM,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallet.protocol, Protocol.ETHEREUM)
      assert.strictEqual(
        wallet.address,
        '0x481B542b7419D8Ba305B5cc5029C12d5a68B4f69'
      )
    })
    it(' - generate bitcoin wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      const wallet = await controller.generateWallet({
        protocol: Protocol.BITCOIN,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallet.protocol, Protocol.BITCOIN)
      assert.strictEqual(wallet.address, 'n1vrMMcNaAig5fgdfdtC5DUu2G4NRodHpi')
    })
    it(' - generate bsc wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      const wallet = await controller.generateWallet({
        protocol: Protocol.BSC,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallet.protocol, Protocol.BSC)
      assert.strictEqual(
        wallet.address,
        '0x481B542b7419D8Ba305B5cc5029C12d5a68B4f69'
      )
    })
    it(' - generate celo wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      const wallet = await controller.generateWallet({
        protocol: Protocol.CELO,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallet.protocol, Protocol.CELO)
      assert.strictEqual(
        wallet.address,
        '0x8C33DB44a78629cF60C88383d436EEc356884625'
      )
    })
    it(' - generate ripple wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      const wallet = await controller.generateWallet({
        protocol: Protocol.RIPPLE,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.RIPPLE)
      assert.strictEqual(wallet.address, 'rGcqB7ciEfDQpz9znXZSYXgEozqB5Xxhm')
    })
    it(' - generate stellar wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      const wallet = await controller.generateWallet({
        protocol: Protocol.STELLAR,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.STELLAR)
      assert.strictEqual(
        wallet.publicKey,
        'GAC2V7MGMTG57FZKJSXRSZ4EIDL2RBFIYVXZJMTJZ232XPZQUCTYUCWL'
      )
    })
    it(' - generate binancechain wallet', async () => {
      const controller = new WalletController({ enviroment: 'development' })
      const wallet = await controller.generateWallet({
        protocol: Protocol.BINANCECHAIN,
        mnemonic,
        tesnet: true,
      })
      assert.strictEqual(wallet.protocol, Protocol.BINANCECHAIN)
      assert.strictEqual(
        wallet.address,
        'tbnb1ggckn09nkn2kvl28aaksrj7ze5esfx58fsvfep'
      )
    })
  })

  describe('create transactions', () => {
    it(' - create trustline stellar', async () => {
      const controller = new WalletController({
        enviroment: 'development',
        apiKey: process.env.CRYPTUM_APIKEY,
      })
      const wallet = await controller.generateWallet({
        mnemonic,
        protocol: Protocol.STELLAR,
        testnet: true,
      })

      const transaction = await controller.createTrustlineTransaction({
        wallet,
        assetCode: 'BRLT',
        issuer: 'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO',
        limit: '100000000',
        fee: '100',
        memo: 'create-trustline',
        protocol: Protocol.STELLAR,
      })
      console.log(transaction)
    })
    it.skip(' - create trustline ripple', async () => {
      const controller = new WalletController({
        enviroment: 'development',
        apiKey: process.env.CRYPTUM_APIKEY,
      })
      const wallet = await controller.generateWallet({
        mnemonic,
        protocol: Protocol.RIPPLE,
        testnet: true,
      })

      const transaction = await controller.createTrustlineTransaction({
        wallet,
        assetCode: 'BRLT',
        issuer: 'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO',
        limit: '100000000',
        fee: '100',
        memo: 'create-trustline',
        protocol: Protocol.RIPPLE,
      })
      console.log(transaction)
    })
    it(' - delete trustline stellar', async () => {
      const controller = new WalletController({
        enviroment: 'development',
        apiKey: process.env.CRYPTUM_APIKEY,
      })
      const wallet = await controller.generateWallet({
        mnemonic,
        protocol: Protocol.STELLAR,
        testnet: true,
      })
      const transaction = await controller.createTrustlineTransaction({
        wallet,
        assetCode: 'BRLT',
        issuer: 'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO',
        limit: '0',
        fee: '100',
        memo: 'delete-trustline',
        protocol: Protocol.STELLAR,
      })
      console.log(transaction)
    })
    it.skip(' - delete trustline ripple', async () => {
      const controller = new WalletController({
        enviroment: 'development',
        apiKey: process.env.CRYPTUM_APIKEY,
      })
      const wallet = await controller.generateWallet({
        mnemonic,
        protocol: Protocol.STELLAR,
        testnet: true,
      })
      const transaction = await controller.createTrustlineTransaction({
        wallet,
        assetCode: 'BRLT',
        issuer: 'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO',
        limit: '0',
        fee: '100',
        memo: 'delete-trustline',
        protocol: Protocol.STELLAR,
      })
      console.log(transaction)
    })
  })
})
