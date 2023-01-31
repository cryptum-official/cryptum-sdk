module.exports.getKmsControllerInstance = (config) => new Controller(config)

const { makeRequest } = require('../../../services')
const Interface = require('./interface')

class Controller extends Interface {

  /**
 * Get wallet transactions
 * @param {{ status?: string; limit?: number=; offset?: number=; }} input
 * @returns {Promise<import('../entity').Transaction[]>}
 */
  async getTransactions({ status, limit, offset } = {}) {
    const qs = [
      `limit=${limit !== undefined ? limit : 100}`,
      `offset=${offset !== undefined ? offset : 0}`,
      `status=${status !== undefined ? status : 'PENDING'}`,
    ].join('&')
    return makeRequest({ method: 'get', url: `/kms/transactions?${qs}`, config: this.config })
  }
  /**
   * Get wallet transaction id
   * @param {string} id transaction id
   * @returns {Promise<import('../entity').Transaction>}
   */
  async getTransactionById(id) {
    return makeRequest({ method: 'get', url: `/kms/transaction/${id}`, config: this.config })
  }
  /**
   * Update status of wallet transaction
   * @param {string} id transaction id
   * @param {string} status transaction status
   * @param {string} hash transaction hash
   * @returns {Promise<{ id: string }>}
   */
  async updateTransactionById(id, status, hash) {
    return makeRequest({ method: 'put', url: `/kms/transaction/${id}`, body: { status, hash }, config: this.config })
  }
  /**
   * Delete wallet transaction id
   * @param {string} id transaction id
   * @returns {Promise<{ id: string }>}
   */
  async deleteTransactionById(id) {
    return makeRequest({ method: 'delete', url: `/kms/transaction/${id}`, config: this.config })
  }

  /**
   * @param {import('../entity').SetTrustlineInput} input transaction input
   * @returns {Promise<{}>}
   */
  async setTrustline(input) {
    const protocol = input.protocol;
    delete input['protocol'];
    return makeRequest({ method: 'post', url: `/kms/token/trustline?protocol=${protocol}`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').TokenTransferInput} input transaction input
   * @returns {Promise<{}>}
   */
  async transferTokenTransaction(input) {
    const protocol = input.protocol;
    delete input['protocol'];
    return makeRequest({ method: 'post', url: `/kms/token/transfer?protocol=${protocol}`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').NftTransferInput} input transaction input
   * @returns {Promise<{}>}
   */
  async transferNftTransaction(input) {
    const protocol = input.protocol;
    delete input['protocol'];
    return makeRequest({ method: 'post', url: `/kms/nft/transfer?protocol=${protocol}`, body: input, config: this.config })
  }

  /**
   * @param {import('../entity').SmartContractDeployInput} input transaction input
   * @returns {Promise<{}>}
   */
  async deploySmartContractTransaction(input) {
    const protocol = input.protocol;
    delete input['protocol'];
    return makeRequest({ method: 'post', url: `/kms/contract/deploy?protocol=${protocol}`, body: input, config: this.config })
  }
  /**
   * @param {import('../entity').SmartContractTransactionInput} input transaction input
   * @returns {Promise<{}>}
   */
  async createSmartContractTransaction(input) {
    const protocol = input.protocol;
    delete input['protocol'];
    return makeRequest({ method: 'post', url: `/kms/contract/transaction?protocol=${protocol}`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').TokenCreationInput} input transaction input
   * @returns {Promise<{}>}
   */
  async deployTokenTransaction(input) {
    const protocol = input.protocol;
    delete input['protocol'];
    return makeRequest({ method: 'post', url: `/kms/token/create?protocol=${protocol}`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').TokenMintInput} input transaction input
   * @returns {Promise<{}>}
   */
  async mintTokenTransaction(input) {
    const protocol = input.protocol;
    delete input['protocol'];
    return makeRequest({ method: 'post', url: `/kms/token/mint?protocol=${protocol}`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').TokenBurnInput} input transaction input
   * @returns {Promise<{}>}
   */
  async burnTokenTransaction(input) {
    const protocol = input.protocol;
    delete input['protocol'];
    return makeRequest({ method: 'post', url: `/kms/token/burn?protocol=${protocol}`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').NftCreationInput} input transaction input
   * @returns {Promise<{}>}
   */
  async deployNftTransaction(input) {
    const protocol = input.protocol;
    delete input['protocol'];
    return makeRequest({ method: 'post', url: `/kms/nft/create?protocol=${protocol}`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').NftMintInput} input transaction input
   * @returns {Promise<{}>}
   */
  async mintNftTransaction(input) {
    const protocol = input.protocol;
    delete input['protocol'];
    return makeRequest({ method: 'post', url: `/kms/nft/mint?protocol=${protocol}`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').NftBurnInput} input transaction input
   * @returns {Promise<{}>}
   */
  async burnNftTransaction(input) {
    const protocol = input.protocol;
    delete input['protocol'];
    return makeRequest({ method: 'post', url: `/kms/nft/burn?protocol=${protocol}`, body: input, config: this.config })
  }
}

module.exports.KmsController = Controller
