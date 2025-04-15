const { getWebhooksControllerInstance } = require('./features/webhooks/controller')
const { getWalletControllerInstance } = require('./features/wallet/controller')
const { getPricesControllerInstance } = require('./features/prices/controller')
const { getTransactionControllerInstance } = require('./features/transaction/controller')
const { getStakingControllerInstance } = require('./features/staking/controller')
const { getSwapControllerInstance } = require('./features/swap/controller')
const { getTokenControllerInstance } = require('./features/token/controller')
const { getNftControllerInstance } = require('./features/nft/controller')
const { getContractControllerInstance } = require('./features/contract/controller')
const { getLootBoxControllerInstance } = require('./features/lootBox/controller')
const { getChainlinkController } = require("./features/chainlink/controller")
const { Protocol } = require('./services/blockchain/constants')
const { GenericException } = require('./errors')
const { getKmsControllerInstance } = require('./features/kms/controller')
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
