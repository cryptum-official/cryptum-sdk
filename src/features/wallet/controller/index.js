const { generateMnemonic } = require('bip39')
const { Wallet, WalletInfoResponse } = require('../entity')
const { getApiMethod, mountHeaders, handleRequestError } = require('../../../services')
const Interface = require('./interface')
const requests = require('./requests.json')
const {
  deriveBitcoinWallet,
  deriveEthereumWallet,
  deriveCeloWallet,
  deriveRippleWallet,
  deriveStellarWallet,
  getBitcoinAddressFromPrivateKey,
  getBscAddressFromPrivateKey,
  getEthereumAddressFromPrivateKey,
  getCeloAddressFromPrivateKey,
  getStellarPublicKeyFromPrivateKey,
  getRippleAddressFromPrivateKey,
  deriveHathorWallet,
  getHathorAddressFromPrivateKey,
} = require('../../../services/wallet')
const { Protocol } = require('../../../services/blockchain/constants')
const { validateWalletInfo, validateMnemonic, validatePrivateKey } = require('../../../services/validations')

class Controller extends Interface {
  /**
   * Generate new wallet
   *
   * @param {object} args
   * @param {Protocol} args.protocol blockchain protocol to generate the wallet for
   * @param {boolean?} args.testnet true for testnet and false for mainnet
   * @param {string?} args.mnemonic mnemonic seed
   * @returns {Promise<Wallet>}
   */
  async generateWallet({ protocol, testnet, mnemonic = '' }) {
    validateMnemonic(mnemonic)
    mnemonic = mnemonic ? mnemonic : generateMnemonic(256)
    testnet = testnet !== undefined ? testnet : this.config.environment === 'development'

    switch (protocol) {
      case Protocol.BITCOIN:
        return await this.generateBitcoinWallet(mnemonic, testnet)
      case Protocol.BSC:
        return await this.generateBscWallet(mnemonic, testnet)
      case Protocol.ETHEREUM:
        return await this.generateEthereumWallet(mnemonic, testnet)
      case Protocol.CELO:
        return await this.generateCeloWallet(mnemonic, testnet)
      case Protocol.STELLAR:
        return await this.generateStellarWallet(mnemonic, testnet)
      case Protocol.RIPPLE:
        return await this.generateRippleWallet(mnemonic, testnet)
      case Protocol.HATHOR:
        return await this.generateHathorWallet(mnemonic, testnet)
      default:
        throw new Error('Unsupported blockchain protocol')
    }
  }
  /**
   * Generate new wallet from private key
   *
   * @param {object} args
   * @param {string} args.privateKey private key string
   * @param {Protocol} args.protocol blockchain protocol
   * @param {boolean?} args.testnet true for testnet and false for mainnet
   * @returns {Promise<Wallet>}
   */
  async generateWalletFromPrivateKey({ privateKey, protocol, testnet }) {
    validatePrivateKey(privateKey)
    testnet = testnet = testnet !== undefined ? testnet : this.config.environment === 'development'
    const walletData = { address: null, publicKey: null, privateKey, protocol, testnet }
    switch (protocol) {
      case Protocol.BITCOIN:
        walletData.address = getBitcoinAddressFromPrivateKey(privateKey, testnet)
        break
      case Protocol.BSC:
        walletData.address = getBscAddressFromPrivateKey(privateKey)
        break
      case Protocol.ETHEREUM:
        walletData.address = getEthereumAddressFromPrivateKey(privateKey)
        break
      case Protocol.CELO:
        walletData.address = getCeloAddressFromPrivateKey(privateKey)
        break
      case Protocol.STELLAR:
        walletData.publicKey = getStellarPublicKeyFromPrivateKey(privateKey)
        break
      case Protocol.RIPPLE:
        walletData.address = getRippleAddressFromPrivateKey(privateKey)
        break
      case Protocol.HATHOR:
        walletData.address = getHathorAddressFromPrivateKey(privateKey, testnet)
        break
      default:
        throw new Error('Unsupported blockchain protocol')
    }
    return new Wallet(walletData)
  }

  async generateBitcoinWallet(mnemonic, testnet) {
    const { address, privateKey, publicKey } = await deriveBitcoinWallet(mnemonic, testnet)
    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.BITCOIN,
    })
  }

  async generateEthereumWallet(mnemonic, testnet) {
    const { address, privateKey, publicKey } = await deriveEthereumWallet(mnemonic, testnet)
    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.ETHEREUM,
    })
  }

  async generateBscWallet(mnemonic, testnet) {
    const wallet = await this.generateEthereumWallet(mnemonic, testnet)
    wallet.protocol = Protocol.BSC
    return wallet
  }

  async generateCeloWallet(mnemonic, testnet) {
    const { address, privateKey, publicKey } = await deriveCeloWallet(mnemonic)
    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.CELO,
    })
  }

  async generateStellarWallet(mnemonic, testnet) {
    const { privateKey, publicKey } = deriveStellarWallet(mnemonic)
    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      testnet,
      protocol: Protocol.STELLAR,
    })
  }

  async generateRippleWallet(mnemonic, testnet) {
    const { address, privateKey, publicKey } = deriveRippleWallet(mnemonic)
    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.RIPPLE,
    })
  }
  async generateHathorWallet(mnemonic, testnet) {
    const { address, privateKey, publicKey } = deriveHathorWallet(mnemonic, testnet)
    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.HATHOR,
    })
  }
  /**
   * Get wallet information from blockchain
   *
   * @param {object} input
   * @param {string} input.address wallet address or public key
   * @param {Protocol} input.protocol blockchain protocol
   * @param {string[]?} input.tokenAddresses array of token addresses to fetch balance from
   * @returns {Promise<WalletInfoResponse>}
   */
  async getWalletInfo(input) {
    validateWalletInfo(input)
    const { address, protocol, tokenAddresses } = input
    try {
      const apiRequest = getApiMethod({
        requests,
        key: 'getWalletInfo',
        config: this.config,
      })
      const headers = mountHeaders(this.config.apiKey)
      const qs = [`protocol=${protocol}`]
      if (tokenAddresses) {
        for (const token of tokenAddresses) {
          qs.push(`tokenAddresses[]=${token}`)
        }
      }
      const response = await apiRequest(`${requests.getWalletInfo.url}/${address}/info?${qs.join('&')}`, {
        headers,
      })
      return new WalletInfoResponse(response.data)
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
