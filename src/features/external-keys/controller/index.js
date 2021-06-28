const { getApiMethod, handleRequestError } = require('../../../services')
const Interface = require('./interface')
const requests = require('./requests.json');
const {
  InvalidTypeException,
} = require('../../../../errors')

class Controller extends Interface {
  /**
   * Async method to retrieve secret from Azure Key Vault
   *
   * @param {import('../../../..').AzureConfig} azureConfig
   */
  async getAzureSecret({
    keyVaultUrl = this.config.azureConfig.keyVaultUrl,
    secretName = this.config.azureConfig.secretName,
    secretVersion = this.config.azureConfig.secretVersion,
  }) {
    try {
      if (!keyVaultUrl || typeof keyVaultUrl !== 'string') throw new InvalidTypeException('keyVaultUrl', 'string')
      if (!secretName || typeof secretName !== 'string') throw new InvalidTypeException('secretName', 'string')
      if (!secretVersion || typeof secretVersion !== 'string') throw new InvalidTypeException('secretVersion', 'string')

      const apiRequest = getApiMethod({
        requests,
        key: 'getAzureSecret',
        config: {
          ...this.config, baseURL: `https://${keyVaultUrl}`,
        },
      })

      const response = await apiRequest(
        `/secrets/${secretName}/${secretVersion}?api-version=7.1`,
        {},
      )

      return response.data.value;
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
