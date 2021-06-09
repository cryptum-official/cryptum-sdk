const { generateMnemonic } = require('bip39')

const Wallet = require('../entity')

const Interface = require('./interface')
const {
  deriveBitcoinWallet,
  deriveEthereumWallet,
  deriveBinancechainWallet,
  deriveCeloWallet,
  deriveRippleWallet,
  deriveStellarWallet,
} = require('../../../services/wallet')
const { Protocol } = require('../constants')
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
        return await this.generateCeloWallet(mnemonic)
      case Protocol.STELLAR:
        return await this.generateStellarWallet(mnemonic)
      case Protocol.RIPPLE:
        return await this.generateRippleWallet(mnemonic)
      default:
        throw new Error('Unsupported blockchain protocol')
    }
  }

  async generateBitcoinWallet(mnemonic, testnet) {
    const { address, privateKey, publicKey } = await deriveBitcoinWallet(
      mnemonic,
      testnet
    )

    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      protocol: Protocol.BITCOIN,
    })
  }

  async generateEthereumWallet(mnemonic, testnet) {
    const { address, privateKey, publicKey } = await deriveEthereumWallet(
      mnemonic,
      testnet
    )

    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      protocol: Protocol.ETHEREUM,
    })
  }

  async generateBscWallet(mnemonic, testnet) {
    const wallet = await this.generateEthereumWallet(mnemonic, testnet)
    wallet.protocol = Protocol.BSC
    return wallet
  }

  async generateBinancechainWallet(mnemonic, testnet) {
    const { address, privateKey, publicKey } = deriveBinancechainWallet(
      mnemonic,
      testnet
    )

    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      protocol: Protocol.BINANCECHAIN,
    })
  }

  async generateCeloWallet(mnemonic) {
    const { address, privateKey, publicKey } = await deriveCeloWallet(mnemonic)

    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      protocol: Protocol.CELO,
    })
  }

  async generateStellarWallet(mnemonic) {
    const { privateKey, publicKey } = deriveStellarWallet(mnemonic)

    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      protocol: Protocol.STELLAR,
    })
  }

  async generateRippleWallet(mnemonic) {
    const { address, privateKey, publicKey } = deriveRippleWallet(mnemonic)

    return new Wallet({
      mnemonic,
      privateKey,
      publicKey,
      address,
      protocol: Protocol.RIPPLE,
    })
  }
}

module.exports = Controller
