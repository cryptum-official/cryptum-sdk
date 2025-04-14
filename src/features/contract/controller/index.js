module.exports.getContractControllerInstance = (config) => new Controller(config)

const { makeRequest } = require('../../../services')
const { Protocol } = require('../../../services/blockchain/constants')
const { SUPPORTS_INTERFACE_ABI } = require('../../../services/blockchain/contract/abis')
const { signEthereumTx } = require('../../../services/blockchain/ethereum')
const {
  validateSmartContractCallParams,
  validateSmartContractTransactionParams,
  validateTokenDeployTransactionParams,
  validateSmartContractDeployTransactionParams,
} = require('../../../services/validations')
const { getTransactionControllerInstance } = require('../../transaction/controller')
const { TransactionType, SignedTransaction } = require('../../transaction/entity')
const { SmartContractCallResponse } = require('../entity')
const Interface = require('./interface')

class Controller extends Interface {
  /**
   * Call smart contract method
   * @param {import('../entity').SmartContractCallMethodInput} input
   * @returns {Promise<import('../entity').SmartContractCallResponse>}
   */
  async callMethod(input) {
    validateSmartContractCallParams(input)
    const { from, contractAddress, contractAbi, method, params, protocol } = input
    const data = await makeRequest({
      method: 'post',
      url: `/tx/call-method?protocol=${protocol}`,
      body: { from, contractAddress, contractAbi, method, params },
      config: this.config,
    })
    return new SmartContractCallResponse(data)
  }
  /**
   * Test if supports interface id
   * @param {{ protocol: Protocol, contractAddress:string, interfaceId:string}} input
   * @returns {Promise<boolean>}
   */
  async supportsInterfaceId(input) {
    const { contractAddress, interfaceId, protocol } = input
    const { result } = await this.callMethod({
      protocol,
      contractAbi: SUPPORTS_INTERFACE_ABI,
      contractAddress,
      method: 'supportsInterface',
      params: [interfaceId],
    })
    return result
  }
  /**
   * Create and send smart contract call transaction
   * @param {import('../entity').SmartContractCallTransactionInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async callMethodTransaction(input) {
    const tx = await this.buildMethodTransaction(input)
    return await getTransactionControllerInstance(this.config).sendTransaction(tx)
  }
  /**
   * Create smart contract call transaction
   * @param {import('../entity').SmartContractCallTransactionInput} input
   * @returns {Promise<import('../../transaction/entity').SignedTransaction>}
   */
  async buildMethodTransaction(input) {
    validateSmartContractTransactionParams(input)
    const { wallet, fee, value, contractAddress, contractAbi, method, params, protocol, feeCurrency } = input
    const builtTx = await makeRequest({
      method: 'post',
      url: `/tx/build/method-transaction?protocol=${protocol}`,
      body: { protocol, from: wallet.address, fee, value, contractAddress, contractAbi, method, params, feeCurrency },
      config: this.config,
    })
    let signedTx = signEthereumTx(builtTx, protocol, wallet.privateKey, this.config.environment)

    return new SignedTransaction({ signedTx, protocol, type: TransactionType.CALL_CONTRACT_METHOD })
  }
  /**
   * Deploy smart contract to blockchain
   * @param {import('../entity').SmartContractDeployTransactionInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async deploy(input) {
    const tx = await this.buildDeployTransaction(input)
    return await getTransactionControllerInstance(this.config).sendTransaction(tx)
  }
  /**
   * Deploy smart contract to blockchain
   * @param {import('../entity').SmartContractDeployTransactionInput} input
   * @returns {Promise<import('../../transaction/entity').SignedTransaction>}
   */
  async buildDeployTransaction(input) {
    validateSmartContractDeployTransactionParams(input)
    const { wallet, fee, params, protocol, feeCurrency, source, contractName } = input
    const builtTx = await makeRequest({
      method: 'post',
      url: `/tx/build/deploy-contract?protocol=${protocol}`,
      body: { from: wallet.address, fee, params, protocol, feeCurrency, source, contractName },
      config: this.config,
    })
    let signedTx = signEthereumTx(builtTx, protocol, wallet.privateKey, this.config.environment)

    return new SignedTransaction({ signedTx, protocol, type: TransactionType.DEPLOY_CONTRACT })
  }
  /**
   * Create call transaction to token/asset issue
   * @param {import('../entity').TokenDeployTransactionInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async deployToken(input) {
    const tx = await this.buildDeployTokenTransaction(input)
    return await getTransactionControllerInstance(this.config).sendTransaction(tx)
  }
  /**
   * Create call transaction to token/asset issue
   * @param {import('../entity').TokenDeployTransactionInput} input
   * @returns {Promise<import('../../transaction/entity').SignedTransaction>}
   */
  async buildDeployTokenTransaction(input) {
    validateTokenDeployTransactionParams(input)
    const { wallet, fee, params, protocol, feeCurrency, tokenType } = input
    const builtTx = await makeRequest({
      method: 'post',
      url: `/tx/build/deploy-token?protocol=${protocol}`,
      body: { from: wallet.address, fee, params, protocol, feeCurrency, type: tokenType },
      config: this.config,
    })
    let signedTx = signEthereumTx(builtTx, protocol, wallet.privateKey, this.config.environment)

    return new SignedTransaction({ signedTx, protocol, type: TransactionType.DEPLOY_CONTRACT })
  }
}

module.exports.ContractController = Controller
