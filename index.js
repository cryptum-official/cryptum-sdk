const { getWebhooksControllerInstance } = require('./src/features/webhooks/controller')
const { getWalletControllerInstance } = require('./src/features/wallet/controller')
const { getPricesControllerInstance } = require('./src/features/prices/controller')
const { getTransactionControllerInstance } = require('./src/features/transaction/controller')
const { getStakingControllerInstance } = require('./src/features/staking/controller')
const { getSwapControllerInstance } = require('./src/features/swap/controller')
const { getTokenControllerInstance } = require('./src/features/token/controller')
const { getNftControllerInstance } = require('./src/features/nft/controller')
const { getContractControllerInstance } = require('./src/features/contract/controller')
const { getLootBoxControllerInstance } = require('./src/features/lootBox/controller')
const { getChainlinkController } = require("./src/features/chainlink/controller")
const { Protocol } = require('./src/services/blockchain/constants')
const { GenericException } = require('./src/errors')
const { getKmsControllerInstance } = require('./src/features/kms/controller')
/**
 * @typedef {object} Config
 * @property {'testnet'|'mainnet'} environment
 * @property {string} apiKey
 */

class CryptumSDK {
  /**
   *
   * @param {Config} config
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Method to get an controller to create, get and delete webhooks
   *
   * @returns an WebhooksController instance class to manipulate
   */
  get webhook() { return this.getWebhooksController() }
  getWebhooksController() {
    return getWebhooksControllerInstance(this.config)
  }

  /**
   * Method to get a controller to manipulate wallets
   *
   * @returns WalletController instance
   */
  get wallet() { return this.getWalletController() }
  getWalletController() {
    return getWalletControllerInstance(this.config)
  }

  /**
   * Method to get a controller to manipulate transactions
   *
   * @returns TransactionController instance
   */
  get transaction() { return this.getTransactionController() }
  getTransactionController() {
    return getTransactionControllerInstance(this.config)
  }

  get staking() { return getStakingControllerInstance(this.config) }
  /**
   * Method to get a controller to manipulate transactions
   * @param {Object} args
   * @param {Protocol} args.protocol
   * @returns TransactionController instance
   */
  getStakingController({ protocol }) {
    const controller = getStakingControllerInstance(this.config)
    switch (protocol) {
      case Protocol.CELO:
        return controller.celo
      default:
        throw new GenericException('Invalid protocol')
    }
  }

  /**
   * Method to get a controller to manipulate prices
   *
   * @returns PricesController instance
   */
  get prices() { return this.getPricesController() }
  getPricesController() {
    return getPricesControllerInstance(this.config)
  }

  /**
   * Method to get a controller to manipulate swap
   *
   * @returns SwapController instance
   */
  get swap() { return this.getSwapController() }
  getSwapController() {
    return getSwapControllerInstance(this.config)
  }

  get token() { return this.getTokenController() }
  getTokenController() {
    return getTokenControllerInstance(this.config)
  }

  get nft() { return this.getNftController() }
  getNftController() {
    return getNftControllerInstance(this.config)
  }

  get contract() { return this.getContractController() }
  getContractController() {
    return getContractControllerInstance(this.config)
  }

  get lootBox() { return this.getLootBoxController() }
  getLootBoxController() {
    return getLootBoxControllerInstance(this.config)
  }

  get kms() { return this.getKmsController() }
  getKmsController() {
    return getKmsControllerInstance(this.config)
  }

  get chainlink() { return this.getChainlinkController() }
  getChainlinkController() {
    return getChainlinkController(this.config)
  }
}

module.exports = CryptumSDK
