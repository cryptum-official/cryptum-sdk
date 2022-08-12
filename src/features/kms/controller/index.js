module.exports.getKmsControllerInstance = (config) => new Controller(config)

const { makeRequest } = require('../../../services')
const Interface = require('./interface')

class Controller extends Interface {

  /**
 * Get wallet transactions
 * @param {{ status?: string; limit?: number=; offset?: number=; }} input
 * @returns {Promise<import('../entity').[]>}
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
   * @returns {Promise<import('../entity').>}
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
   * @param {import('../entity').SetTrustline} input transaction input
   * @returns {Promise<{}>}
   */
  async setStellarTrustline(input) {
    return makeRequest({ method: 'post', url: `/kms/trustline/stellar`, body: input, config: this.config })
  }
  async setRippleTrustline(input) {
    return makeRequest({ method: 'post', url: `/kms/trustline/ripple`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').StellarTransfer} input transaction input
   * @returns {Promise<{}>}
   */
  async createStellarTransferTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/transfer/stellar`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').RippleTransfer} input transaction input
   * @returns {Promise<{}>}
   */
  async createRippleTransferTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/transfer/ripple`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').BitcoinTransfer} input transaction input
   * @returns {Promise<{}>}
   */
  async createBitcoinTransferTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/transfer/bitcoin`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').CeloTransfer} input transaction input
   * @returns {Promise<{}>}
   */
  async createCeloTransferTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/transfer/celo`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').EthereumTransfer} input transaction input
   * @returns {Promise<{}>}
   */
  async createEthereumTransferTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/transfer/ethereum`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').EthereumTransfer} input transaction input
   * @returns {Promise<{}>}
   */
  async createBscTransferTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/transfer/bsc`, body: input, config: this.config })
  }
  async createPolygonTransferTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/transfer/polygon`, body: input, config: this.config })
  }
  async createAvaxcchainTransferTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/transfer/avaxcchain`, body: input, config: this.config })
  }
  async createSolanaTransferTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/transfer/solana`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').HathorTransfer} input transaction input
   * @returns {Promise<{}>}
   */
  async createHathorTransferTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/transfer/hathor`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').CardanoTransfer} input transaction input
   * @returns {Promise<{}>}
   */
  async createCardanoTransferTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/transfer/cardano`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').EthereumSmartContractSend} input transaction input
   * @returns {Promise<{}>}
   */
  async createEthereumSmartContractCallTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/smartcontract/send/ethereum`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').EthereumSmartContractSend} input transaction input
   * @returns {Promise<{}>}
   */
  async createBscSmartContractCallTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/smartcontract/send/bsc`, body: input, config: this.config })
  }
  async createPolygonSmartContractCallTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/smartcontract/send/polygon`, body: input, config: this.config })
  }
  async createAvaxcchainSmartContractCallTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/smartcontract/send/avaxcchain`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').EthereumSmartContractDeploy} input transaction input
   * @returns {Promise<{}>}
   */
  async createEthereumSmartContractDeployTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/smartcontract/deploy/ethereum`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').EthereumSmartContractDeploy} input transaction input
   * @returns {Promise<{}>}
   */
  async createBscSmartContractDeployTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/smartcontract/deploy/bsc`, body: input, config: this.config })
  }
  async createPolygonSmartContractDeployTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/smartcontract/deploy/polygon`, body: input, config: this.config })
  }
  async createAvaxcchainSmartContractDeployTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/smartcontract/deploy/avaxcchain`, body: input, config: this.config })
  }
  /**
   * @param {import('../entity').CeloSmartContractSend} input transaction input
   * @returns {Promise<{}>}
   */
  async createCeloSmartContractCallTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/smartcontract/send/celo`, body: input, config: this.config })
  }
  /**
   * @param {import('../entity').CeloSmartContractDeploy} input transaction input
   * @returns {Promise<{}>}
   */
  async createCeloSmartContractDeployTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/smartcontract/deploy/celo`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').EthereumTokenDeploy} input transaction input
   * @returns {Promise<{}>}
   */
  async createEthereumTokenDeployTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/token/deploy/ethereum`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').EthereumTokenDeploy} input transaction input
   * @returns {Promise<{}>}
   */
  async createBscTokenDeployTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/token/deploy/bsc`, body: input, config: this.config })
  }
  async createPolygonTokenDeployTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/token/deploy/polygon`, body: input, config: this.config })
  }
  async createAvaxcchainTokenDeployTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/token/deploy/avaxcchain`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').CeloTokenDeploy} input transaction input
   * @returns {Promise<{}>}
   */
  async createCeloTokenDeployTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/token/deploy/celo`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').HathorTokenDeploy} input transaction input
   * @returns {Promise<{}>}
   */
  async createHathorTokenDeployTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/token/deploy/hathor`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').HathorTokenMint} input transaction input
   * @returns {Promise<{}>}
   */
  async createHathorMintTokenTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/token/mint/hathor`, body: input, config: this.config })
  }
  /**
   * Create wallet transaction
   * @param {import('../entity').HathorTokenMelt} input transaction input
   * @returns {Promise<{}>}
   */
  async createHathorMeltTokenTransaction(input) {
    return makeRequest({ method: 'post', url: `/kms/token/melt/hathor`, body: input, config: this.config })
  }
}

module.exports.KmsController = Controller
