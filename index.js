const ApiKeyController = require('./src/features/api-keys/controller')
const WebhooksController = require('./src/features/webhooks/controller')
const WalletController = require('./src/features/wallet/controller')
const PricesController = require('./src/features/prices/controller')
const TransactionController = require('./src/features/transaction/controller')
const AccountController = require('./src/features/account/controller')

class CryptumSDK {
  constructor({ config, apiKey }) {
    this.config = config
    this.apiKey = apiKey
  }

  /**
   * Method to get an controller to manipulate a api keys using cryptum.
   *
   * @returns an ApiKeyController instance class to manipulate
   */
  getApiKeyController() {
    return new ApiKeyController(this.config)
  }

  /**
   * Method to get an controller to create, get and delete webhooks
   *
   * @returns an WebhooksController instance class to manipulate
   */
  getWebhooksController() {
    return new WebhooksController(this.config, this.apiKey)
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
   * Method to get a controller to manipulate prices
   *
   * @returns PricesController instance
   */
  getPricesController() {
    return new PricesController(this.config)
  }

  /**
   * Method to get a controller to manipulate accounts
   *
   * @returns AccountController instance
   */
   getAccountController() {
    return new AccountController(this.config)
  }
}

module.exports = CryptumSDK
