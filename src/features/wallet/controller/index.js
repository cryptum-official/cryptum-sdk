const { generateMnemonic } = require('bip39')
const { Wallet, WalletInfoResponse } = require('../entity')
const { getApiMethod, mountHeaders, handleRequestError } = require('../../../services')
const Interface = require('./interface')
const requests = require('./requests.json')
const { InvalidTypeException } = require('../../../../errors')
const {
  deriveBitcoinWallet,
  deriveEthereumWallet,
  deriveBinancechainWallet,
  deriveCeloWallet,
  deriveRippleWallet,
  deriveStellarWallet,
  getBinancechainAddressFromPrivateKey,
  getBitcoinAddressFromPrivateKey,
  getBscAddressFromPrivateKey,
  getEthereumAddressFromPrivateKey,
  getCeloAddressFromPrivateKey,
  getStellarPublicKeyFromPrivateKey,
  getRippleAddressFromPrivateKey,
} = require('../../../services/wallet')
const { Protocol } = require('../../../services/blockchain/constants')

class Controller extends Interface {
  async generateWallet({ protocol, testnet = true, mnemonic = '' }) {
    mnemonic = mnemonic ? mnemonic : generateMnemonic(256)

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
        return await this.generateCeloWallet(mnemonic, testnet)
      case Protocol.STELLAR:
        return await this.generateStellarWallet(mnemonic, testnet)
      case Protocol.RIPPLE:
        return await this.generateRippleWallet(mnemonic, testnet)
      default:
        throw new Error('Unsupported blockchain protocol')
    }
  }

  async generateWalletFromPrivateKey({ privateKey, protocol, testnet = true }) {
    let walletData = { address: null, publicKey: null, privateKey, protocol, testnet }
    switch (protocol) {
      case Protocol.BINANCECHAIN:
        walletData.address = getBinancechainAddressFromPrivateKey(privateKey, testnet)
        break
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

  async generateBinancechainWallet(mnemonic, testnet) {
    const { address, privateKey, publicKey } = deriveBinancechainWallet(mnemonic, testnet)
    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.BINANCECHAIN,
    })
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

  async getWalletInfo({ address, protocol }) {
    if (!address || typeof address !== 'string') {
      throw new InvalidTypeException('address', 'string')
    }
    if (!protocol || typeof protocol !== 'string') {
      throw new InvalidTypeException('protocol', 'string')
    }
    try {
      const apiRequest = getApiMethod({
        requests,
        key: 'getWalletInfo',
        config: this.config,
      })
      const headers = mountHeaders(this.config.apiKey)
      const response = await apiRequest(`${requests.getWalletInfo.url}/${address}/info?protocol=${protocol}`, {
        headers,
      })
      return new WalletInfoResponse(response.data)
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
