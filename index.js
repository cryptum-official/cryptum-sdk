const { WebhooksController } = require('./src/features/webhooks/controller')
const { WalletController } = require('./src/features/wallet/controller')
const { PricesController } = require('./src/features/prices/controller')
const { TransactionController } = require('./src/features/transaction/controller')
const { StakingController } = require('./src/features/staking/controller')
const { SwapController } = require('./src/features/swap/controller')
const { TokenController } = require('./src/features/token/controller')
const { NftController } = require('./src/features/nft/controller')
const { Protocol } = require('./src/services/blockchain/constants')
const { GenericException } = require('./src/errors')
const { ContractController } = require('./src/features/contract/controller')
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
    return new WebhooksController(this.config)
  }

  /**
   * Method to get a controller to manipulate wallets
   *
   * @returns WalletController instance
   */
  get wallet() { return this.getWalletController() }
  getWalletController() {
    return new WalletController(this.config)
  }

  /**
   * Method to get a controller to manipulate transactions
   *
   * @returns TransactionController instance
   */
  get transaction() { return this.getTransactionController() }
  getTransactionController() {
    return new TransactionController(this.config)
  }

  get staking() { return new StakingController(this.config) }
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
    return new PricesController(this.config)
  }

  /**
   * Method to get a controller to manipulate swap
   *
   * @returns SwapController instance
   */
  get swap() { return this.getSwapController() }
  getSwapController() {
    return new SwapController(this.config)
  }

  get token() { return this.getTokenController() }
  getTokenController() {
    return new TokenController(this.config)
  }

  get nft() { return this.getNftController() }
  getNftController() {
    return new NftController(this.config)
  }

  get contract() { return this.getContractController() }
  getContractController() {
    return new ContractController(this.config)
  }

  get kms() { return this.getKmsController() }
  getKmsController() {
    return getKmsControllerInstance(this.config)
  }
}

module.exports = CryptumSDK
