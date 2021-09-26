const { generateMnemonic } = require('bip39')
const { Wallet, WalletInfoResponse } = require('../entity')
const { getApiMethod, mountHeaders, handleRequestError } = require('../../../services')
const Interface = require('./interface')
const requests = require('./requests.json')
const {
  getBitcoinAddressFromPrivateKey,
  getBscAddressFromPrivateKey,
  getEthereumAddressFromPrivateKey,
  getCeloAddressFromPrivateKey,
  getStellarPublicKeyFromPrivateKey,
  getRippleAddressFromPrivateKey,
  deriveBitcoinWalletFromDerivationPath,
  deriveCeloWalletFromDerivationPath,
  deriveStellarWalletFromDerivationPath,
  deriveRippleWalletFromDerivationPath,
  deriveEthereumWalletFromDerivationPath,
} = require('../../../services/wallet')
const { Protocol } = require('../../../services/blockchain/constants')
const { validateWalletInfo } = require('../../../services/validations')

class Controller extends Interface {
  /**
   * Generate new wallet
   *
   * @param {object} args
   * @param {Protocol} args.protocol blockchain protocol to generate the wallet for
   * @param {boolean?} args.testnet true for testnet and false for mainnet
   * @param {string?} args.mnemonic mnemonic seed
   * @param {object?} args.derivation object with information to derive one wallet (BIP44 derivation path)
   * @param {number?} args.derivation.account account index to derive wallet
   * @param {number?} args.derivation.change change index to derive wallet
   * @param {number?} args.derivation.address address index to derive wallet
   * @returns {Promise<Wallet>}
   */
  async generateWallet({ protocol, mnemonic = '', testnet, derivation = { account: 0, change: 0, address: 0 } }) {
    testnet = testnet !== undefined ? testnet : this.config.environment === 'development'
    mnemonic = mnemonic ? mnemonic : generateMnemonic(256)

    switch (protocol) {
      case Protocol.BITCOIN:
        return await this.generateBitcoinWallet({ mnemonic, derivation, testnet })
      case Protocol.BSC:
        return await this.generateBscWallet({ mnemonic, derivation, testnet })
      case Protocol.ETHEREUM:
        return await this.generateEthereumWallet({ mnemonic, derivation, testnet })
      case Protocol.CELO:
        return await this.generateCeloWallet({ mnemonic, derivation, testnet })
      case Protocol.STELLAR:
        return await this.generateStellarWallet({ mnemonic, derivation, testnet })
      case Protocol.RIPPLE:
        return await this.generateRippleWallet({ mnemonic, derivation, testnet })
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
    testnet = testnet !== undefined ? testnet : this.config.environment === 'development'
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
      default:
        throw new Error('Unsupported blockchain protocol')
    }
    return new Wallet(walletData)
  }

  async generateBitcoinWallet({ mnemonic, derivation, testnet }) {
    const { address, privateKey, publicKey } = await deriveBitcoinWalletFromDerivationPath(
      mnemonic,
      testnet,
      derivation
    )
    return new Wallet({
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.BITCOIN,
    })
  }

  async generateEthereumWallet({ mnemonic, derivation, testnet }) {
    const { address, privateKey, publicKey } = await deriveEthereumWalletFromDerivationPath(mnemonic, derivation)
    return new Wallet({
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.ETHEREUM,
    })
  }

  async generateBscWallet({ mnemonic, derivation, testnet }) {
    const wallet = await this.generateEthereumWallet({ mnemonic, derivation, testnet })
    wallet.protocol = Protocol.BSC
    return wallet
  }

  async generateCeloWallet({ mnemonic, derivation, testnet }) {
    const { address, privateKey, publicKey } = await deriveCeloWalletFromDerivationPath(mnemonic, derivation)
    return new Wallet({
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.CELO,
    })
  }

  async generateStellarWallet({ mnemonic, derivation, testnet }) {
    const { privateKey, publicKey } = deriveStellarWalletFromDerivationPath(mnemonic, derivation)
    return new Wallet({
      privateKey,
      publicKey,
      testnet,
      protocol: Protocol.STELLAR,
    })
  }

  async generateRippleWallet({ mnemonic, derivation, testnet }) {
    const { address, privateKey, publicKey } = deriveRippleWalletFromDerivationPath(mnemonic, derivation)
    return new Wallet({
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.RIPPLE,
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
