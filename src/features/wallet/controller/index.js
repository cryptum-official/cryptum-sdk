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
  deriveAvalancheWalletFromDerivationPath,
  deriveAvalancheAddressFromXpub,
  deriveSolanaWalletFromDerivationPath,
} = require('../../../services/wallet')
const { Protocol } = require('../../../services/blockchain/constants')
const { validateWalletInfo, validatePrivateKey, validateCardanoPrivateKey } = require('../../../services/validations')
const InvalidException = require('../../../../errors/InvalidException')

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
   * @param {boolean=} args.testnet true for testnet and false for mainnet
   * @param {string=} args.mnemonic mnemonic seed
   * @param {object=} args.derivation object with information to derive one wallet (BIP44 derivation path)
   * @param {number=} args.derivation.account account index to derive wallet
   * @param {number=} args.derivation.change change index to derive wallet
   * @param {number=} args.derivation.address address index to derive wallet
   * @returns {Promise<Wallet>}
   */
  async generateWallet({ protocol, mnemonic, testnet, derivation = { account: 0, change: 0 } }) {
    mnemonic = mnemonic ? mnemonic : this.generateRandomMnemonic()
    if (!validateMnemonic(mnemonic)) {
      throw new InvalidException('Invalid mnemonic')
    }
    testnet = testnet !== undefined ? testnet : this.config.environment === 'development'

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
   * @param {boolean=} args.testnet true for testnet and false for mainnet
   * @returns {Promise<Wallet>}
   */
  async generateWalletFromPrivateKey({ privateKey, protocol, testnet }) {
    if (protocol === Protocol.CARDANO) {
      validateCardanoPrivateKey(privateKey)
    } else {
      validatePrivateKey(privateKey)
    }
    testnet = testnet = testnet !== undefined ? testnet : this.config.environment === 'development'
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
      case Protocol.HATHOR:
        walletData.address = getHathorAddressFromPrivateKey(privateKey, testnet)
        break
      case Protocol.CARDANO:
        walletData.address = getCardanoAddressFromPrivateKey(privateKey, testnet)
        break
      case Protocol.AVAXCCHAIN:
        walletData.address = getAvalancheAddressFromPrivateKey(privateKey)
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
   * @param {boolean=} input.testnet testnet
   * @param {number=} input.address address index number to derive the wallet address from
   */
  async generateWalletAddressFromXpub({ xpub, protocol, testnet, address }) {
    testnet = testnet !== undefined ? testnet : this.config.environment === 'development'
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
   * Get wallet transactions
   * @param {{ status?: string; limit?: number=; offset?: number=; }} input
   * @returns {Promise<import('../entity').WalletTransaction[]>}
   */
  async getWalletTransactions({ status, limit, offset } = {}) {
    const qs = [
      `limit=${limit !== undefined ? limit : 100}&offset=${offset !== undefined ? offset : 0}&status=${
        status !== undefined ? status : 'PENDING'
      }`,
    ]
    return makeRequest({ method: 'get', url: `/wallet/transaction?${qs}`, config: this.config })
  }
  /**
   * Get wallet transaction id
   * @param {string} id transaction id
   * @returns {Promise<import('../entity').WalletTransaction>}
   */
  async getWalletTransactionById(id) {
    return makeRequest({ method: 'get', url: `/wallet/transaction/${id}`, config: this.config })
  }
  /**
   * Update status of wallet transaction
   * @param {string} id transaction id
   * @param {string} status transaction status
   * @param {string} hash transaction hash
   * @returns {Promise<{ id: string }>}
   */
  async updateWalletTransactionById(id, status, hash) {
    return makeRequest({ method: 'put', url: `/wallet/transaction/${id}`, body: { status, hash }, config: this.config })
  }
  /**
   * Delete wallet transaction id
   * @param {string} id transaction id
   * @returns {Promise<{ id: string }>}
   */
  async deleteWalletTransactionById(id) {
    return makeRequest({ method: 'delete', url: `/wallet/transaction/${id}`, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionStellarTrustline} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createStellarTrustlineTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/trustline/stellar`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionRippleTrustline} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createRippleTrustlineTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/trustline/ripple`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionStellarTransfer} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createStellarTransferTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/transfer/stellar`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionRippleTransfer} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createRippleTransferTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/transfer/ripple`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionBitcoinTransfer} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createBitcoinTransferTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/transfer/bitcoin`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionCeloTransfer} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createCeloTransferTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/transfer/celo`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionEthereumTransfer} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createEthereumTransferTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/transfer/ethereum`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionEthereumTransfer} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createBscTransferTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/transfer/bsc`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionHathorTransfer} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createHathorTransferTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/transfer/hathor`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionCardanoTransfer} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createCardanoTransferTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/transfer/cardano`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionEthereumSmartContractSend} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createEthereumSmartContractCallTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/smartcontract/send/ethereum`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionEthereumSmartContractSend} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createBscSmartContractCallTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/smartcontract/send/bsc`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionEthereumSmartContractDeploy} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createEthereumSmartContractDeployTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/smartcontract/deploy/ethereum`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionEthereumSmartContractDeploy} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createBscSmartContractDeployTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/smartcontract/deploy/bsc`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionCeloSmartContractSend} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createCeloSmartContractCallTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/smartcontract/send/celo`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionCeloSmartContractDeploy} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createCeloSmartContractDeployTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/smartcontract/deploy/celo`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionEthereumTokenDeploy} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createEthereumTokenDeployTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/token/deploy/ethereum`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionEthereumTokenDeploy} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createBscTokenDeployTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/token/deploy/bsc`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionCeloTokenDeploy} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createCeloTokenDeployTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/token/deploy/celo`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionHathorTokenDeploy} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createHathorTokenDeployTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/token/deploy/hathor`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionHathorTokenMint} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createHathorMintTokenTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/token/mint/hathor`, body: tx, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').WalletTransactionHathorTokenMelt} tx transaction input
   * @returns {Promise<{ tx: string }>}
   */
  async createHathorMeltTokenTransaction(tx) {
    return makeRequest({ method: 'post', url: `/wallet/token/melt/hathor`, body: tx, config: this.config })
  }
}

module.exports = Controller
