const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const WalletController = require('../../src/features/wallet/controller')
const { Protocol } = require('../../src/services/blockchain/constants')
const { config, mnemonic } = require('./constants')

describe.only('Test Suite of the Wallet (Controller)', () => {
  describe('Random mnemonic', () => {
    it('generate wallet', async () => {
      const controller = new WalletController(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.STELLAR,
      })
      assert.strictEqual(wallet.protocol, Protocol.STELLAR)
    })
    it('generate wallet error with unsupported protocol', () => {
      const controller = new WalletController(config)
      assert.isRejected(
        controller.generateWallet({ protocol: 'TEST' }),
        Error,
        'Unsupported blockchain protocol'
      )
    })
  })
  describe('From private key', () => {
    it('stellar', async () => {
      const controller = new WalletController(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.STELLAR,
        privateKey: 'SA6EEJRPDG2KNYMYCUJEWPUVDA3PGPUNX6JKNN2CX2K5LH34BWPKODYM'
      })
      assert.strictEqual(wallet.publicKey, 'GAC2V7MGMTG57FZKJSXRSZ4EIDL2RBFIYVXZJMTJZ232XPZQUCTYUCWL')
    })
    it('ripple', async () => {
      const controller = new WalletController(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.RIPPLE,
        privateKey: 'spjjDoTPjCrdRvVBrTcVGo4ouYG9X'
      })
      assert.strictEqual(wallet.address, 'rGcqB7ciEfDQpz9znXZSYXgEozqB5Xxhm')
    })
    it('bitcoin', async () => {
      const controller = new WalletController(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.BITCOIN,
        privateKey: '351dafbabc1e7211e44c744cab1ea0ef6ee621be6f0be363c275ed1d8f3a7772'
      })
      assert.strictEqual(wallet.address, 'n1vrMMcNaAig5fgdfdtC5DUu2G4NRodHpi')
    })
    it('ethereum', async () => {
      const controller = new WalletController(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.ETHEREUM,
        privateKey: '351dafbabc1e7211e44c744cab1ea0ef6ee621be6f0be363c275ed1d8f3a7772'
      })
      assert.strictEqual(wallet.address, '0x481B542b7419D8Ba305B5cc5029C12d5a68B4f69')
    })
    it('celo', async () => {
      const controller = new WalletController(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.CELO,
        privateKey: '121498c189793c9f7f2beae35d681a797eb22484760701e0de5d5c9904499618'
      })
      assert.strictEqual(wallet.address, '0x8C33DB44a78629cF60C88383d436EEc356884625')
    })
  })

  describe('From same mnemonic', () => {
    it('generate ethereum wallet', async () => {
      const controller = new WalletController(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.ETHEREUM,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallet.protocol, Protocol.ETHEREUM)
      assert.strictEqual(
        wallet.address,
        '0xCf61eaf64D895C3c71A8812e9EedC4c179b4ed60'
      )
    })
    it('generate bitcoin wallet', async () => {
      const controller = new WalletController(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.BITCOIN,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallet.protocol, Protocol.BITCOIN)
      assert.strictEqual(
        wallet.address,
        'n1vrMMcNaAig5fgdfdtC5DUu2G4NRodHpi'
      )
    })
    it('generate bsc wallet', async () => {
      const controller = new WalletController(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.BSC,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallet.protocol, Protocol.BSC)
      assert.strictEqual(
        wallet.address,
        '0xCf61eaf64D895C3c71A8812e9EedC4c179b4ed60'
      )
    })
    it('generate celo wallet', async () => {
      const controller = new WalletController(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.CELO,
        mnemonic,
        testnet: true,
      })
      assert.strictEqual(wallet.protocol, Protocol.CELO)
      assert.strictEqual(
        wallet.address,
        '0xb8a29fA1876EB806e411f15D2D94c8e80FB72e23'
      )
    })
    it('generate ripple wallet', async () => {
      const controller = new WalletController(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.RIPPLE,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.RIPPLE)
      assert.strictEqual(
        wallet.address,
        'rGcqB7ciEfDQpz9znXZSYXgEozqB5Xxhm'
      )
    })
    it('generate stellar wallet', async () => {
      const controller = new WalletController(config)
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
  })
})
