const WebhooksController = require('./src/features/webhooks/controller')
const WalletController = require('./src/features/wallet/controller')
const PricesController = require('./src/features/prices/controller')
const TransactionController = require('./src/features/transaction/controller')
const ExternalKeysController = require('./src/features/external-keys/controller')
/**
 * @typedef {object} AzureConfig
 * @property {string} keyVaultUrl
 * @property {string} secretName
 * @property {string} secretVersion
 * @property {string} tenantId
 * @property {string} clientId
 * @property {string} clientSecret
 * 
 * @typedef {object} Config
 * @property {string} environment
 * @property {string} apiKey
 * @property {AzureConfig} azureConfig
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
   * Method to get a controller to manipulate prices
   *
   * @returns PricesController instance
   */
  getPricesController() {
    return new PricesController(this.config)
  }
  
  /**
   * Method to get a controller to retrieve keys from external HSMs
   *
   * @returns ExternalKeysController instance
   */
  getExternalKeysController() {
    return new ExternalKeysController(this.config)
  }
}

module.exports = CryptumSDK
