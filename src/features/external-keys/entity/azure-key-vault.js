/**
 * @typedef {object} AzureKeyVaultAttributes
 * @property {boolean} enabled
 * @property {number} created
 * @property {number} updated
 * @property {string} recoveryLevel
 * @property {string} recoverableDays
 * 
 * @typedef {object} AzureKeyVaultResponse
 * @property {string} value
 * @property {string} id
 * @property {AzureKeyVaultAttributes} attributes
 */

module.exports = class AzureKeyVault {
  /**
   * Creates an instance of AzureKeyVault response
   *
   * @param {AzureKeyVaultResponse}
   */
  constructor({ value, id, attributes }) {
    this.value = value
    this.info = {
      origin: id,
      ...attributes,
    }
  }
}
