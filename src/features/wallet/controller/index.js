const { generateMnemonic, mnemonicToSeed, mnemonicToEntropy } = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const stellarHdWallet = require('stellar-hd-wallet')
const rippleKeyPairs = require('ripple-keypairs')
const binance = require('@binance-chain/javascript-sdk')
const {
  Protocol,
  TESTNET_DERIVATION_PATH,
  BITCOIN_DERIVATION_PATH,
  ETHEREUM_DERIVATION_PATH,
  CELO_DERIVATION_PATH,
} = require('../constants')
const Wallet = require('../entity')

const Interface = require('./interface')
const {
  derivePathFromMasterSeed,
  privateKeyToEthAccount,
  getBitcoinAddressFromPrivateKey,
  getEthereumAddressFromPrivateKey,
  getBinancechainAddressFromPrivateKey,
  getCeloAddressFromPrivateKey,
} = require('../../../services/blockchain')
class Controller extends Interface {
  /**
   * Generate new random wallet
   * @param {Protocol} protocol blockchain protocol to generate the wallet for
   * @param {boolean} testnet true for testnet and false for mainnet
   * @returns {Promise<Wallet>}
   */
  async generateRandomWallet(protocol, testnet = true) {
    const mnemonic = generateMnemonic(256)

    switch (protocol) {
      case Protocol.BINANCECHAIN:
        return await this.generateBinancechainWallet(mnemonic, testnet)
      case Protocol.BITCOIN:
        return await this.generateBitcoinWallet(mnemonic, testnet)
      case Protocol.BSC:
        return await this.generateBscWallet(mnemonic, testnet)
      case Protocol.ETHEREUM:
        return await this.generateEthereumWallet(mnemonic, testnet)
      case Protocol.CELO:
        return await this.generateCeloWallet(mnemonic)
      case Protocol.STELLAR:
        return await this.generateStellarWallet(mnemonic)
      case Protocol.RIPPLE:
        return await this.generateRippleWallet(mnemonic)
      default:
        throw new Error('Unsupported blockchain protocol')
    }
  }
  /**
   * Generate new bitcoin wallet
   * @param {string} mnemonic mnemonic string
   * @param {boolean} testnet true for testnet and false for mainnet
   * @returns {Promise<Wallet>}
   */
  async generateBitcoinWallet(mnemonic, testnet) {
    const network = testnet
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin
    const derivedPath = derivePathFromMasterSeed(
      await mnemonicToSeed(mnemonic),
      testnet ? TESTNET_DERIVATION_PATH : BITCOIN_DERIVATION_PATH,
      network.bip32
    )
    const address = getBitcoinAddressFromPrivateKey(
      derivedPath.privateKey.toString('hex'),
      testnet
    )

    return new Wallet({
      mnemonic,
      privateKey: derivedPath.privateKey.toString('hex'),
      publicKey: derivedPath.publicKey.toString('hex'),
      address,
      protocol: Protocol.BITCOIN,
    })
  }
  /**
   * Generate new ethereum wallet
   * @param {string} mnemonic mnemonic string
   * @param {boolean} testnet true for testnet and false for mainnet
   * @returns {Promise<Wallet>}
   */
  async generateEthereumWallet(mnemonic, testnet) {
    const derivedPath = derivePathFromMasterSeed(
      await mnemonicToSeed(mnemonic),
      testnet ? TESTNET_DERIVATION_PATH : ETHEREUM_DERIVATION_PATH
    )
    const address = getEthereumAddressFromPrivateKey(
      derivedPath.privateKey.toString('hex')
    )

    return new Wallet({
      mnemonic,
      privateKey: derivedPath.privateKey.toString('hex'),
      publicKey: derivedPath.publicKey.toString('hex'),
      address,
      protocol: Protocol.ETHEREUM,
    })
  }
  /**
   * Generate new binance smart chain wallet
   * @param {string} mnemonic mnemonic string
   * @param {boolean} testnet true for testnet and false for mainnet
   * @returns {Promise<Wallet>}
   */
  async generateBscWallet(mnemonic, testnet) {
    const wallet = await this.generateEthereumWallet(mnemonic, testnet)
    wallet.protocol = Protocol.BSC
    return wallet
  }
/**
   * Generate new binance chain wallet
   * @param {string} mnemonic mnemonic string
   * @param {boolean} testnet true for testnet and false for mainnet
   * @returns {Promise<Wallet>}
   */
  async generateBinancechainWallet(mnemonic, testnet) {
    const privateKey = binance.crypto.getPrivateKeyFromMnemonic(
      mnemonic,
      true,
      0
    )
    const publicKey = binance.crypto.getPublicKeyFromPrivateKey(privateKey)
    const address = getBinancechainAddressFromPrivateKey(privateKey, testnet)
    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      protocol: Protocol.BINANCECHAIN,
    })
  }
  /**
   * Generate new celo wallet
   * @param {string} mnemonic mnemonic string
   * @returns {Promise<Wallet>}
   */
  async generateCeloWallet(mnemonic) {
    const derivedPath = derivePathFromMasterSeed(
      await mnemonicToSeed(mnemonic),
      CELO_DERIVATION_PATH
    )
    const address = getCeloAddressFromPrivateKey(
      derivedPath.privateKey.toString('hex')
    )
    return new Wallet({
      mnemonic,
      privateKey: derivedPath.privateKey.toString('hex'),
      publicKey: derivedPath.publicKey.toString('hex'),
      address,
      protocol: Protocol.CELO,
    })
  }
  /**
   * Generate new stellar wallet
   * @param {string} mnemonic mnemonic string
   * @returns {Promise<Wallet>}
   */
  async generateStellarWallet(mnemonic) {
    const keypair = stellarHdWallet.fromMnemonic(mnemonic)
    return new Wallet({
      mnemonic,
      privateKey: keypair.getSecret(0),
      publicKey: keypair.getPublicKey(0),
      protocol: Protocol.STELLAR,
    })
  }
  /**
   * Generate new ripple wallet
   * @param {string} mnemonic mnemonic string
   * @returns {Promise<Wallet>}
   */
  async generateRippleWallet(mnemonic) {
    const seed = rippleKeyPairs.generateSeed({
      entropy: mnemonicToEntropy(mnemonic),
    })
    const keypair = rippleKeyPairs.deriveKeypair(seed)
    const address = rippleKeyPairs.deriveAddress(keypair.publicKey)
    return new Wallet({
      mnemonic,
      privateKey: seed,
      publicKey: keypair.publicKey,
      address,
      protocol: Protocol.RIPPLE,
    })
  }
}

module.exports = Controller
