module.exports.getWalletControllerInstance = (config) => new Controller(config)
const { generateMnemonic, validateMnemonic } = require('bip39')
const { Wallet, WalletInfoResponse } = require('../entity')
const { makeRequest } = require('../../../services')
const Interface = require('./interface')
const {
  getBitcoinAddressFromPrivateKey,
  getBscAddressFromPrivateKey,
  getEthereumAddressFromPrivateKey,
  getCeloAddressFromPrivateKey,
  getStellarPublicKeyFromPrivateKey,
  getRippleAddressFromPrivateKey,
  getAvalancheAddressFromPrivateKey,
  getPolygonAddressFromPrivateKey,
  getSolanaAddressFromPrivateKey,
  deriveBitcoinWalletFromDerivationPath,
  deriveCeloWalletFromDerivationPath,
  deriveStellarWalletFromDerivationPath,
  deriveRippleWalletFromDerivationPath,
  deriveEthereumWalletFromDerivationPath,
  deriveBitcoinAddressFromXpub,
  deriveBscAddressFromXpub,
  deriveEthereumAddressFromXpub,
  deriveCeloAddressFromXpub,
  deriveHathorWalletFromDerivationPath,
  getHathorAddressFromPrivateKey,
  deriveHathorAddressFromXpub,
  deriveCardanoWalletFromDerivationPath,
  deriveCardanoAddressFromXpub,
  getCardanoAddressFromPrivateKey,
  deriveAvalancheAddressFromXpub,
  derivePolygonAddressFromXpub,
  deriveSolanaWalletFromDerivationPath,
  getChilizAddressFromPrivateKey,
  deriveChilizAddressFromXpub,
} = require('../../../services/wallet')
const { Protocol } = require('../../../services/blockchain/constants')
const {
  validateWalletInfo,
  validatePrivateKey,
  validateCardanoPrivateKey,
  validateWalletNft,
} = require('../../../services/validations')
const InvalidException = require('../../../errors/InvalidException')
const { isTestnet } = require('../../../services/utils')

class Controller extends Interface {
  /**
   * Generate random words
   * @param {number} strength
   * @returns {string} list of random words
   */
  generateRandomMnemonic(strength = 256) {
    return generateMnemonic(strength)
  }
  /**
   * Generate new wallet
   *
   * @param {object} args
   * @param {Protocol} args.protocol blockchain protocol to generate the wallet for
   * @param {string=} args.mnemonic mnemonic seed
   * @param {object=} args.derivation object with information to derive one wallet (BIP44 derivation path)
   * @param {number=} args.derivation.account account index to derive wallet
   * @param {number=} args.derivation.change change index to derive wallet
   * @param {number=} args.derivation.address address index to derive wallet
   * @returns {Promise<Wallet>}
   */
  async generateWallet({ protocol, mnemonic, derivation = { account: 0, change: 0 } }) {
    mnemonic = mnemonic ? mnemonic : this.generateRandomMnemonic()
    if (!validateMnemonic(mnemonic)) {
      throw new InvalidException('Invalid mnemonic')
    }
    const testnet = isTestnet(this.config.environment)

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
      case Protocol.HATHOR:
        return await this.generateHathorWallet({ mnemonic, derivation, testnet })
      case Protocol.CARDANO:
        return await this.generateCardanoWallet({ mnemonic, derivation, testnet })
      case Protocol.AVAXCCHAIN:
        return await this.generateAvalancheWallet({ mnemonic, derivation, testnet })
      case Protocol.CHILIZ:
        return await this.generateChilizWallet({ mnemonic, derivation, testnet })
      case Protocol.POLYGON:
        return await this.generatePolygonWallet({ mnemonic, derivation, testnet })
      case Protocol.SOLANA:
        return await this.generateSolanaWallet({ mnemonic, derivation, testnet })
      default:
        throw new InvalidException('Unsupported blockchain protocol')
    }
  }
  /**
   * Generate new wallet from private key
   *
   * @param {object} args
   * @param {string} args.privateKey private key string
   * @param {Protocol} args.protocol blockchain protocol
   * @returns {Promise<Wallet>}
   */
  async generateWalletFromPrivateKey({ privateKey, protocol }) {
    if (protocol === Protocol.CARDANO) {
      validateCardanoPrivateKey(privateKey)
    } else {
      validatePrivateKey(privateKey)
    }
    const testnet = isTestnet(this.config.environment)
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
      case Protocol.CARDANO:
        walletData.address = getCardanoAddressFromPrivateKey(privateKey, testnet)
        break
      case Protocol.AVAXCCHAIN:
        walletData.address = getAvalancheAddressFromPrivateKey(privateKey)
        break
      case Protocol.CHILIZ:
        walletData.address = getChilizAddressFromPrivateKey(privateKey)
        break
      case Protocol.POLYGON:
        walletData.address = getPolygonAddressFromPrivateKey(privateKey)
        break
      case Protocol.SOLANA:
        walletData.address = getSolanaAddressFromPrivateKey(privateKey)
        break
      default:
        throw new InvalidException('Unsupported blockchain protocol')
    }
    return new Wallet(walletData)
  }
  /**
   * Generate wallet address deriving from the xpub
   * @param {object} input
   * @param {string} input.xpub extended public key string
   * @param {Protocol} input.protocol blockchain protocol
   * @param {number=} input.address address index number to derive the wallet address from
   */
  async generateWalletAddressFromXpub({ xpub, protocol, address }) {
    const testnet = isTestnet(this.config.environment)
    let walletAddress
    switch (protocol) {
      case Protocol.BITCOIN:
        walletAddress = deriveBitcoinAddressFromXpub(xpub, testnet, { address })
        break
      case Protocol.BSC:
        walletAddress = deriveBscAddressFromXpub(xpub, { address })
        break
      case Protocol.ETHEREUM:
        walletAddress = deriveEthereumAddressFromXpub(xpub, { address })
        break
      case Protocol.CELO:
        walletAddress = deriveCeloAddressFromXpub(xpub, { address })
        break
      case Protocol.HATHOR:
        walletAddress = deriveHathorAddressFromXpub(xpub, testnet, { address })
        break
      case Protocol.CARDANO:
        walletAddress = deriveCardanoAddressFromXpub(xpub, testnet, { address })
        break
      case Protocol.AVAXCCHAIN:
        walletAddress = deriveAvalancheAddressFromXpub(xpub, { address })
        break
      case Protocol.CHILIZ:
        walletAddress = deriveChilizAddressFromXpub(xpub, {address})
        break
      case Protocol.POLYGON:
        walletAddress = derivePolygonAddressFromXpub(xpub, { address })
        break
      default:
        throw new InvalidException('Unsupported blockchain protocol')
    }
    return walletAddress
  }

  async generateBitcoinWallet({ mnemonic, derivation, testnet }) {
    const { address, privateKey, publicKey, xpub } = await deriveBitcoinWalletFromDerivationPath(
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
      xpub,
    })
  }

  async generateEthereumWallet({ mnemonic, derivation, testnet }) {
    const { address, privateKey, publicKey, xpub } = await deriveEthereumWalletFromDerivationPath(mnemonic, derivation)
    return new Wallet({
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.ETHEREUM,
      xpub,
    })
  }

  async generateBscWallet({ mnemonic, derivation, testnet }) {
    const wallet = await this.generateEthereumWallet({ mnemonic, derivation, testnet })
    wallet.protocol = Protocol.BSC
    return wallet
  }

  async generateCeloWallet({ mnemonic, derivation, testnet }) {
    const { address, privateKey, publicKey, xpub } = await deriveCeloWalletFromDerivationPath(mnemonic, derivation)
    return new Wallet({
      privateKey,
      publicKey,
      address,
      testnet,
      protocol: Protocol.CELO,
      xpub,
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

  async generateHathorWallet({ mnemonic, derivation, testnet }) {
    const { address, privateKey, publicKey, xpub } = await deriveHathorWalletFromDerivationPath(
      mnemonic,
      testnet,
      derivation
    )
    return new Wallet({
      privateKey,
      publicKey,
      address,
      testnet,
      xpub,
      protocol: Protocol.HATHOR,
    })
  }

  async generateCardanoWallet({ mnemonic, derivation, testnet }) {
    const { address, privateKey, publicKey, xpub } = await deriveCardanoWalletFromDerivationPath(
      mnemonic,
      testnet,
      derivation
    )
    return new Wallet({
      privateKey,
      publicKey,
      xpub,
      address,
      testnet,
      protocol: Protocol.CARDANO,
    })
  }

  async generateAvalancheWallet({ mnemonic, derivation, testnet }) {
    const wallet = await this.generateEthereumWallet({ mnemonic, derivation, testnet })
    wallet.protocol = Protocol.AVAXCCHAIN
    return wallet
  }

  async generateChilizWallet({ mnemonic, derivation, testnet }) {
    const wallet = await this.generateEthereumWallet({ mnemonic, derivation, testnet })
    wallet.protocol = Protocol.CHILIZ
    return wallet
  }

  async generatePolygonWallet({ mnemonic, derivation, testnet }) {
    const wallet = await this.generateEthereumWallet({ mnemonic, derivation, testnet })
    wallet.protocol = Protocol.POLYGON
    return wallet
  }

  async generateSolanaWallet({ mnemonic, derivation, testnet }) {
    const { address, privateKey, publicKey, xpub } = await deriveSolanaWalletFromDerivationPath(mnemonic, derivation)
    return new Wallet({
      privateKey,
      publicKey,
      xpub,
      address,
      testnet,
      protocol: Protocol.SOLANA,
    })
  }

  /**
   * Get wallet information from blockchain
   *
   * @param {object} input
   * @param {string} input.address wallet address or public key
   * @param {Protocol} input.protocol blockchain protocol
   * @param {string[]=} input.tokenAddresses array of token addresses to fetch balance from
   * @returns {Promise<WalletInfoResponse>}
   */
  async getWalletInfo(input) {
    validateWalletInfo(input)
    const { address, protocol, tokenAddresses } = input
    const qs = [`protocol=${protocol}`]
    if (tokenAddresses) {
      for (const token of tokenAddresses) {
        qs.push(`tokenAddresses[]=${token}`)
      }
    }
    return new WalletInfoResponse(
      await makeRequest({ method: 'get', url: `/wallet/${address}/info?${qs.join('&')}`, config: this.config })
    )
  }
  /**
   * Get nfts that belong to a certain wallet
   *
   * @param {object} input
   * @param {string} input.address wallet address or public key
   * @param {Protocol} input.protocol blockchain protocol
   * @returns {Promise<any>}
   */
  async getWalletNft(input) {
    validateWalletNft(input)
    const { address, protocol } = input
    const qs = [`protocol=${protocol}`]
    return new WalletInfoResponse(
      await makeRequest({ method: 'get', url: `/wallet/${address}/nft?${qs.join('&')}`, config: this.config })
    )
  }
}

module.exports.WalletController = Controller
