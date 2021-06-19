const { NotImplementedException } = require('../../../../errors')
const Wallet = require('../entity')
const { Protocol } = require('../../../services/blockchain/constants')

class Interface {
  /**
   * Method to configure required adapters and general configs
   *
   * @param {Object} config an object with this data: { enviroment: 'development'/'production' }
   */
  constructor(config) {
    this.config = config
  }
  /**
   * Generate new random wallet
   * @param {object} args
   * @param {Protocol} args.protocol blockchain protocol to generate the wallet for
   * @param {boolean?} args.testnet true for testnet and false for mainnet
   * @param {string?} args.mnemonic mnemonic seed
   * @returns {Promise<Wallet>}
   */
  async generateWallet({ protocol, testnet = true, mnemonic = '' }) {
    throw new NotImplementedException()
  }
  /**
   * Generate new bitcoin wallet
   * @param {string} mnemonic mnemonic string
   * @param {boolean} testnet true for testnet and false for mainnet
   * @returns {Promise<Wallet>}
   */
  async generateBitcoinWallet(mnemonic, testnet) {
    throw new NotImplementedException()
  }
  /**
   * Generate new ethereum wallet
   * @param {string} mnemonic mnemonic string
   * @param {boolean} testnet true for testnet and false for mainnet
   * @returns {Promise<Wallet>}
   */
  async generateEthereumWallet(mnemonic, testnet) {
    throw new NotImplementedException()
  }
  /**
   * Generate new binance smart chain wallet
   * @param {string} mnemonic mnemonic string
   * @param {boolean} testnet true for testnet and false for mainnet
   * @returns {Promise<Wallet>}
   */
  async generateBscWallet(mnemonic, testnet) {
    throw new NotImplementedException()
  }
  /**
   * Generate new binance chain wallet
   * @param {string} mnemonic mnemonic string
   * @param {boolean} testnet true for testnet and false for mainnet
   * @returns {Promise<Wallet>}
   */
  async generateBinancechainWallet(mnemonic, testnet) {
    throw new NotImplementedException()
  }
  /**
   * Generate new celo wallet
   * @param {string} mnemonic mnemonic string
   * @returns {Promise<Wallet>}
   */
  async generateCeloWallet(mnemonic) {
    throw new NotImplementedException()
  }
  /**
   * Generate new stellar wallet
   * @param {string} mnemonic mnemonic string
   * @returns {Promise<Wallet>}
   */
  async generateStellarWallet(mnemonic) {
    throw new NotImplementedException()
  }
  /**
   * Generate new ripple wallet
   * @param {string} mnemonic mnemonic string
   * @returns {Promise<Wallet>}
   */
  async generateRippleWallet(mnemonic) {
    throw new NotImplementedException()
  }
  /**
   * Get wallet information from blockchain
   * @param {object} args
   * @param {string} args.address
   * @param {Protocol} args.protocol
   * @returns {Promise<any>}
   */
  async getWalletInfo({ address, protocol }) {
    throw new NotImplementedException()
  }
  /**
   * Create trustline signed transaction
   * @param {object} args
   * @param {Wallet} args.wallet wallet to make the transfer from
   * @param {string} args.assetSymbol asset symbol to transfer
   * @param {string?} args.issuer asset issuer to create the trustline from
   * @param {string} args.limit limit amount
   * @param {Protocol} args.protocol protocol
   * @param {string?} args.memo memo string
   * @param {string?} args.fee transaction fee in small unit
   * @param {boolean?} args.testnet
   * @returns {Promise<string>}
   */
  async createTrustlineTransaction({
    wallet,
    assetSymbol,
    issuer,
    fee,
    limit,
    memo,
    protocol,
    testnet
  }) {
    throw new NotImplementedException()
  }
  /**
   * Create transfer signed transaction
   * @param {object} args
   * @param {Wallet} args.wallet wallet to make the transfer from
   * @param {string} args.assetSymbol asset symbol to transfer
   * @param {string?} args.issuer asset issuer if this is a custom asset
   * @param {string} args.amount amount to transfer
   * @param {string} args.destination destination address
   * @param {Protocol} args.protocol protocol
   * @param {string?} args.memo memo string
   * @param {string?} args.fee transaction fee in small unit
   * @param {string?} args.startingBalance starting amount to create account in blockchain (stellar only)
   * @param {boolean?} args.testnet
   * @returns {Promise<string>}
   */
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
    testnet
  }) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
