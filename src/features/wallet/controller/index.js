const { generateMnemonic } = require('bip39')
const Wallet = require('../entity')
const {
  getApiMethod,
  mountHeaders,
  handleRequestError,
} = require('../../../services')
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
} = require('../../../services/wallet')
const { Protocol } = require('../../../services/blockchain')
const {
  buildStellarTrustlineTransaction,
  buildRippleTrustlineTransaction,
  buildTrustlineTransaction,
} = require('../../../services/blockchain/trustline')
const {
  buildTransferTransaction,
} = require('../../../services/blockchain/transfer')

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
    const { address, privateKey, publicKey } = deriveBinancechainWallet(
      mnemonic,
      testnet
    )

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
      const response = await apiRequest(
        `${requests.getWalletInfo.url}/${address}/info?protocol=${protocol}`,
        {
          headers,
        }
      )
      return response.data
    } catch (error) {
      console.log(error)
      handleRequestError(error)
    }
  }

  async createTrustlineTransaction({
    wallet,
    assetSymbol,
    issuer,
    fee,
    limit,
    memo,
    protocol,
  }) {
    const address =
      protocol === Protocol.STELLAR ? wallet.publicKey : wallet.address

    const info = await this.getWalletInfo({
      address,
      protocol,
    })

    let sequence, maxLedgerVersion
    switch (protocol) {
      case Protocol.STELLAR:
        sequence = info.sequence
        break
      case Protocol.RIPPLE:
        sequence = info.account_data.Sequence
        maxLedgerVersion = info.ledger_current_index + 10
        break
    }

    return await buildTrustlineTransaction({
      wallet,
      assetSymbol,
      issuer,
      limit,
      memo,
      fee,
      protocol,
      sequence,
      maxLedgerVersion,
    })
  }

  async createTransferTransaction({
    wallet,
    assetSymbol,
    issuer,
    amount,
    destination,
    memo,
    fee,
    protocol,
    startingBalance,
  }) {
    const address =
      protocol === Protocol.STELLAR ? wallet.publicKey : wallet.address

    const info = await this.getWalletInfo({
      address,
      protocol,
    })

    let sequence, maxLedgerVersion
    switch (protocol) {
      case Protocol.STELLAR:
        sequence = info.sequence
        break
      case Protocol.RIPPLE:
        sequence = info.account_data.Sequence
        maxLedgerVersion = info.ledger_current_index + 10
        break
    }

    return await buildTransferTransaction({
      wallet,
      assetSymbol,
      issuer,
      amount,
      destination,
      memo,
      fee,
      protocol,
      sequence,
      maxLedgerVersion,
      startingBalance,
    })
  }
}

module.exports = Controller
