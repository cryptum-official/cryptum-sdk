const WebhooksController = require('./src/features/webhooks/controller')
const WalletController = require('./src/features/wallet/controller')
const PricesController = require('./src/features/prices/controller')
const TransactionController = require('./src/features/transaction/controller')
const StakingController = require('./src/features/staking/controller')
const SwapController = require('./src/features/swap/controller')
const InfoController = require('./src/features/info/controller')
const { Protocol } = require('./src/services/blockchain/constants')
const { GenericException } = require('./errors')
/**
 * @typedef {object} Config
 * @property {string} environment
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
  getWebhooksController() {
    return new WebhooksController(this.config)
  }

  /**
   * Method to get a controller to manipulate wallets
   *
   * @returns WalletController instance
   */
  getWalletController() {
    return new WalletController(this.config)
  }

  /**
   * Method to get a controller to manipulate transactions
   *
   * @returns TransactionController instance
   */
  getTransactionController() {
    return new TransactionController(this.config)
  }
  /**
   * Method to get a controller to manipulate transactions
   * @param {Object} args
   * @param {Protocol} args.protocol
   * @returns TransactionController instance
   */
  getStakingController({ protocol }) {
    const controller = new StakingController(this.config)
    switch (protocol) {
      case Protocol.CELO:
        return controller.celo()
      default:
        throw new GenericException('Invalid protocol')
    }
  }

  /**
   * Method to get a controller to manipulate prices
   *
   * @returns PricesController instance
   */
  getPricesController() {
    return new PricesController(this.config)
  }


  /**
   * Method to get a controller to manipulate swap
   *
   * @returns SwapController instance
   */
  getSwapController() {
    return new SwapController(this.config)
  }
  /**
   * Method to get a controller to manipulate swap
   *
   * @returns InfoController instance
   */
  getInfoController() {
    return new InfoController(this.config)
  }
}

module.exports = CryptumSDK
