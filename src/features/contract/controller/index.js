module.exports.getContractControllerInstance = (config) => new Controller(config)

const InvalidException = require('../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { buildCeloSmartContractTransaction, buildCeloSmartContractDeployTransaction } = require('../../../services/blockchain/celo')
const { Protocol } = require('../../../services/blockchain/constants')
const { SUPPORTS_INTERFACE_ABI } = require('../../../services/blockchain/contract/abis')
const { buildEthereumSmartContractTransaction, buildEthereumSmartContractDeployTransaction } = require('../../../services/blockchain/ethereum')
const { isTestnet } = require('../../../services/utils')
const { validateSmartContractCallParams,
  validateSmartContractTransactionParams,
  validateTokenDeployTransactionParams,
  validateSmartContractDeployTransactionParams
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
    const data = makeRequest({
      method: 'post',
      url: `/tx/call-method?protocol=${protocol}`,
      body: { from, contractAddress, contractAbi, method, params },
      config: this.config
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
      params: [interfaceId]
    })
    return result
  }
  /**
   * Call and create smart contract transaction
   * @param {import('../entity').SmartContractCallTransactionInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async callMethodTransaction(input) {
    validateSmartContractTransactionParams(input)
    const { wallet, fee, value, contractAddress, contractAbi, method, params, protocol, feeCurrency } = input
    const tc = getTransactionControllerInstance(this.config)
    const { info, networkFee } = await tc._getFeeInfo({
      wallet,
      type: TransactionType.CALL_CONTRACT_METHOD,
      contractAddress,
      contractAbi,
      method,
      params,
      fee,
      protocol,
    })
    let signedTx
    const transactionOptions = {
      fromPrivateKey: wallet.privateKey,
      nonce: info.nonce,
      value,
      contractAddress,
      contractAbi,
      method,
      params,
      fee: networkFee,
      feeCurrency,
      testnet: isTestnet(this.config.environment),
    }
    if (protocol === Protocol.CELO) {
      signedTx = await buildCeloSmartContractTransaction(transactionOptions)
    } else if ([Protocol.ETHEREUM, Protocol.BSC, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
      signedTx = await buildEthereumSmartContractTransaction({ ...transactionOptions, protocol })
    } else {
      throw new InvalidException('Invalid protocol')
    }
    return await tc.sendTransaction(new SignedTransaction({ signedTx, protocol, type: TransactionType.CALL_CONTRACT_METHOD }))
  }
  /**
   * Deploy smart contract to blockchain
   * @param {import('../entity').SmartContractDeployTransactionInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async deploy(input) {
    validateSmartContractDeployTransactionParams(input)
    const { wallet, fee, params, protocol, feeCurrency, source, contractName } = input
    const tc = getTransactionControllerInstance(this.config)
    const { info, networkFee } = await tc._getFeeInfo({
      wallet,
      type: TransactionType.DEPLOY_CONTRACT,
      params,
      fee,
      protocol,
      source,
      contractName,
    })

    let signedTx
    const transactionOptions = {
      source,
      contractName,
      fromPrivateKey: wallet.privateKey,
      nonce: info.nonce,
      params,
      fee: networkFee,
      feeCurrency,
      testnet: isTestnet(this.config.environment),
      config: this.config,
    }
    if (protocol === Protocol.CELO) {
      signedTx = await buildCeloSmartContractDeployTransaction(transactionOptions)
    } else if ([Protocol.ETHEREUM, Protocol.BSC, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
      signedTx = await buildEthereumSmartContractDeployTransaction({ ...transactionOptions, protocol })
    } else {
      throw new InvalidException('Invalid protocol')
    }
    return await tc.sendTransaction(new SignedTransaction({ signedTx, protocol, type: TransactionType.DEPLOY_CONTRACT }))
  }
  /**
   * Create call transaction to token/asset issue
   * @param {import('../entity').TokenDeployTransactionInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async deployToken(input) {
    validateTokenDeployTransactionParams(input)
    const { wallet, fee, params, protocol, feeCurrency, tokenType } = input
    const tc = getTransactionControllerInstance(this.config)
    const { info, networkFee } = await tc._getFeeInfo({
      wallet,
      type: `DEPLOY_${tokenType}`,
      params,
      fee,
      protocol,
      tokenType,
    })

    let signedTx
    const transactionOptions = {
      fromPrivateKey: wallet.privateKey,
      nonce: info.nonce,
      params,
      fee: networkFee,
      feeCurrency,
      testnet: isTestnet(this.config.environment),
      config: this.config,
      tokenType,
    }
    if (protocol === Protocol.CELO) {
      signedTx = await buildCeloSmartContractDeployTransaction(transactionOptions)
    } else if ([Protocol.ETHEREUM, Protocol.BSC, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
      signedTx = await buildEthereumSmartContractDeployTransaction({ ...transactionOptions, protocol })
    } else {
      throw new InvalidException('Invalid protocol')
    }
    return await tc.sendTransaction(new SignedTransaction({ signedTx, protocol, type: TransactionType.DEPLOY_CONTRACT }))
  }
}

module.exports.ContractController = Controller
