const { getApiMethod, handleRequestError } = require('../../../services')
const Interface = require('./interface')
const AzureKeyVaultEntity = require('../entity/azure-key-vault')
const requests = require('./requests.json')
const {
  InvalidTypeException,
} = require('../../../../errors')

class Controller extends Interface {
  /**
   * Async method to authenticate on Azure
   *
   * @param {import('../../../..').AzureConfig} azureConfig
   */
  async azureAuthenticate({
    tenantId, clientId, clientSecret,
  }) {
    try {
      if (!tenantId || typeof tenantId !== 'string') throw new InvalidTypeException('tenantId', 'string')
      if (!clientId || typeof clientId !== 'string') throw new InvalidTypeException('clientId', 'string')
      if (!clientSecret || typeof clientSecret !== 'string') throw new InvalidTypeException('clientSecret', 'string')

      const apiRequest = getApiMethod({
        requests,
        key: 'azureAuthenticate',
        config: {
          ...this.config, baseURL: 'https://login.microsoftonline.com',
        },
      })

      const body = `grant_type=client_credentials&scope=https://vault.azure.net/.default&client_id=${clientId}&client_secret=${clientSecret}`

      const response = await apiRequest(
        `/${tenantId}/oauth2/v2.0/token`,
        body,
      )

      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  }

  /**
   * Async method to reuse Azure instance auth token or get new one
   *
   * @param {import('../../../..').AzureConfig} azureConfig
   */
  async getAzureToken() {
    if (this.azureToken && new Date().getTime() > this.azureTokenExp) {
      return this.azureToken
    }

    const authResponse = await this.azureAuthenticate(this.config.azureConfig)

    this.azureToken = authResponse.access_token
    this.azureTokenExp = authResponse.expires_on
  }

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

      await this.getAzureToken()

      const response = await apiRequest(
        `/secrets/${secretName}/${secretVersion}?api-version=7.1`,
        { headers: { Authorization: `Bearer ${this.azureToken}` } },
      )

      return new AzureKeyVaultEntity(response.data)
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
