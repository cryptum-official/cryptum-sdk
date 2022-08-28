const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const { getWalletControllerInstance } = require('../../src/features/wallet/controller')
const { Protocol } = require('../../src/services/blockchain/constants')
const { config, mnemonic } = require('./constants')

describe.only('Test Suite of the Wallet (Controller)', () => {
  describe('Random mnemonic', () => {
    it('generate wallet', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.STELLAR,
      })
      assert.strictEqual(wallet.protocol, Protocol.STELLAR)
    })
    it('generate wallet error with unsupported protocol', () => {
      const controller = getWalletControllerInstance(config)
      assert.isRejected(
        controller.generateWallet({ protocol: 'TEST' }),
        Error,
        'Unsupported blockchain protocol'
      )
    })
  })
  describe('From private key', () => {
    it('stellar', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.STELLAR,
        privateKey: 'SA6EEJRPDG2KNYMYCUJEWPUVDA3PGPUNX6JKNN2CX2K5LH34BWPKODYM'
      })
      assert.strictEqual(wallet.publicKey, 'GAC2V7MGMTG57FZKJSXRSZ4EIDL2RBFIYVXZJMTJZ232XPZQUCTYUCWL')
    })
    it('ripple', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.RIPPLE,
        privateKey: 'spjjDoTPjCrdRvVBrTcVGo4ouYG9X'
      })
      assert.strictEqual(wallet.address, 'rGcqB7ciEfDQpz9znXZSYXgEozqB5Xxhm')
    })
    it('bitcoin', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.BITCOIN,
        privateKey: '351dafbabc1e7211e44c744cab1ea0ef6ee621be6f0be363c275ed1d8f3a7772'
      })
      assert.strictEqual(wallet.address, 'n1vrMMcNaAig5fgdfdtC5DUu2G4NRodHpi')
    })
    it('ethereum', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.ETHEREUM,
        privateKey: '62a0747f04d08305e00618e1f5f750a06d5c0c336d3cf6971ef82a6f25605df2'
      })
      assert.strictEqual(wallet.address, '0x250f7fc273c792d76327ef37b709a82484fe0168')
    })
    it('avaxcchain', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.AVAXCCHAIN,
        privateKey: 'c8500a98d1093e8809855411f8b996f01b4de8618ab4d1e12e29d637a986d4d8'
      })
      assert.strictEqual(wallet.address, '0xcf61eaf64d895c3c71a8812e9eedc4c179b4ed60')
    })
    it('celo', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.CELO,
        privateKey: '0x121498c189793c9f7f2beae35d681a797eb22484760701e0de5d5c9904499618'
      })
      assert.strictEqual(wallet.address, '0x8c33db44a78629cf60c88383d436eec356884625')
    })
    it('hathor', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.HATHOR,
        privateKey: 'cbc23f4dc6d485807ff86e51b7b0c39de0028e3d5db0ef0feb264e6625832829'
      })
      assert.strictEqual(wallet.address, 'WXK74dFXd6Ctj6EUBH3ctpWwoVR2TnHCjV')
    })
    it('cardano', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.CARDANO,
        privateKey: {
          spendingPrivateKey: 'b0d7795a5eee850fec4d5fee4d38416f6754b83f3a63072ea4e4989bfcef4d40ae984afa5cc9b2d565110ebfa28a046ea93f817813c114c6b0cfdbcd7c2377327249dc8f22284234187be43b57e07a49329ebf9f812d7705cbc48ac9118a8822e3208ddf3830771b0944376d320c5c534d5bae7dbb04000802ae6d72e8f040ec',
          stakingPrivateKey: 'a8e753c5ea97a138f8b11441b6c862793bafb243ffd4a9ba755919e800f04d4056bb70e6784a3c092b5b4c8f7151231f3afe96444b489b16ef1d22c8f0cd0c5e942ed15b06ff59b34dca14aa5eaf37d39d226e4b3d6d38c5997f100d427180d6fb7c81b78a547c0a94b0398f3490c6befc35c818e487eddf9dd9c9b940b64b1d'
        }
      })
      assert.strictEqual(wallet.address, 'addr_test1qq7xrd2acryragknqwnsgqaam9hxq2scfcuhjuu3p6kmepgxr2xgy4urjt8p0gf0x6ykqag4km2dzrz870n7j4ydjszqj93ujx')
    })
    it('solana', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWalletFromPrivateKey({
        protocol: Protocol.SOLANA,
        privateKey: 'sGhVuqEYkGydzgnMCv2bd21uykMknighSFMcnAy7FxH6B4tjpPFUUQ5NWcS5hrvevMpn8cndp482ZacraX3HLb6'
      })
      assert.strictEqual(wallet.address, 'AgmaPkXMQAUyRUJc9QxywFnC8RjyWKt7WxS5e1ZFtQXe')
    })
  })

  describe('From same mnemonic', () => {
    it('generate ethereum wallet', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.ETHEREUM,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.ETHEREUM)
      assert.strictEqual(
        wallet.address,
        '0xcf61eaf64d895c3c71a8812e9eedc4c179b4ed60'
      )
    })
    it('generate avaxchain wallet', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.AVAXCCHAIN,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.AVAXCCHAIN)
      assert.strictEqual(
        wallet.address,
        '0xcf61eaf64d895c3c71a8812e9eedc4c179b4ed60'
      )
    })
    it('generate bitcoin wallet', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.BITCOIN,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.BITCOIN)
      assert.strictEqual(
        wallet.address,
        'mi5hP8CMZYanXLecyPmKeFo4xZFji7fiKF'
      )
    })
    it('generate bsc wallet', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.BSC,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.BSC)
      assert.strictEqual(
        wallet.address,
        '0xcf61eaf64d895c3c71a8812e9eedc4c179b4ed60'
      )
    })
    it('generate celo wallet', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.CELO,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.CELO)
      assert.strictEqual(
        wallet.address,
        '0xb8a29fa1876eb806e411f15d2d94c8e80fb72e23'
      )
    })
    it('generate ripple wallet', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.RIPPLE,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.RIPPLE)
      assert.strictEqual(
        wallet.address,
        'r9yjyreZCXNm7cN1uNEmAqzs6zJYWJnUxr'
      )
    })
    it('generate stellar wallet', async () => {
      const controller = getWalletControllerInstance(config)
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
    it('generate hathor wallet', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.HATHOR,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.HATHOR)
      assert.strictEqual(
        wallet.address,
        'WXpJQ1Y815pGQVC1MgD7DwJepokVnSmGD3'
      )
    })
    it('generate cardano wallet', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.CARDANO,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.CARDANO)
      assert.strictEqual(
        wallet.address,
        'addr_test1qq7xrd2acryragknqwnsgqaam9hxq2scfcuhjuu3p6kmepgxr2xgy4urjt8p0gf0x6ykqag4km2dzrz870n7j4ydjszqj93ujx'
      )
    })
    it('generate solana wallet', async () => {
      const controller = getWalletControllerInstance(config)
      const wallet = await controller.generateWallet({
        protocol: Protocol.SOLANA,
        mnemonic,
      })
      assert.strictEqual(wallet.protocol, Protocol.SOLANA)
      assert.strictEqual(
        wallet.address,
        'AgmaPkXMQAUyRUJc9QxywFnC8RjyWKt7WxS5e1ZFtQXe'
      )
    })
  })

  describe('Generate wallet address from xpub', () => {
    it('bitcoin', async () => {
      const controller = getWalletControllerInstance(config)
      const walletAddress = await controller.generateWalletAddressFromXpub({
        protocol: Protocol.BITCOIN,
        xpub: 'tpubDEFyQA3yezcuwZS9S8yTYP1kTV9d1RegHQPyAcdyFyURFpotMwM7VpHqwhBNweYuuSMLWG2733fjDwrx7vPk2CpS22zmG8g3U5JJmix3RKs',
        address: 0
      })
      assert.strictEqual(walletAddress, 'mi5hP8CMZYanXLecyPmKeFo4xZFji7fiKF')
    })
    it('ethereum', async () => {
      const controller = getWalletControllerInstance(config)
      const walletAddress = await controller.generateWalletAddressFromXpub({
        protocol: Protocol.ETHEREUM,
        xpub: 'xpub6EWLCGwtcyjG8r8qBmF82Le6sA4FhQBfWtxUHvo7GDTZr1ch3FBbYbbCntYjvsRMK22NpvjtC9X87bahssEUpPEdU453fibMFhi3QS5sqjL',
        address: 0
      })
      assert.strictEqual(walletAddress, '0xcf61eaf64d895c3c71a8812e9eedc4c179b4ed60')
    })
    it('avaxcchain', async () => {
      const controller = getWalletControllerInstance(config)
      const walletAddress = await controller.generateWalletAddressFromXpub({
        protocol: Protocol.AVAXCCHAIN,
        xpub: 'xpub6Bxt5wwQHqGvkwtq44FMFB7SaJ1jrqfaKwNtymniWUi4bB6Sfn7V9iTw3P4TGkgDaht7yyiyzg3ZBbWP5GMmUBS1fSQAtLUdGYmDt9A1dWa',
        address: 0
      })
      assert.strictEqual(walletAddress, '0xb67dce3b8272340d517ec6231e435319813a749b')
    })
    it('celo', async () => {
      const controller = getWalletControllerInstance(config)
      const walletAddress = await controller.generateWalletAddressFromXpub({
        protocol: Protocol.CELO,
        xpub: 'xpub6EWLCGwtcyjG8r8qBmF82Le6sA4FhQBfWtxUHvo7GDTZr1ch3FBbYbbCntYjvsRMK22NpvjtC9X87bahssEUpPEdU453fibMFhi3QS5sqjL',
        address: 0
      })
      assert.strictEqual(walletAddress, '0xcf61eaf64d895c3c71a8812e9eedc4c179b4ed60')
    })
    it('cardano', async () => {
      const controller = getWalletControllerInstance(config)
      const walletAddress = await controller.generateWalletAddressFromXpub({
        protocol: Protocol.CARDANO,
        xpub: '7249dc8f22284234187be43b57e07a49329ebf9f812d7705cbc48ac9118a8822942ed15b06ff59b34dca14aa5eaf37d39d226e4b3d6d38c5997f100d427180d6',
        address: 0
      })
      assert.strictEqual(walletAddress, 'addr_test1qq7xrd2acryragknqwnsgqaam9hxq2scfcuhjuu3p6kmepgxr2xgy4urjt8p0gf0x6ykqag4km2dzrz870n7j4ydjszqj93ujx')
    })
    it('hathor', async () => {
      const controller = getWalletControllerInstance(config)
      const walletAddress = await controller.generateWalletAddressFromXpub({
        protocol: Protocol.HATHOR,
        xpub: 'xpub6BvfktJnGiZJhbj8pwzKpsdKLmroLwJ3Fix1ZMm1rjMoGQgiP9dZekHP1qzZ4WLPGpsuJwEXSTCGdY3wqjuwCeSiF1DgLmQTtRmNVKscfcj',
        address: 0
      })
      assert.strictEqual(walletAddress, 'WXpJQ1Y815pGQVC1MgD7DwJepokVnSmGD3')
    })
  })
})
