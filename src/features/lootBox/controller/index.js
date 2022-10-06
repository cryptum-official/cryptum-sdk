module.exports.getLootBoxControllerInstance = (config) => new Controller(config)
const InvalidException = require('../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { signEthereumTx } = require('../../../services/blockchain/ethereum')
const { isTestnet } = require('../../../services/utils')
const { Protocol } = require('../../../services/blockchain/constants')
const Interface = require('./interface')
const { getTransactionControllerInstance } = require('../../transaction/controller')
const { TransactionResponse, SignedTransaction, TransactionType } = require('../../transaction/entity')
const { signCeloTx } = require('../../../services/blockchain/celo')
const { validateLootBoxDeploy, validateLootBoxCreation, validateLootBoxGetContent, validateLootBoxOpening, validateApproveContent } = require('../../../services/validations/lootBox')
const { getContractControllerInstance } = require('../../contract/controller')
const { buildEthereumSmartContractTransaction } = require('../../../services/blockchain/ethereum')
const { buildCeloSmartContractTransaction } = require('../../../services/blockchain/celo')
const { LOOTBOX_CONTENT_ABI, ERC20_APPROVE_METHOD_ABI, ERC721_APPROVE_METHOD_ABI, ERC1155_APPROVE_METHOD_ABI } = require("../../../services/blockchain/contract/abis")

class Controller extends Interface {
  /**
   * Deploy lootBox factory
   * @param {import('../entity').DeployLootBoxFactoryInput} input
   * @returns {Promise<TransactionResponse>}
   */
  async deploy(input) {
    const tc = getTransactionControllerInstance(this.config)
    const { protocol, wallet, name, symbol, royaltyRecipient, trustedForwarders, royaltyBps } = input
    validateLootBoxDeploy(input)
    const data = { defaultAdmin: wallet.address, name, symbol, royaltyRecipient, royaltyBps, trustedForwarders }

    if (!royaltyRecipient) {
      data.royaltyRecipient = wallet.address
    }
    if (!royaltyBps) {
      data.royaltyBps = 1000
    }
    const rawTransaction = await makeRequest(
      {
        method: 'post',
        url: `/contract/lootBox/deploy?protocol=${protocol}`,
        body: data, config: this.config
      })

    let signedTx;
    switch (protocol) {
      case Protocol.CELO:
        signedTx = await signCeloTx(rawTransaction, wallet.privateKey)
        break;
      case Protocol.ETHEREUM:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
        signedTx = signEthereumTx(rawTransaction, protocol, wallet.privateKey, this.config.environment)
        break;
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(
      new SignedTransaction({
        signedTx, protocol, type: TransactionType.LOOTBOX_DEPLOY
      }))
  }

  /**
   * Open lootBox
   * @param {import('../entity').OpenLootBoxInput} input 
   * @returns {Promise<TransactionResponse>}
   */
  async openLootBox(input) {
    validateLootBoxOpening(input)
    const tc = getTransactionControllerInstance(this.config)
    const { protocol, lootBoxId, amount, lootBoxFactoryAddress, wallet } = input

    const rawTransaction = await makeRequest(
      {
        method: 'post', url: `/contract/lootBox/${lootBoxFactoryAddress}/open/${lootBoxId}?protocol=${protocol}`,
        config: this.config,
        body: { amount: amount ? amount : 1, from: wallet.address }
      }
    )

    let signedTx;
    switch (protocol) {
      case Protocol.CELO:
        signedTx = await signCeloTx(rawTransaction, wallet.privateKey)
        break;
      case Protocol.ETHEREUM:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
        signedTx = signEthereumTx(rawTransaction, protocol, wallet.privateKey, this.config.environment)
        break;
      default:
        throw new InvalidException('Unsupported protocol')
    }

    return await tc.sendTransaction(
      new SignedTransaction({
        signedTx, protocol, type: TransactionType.LOOTBOX_DEPLOY
      }))
  }
  /**
 * Create lootBox
 * @param {import('../entity').CreateLootBoxInput} input 
 * @returns {Promise<TransactionResponse>}
 */
  async createLootBox(input) {
    const tc = getTransactionControllerInstance(this.config)
    validateLootBoxCreation(input)
    const {
      protocol,
      contents,
      wallet,
      lootBoxFactoryAddress,
      lootBoxURI,
      openStartTimestamp,
      recipient,
      amountDistributedPerOpen,
      rewardUnits
    } = input
    const data = { contents, from: wallet.address, lootBoxFactoryAddress, lootBoxURI, openStartTimestamp, recipient, amountDistributedPerOpen, rewardUnits }
    if (!data.rewardUnits) {
      data.rewardUnits = Array(contents.length).fill('1')
    }
    if (!data.amountDistributedPerOpen) {
      data.amountDistributedPerOpen = '1'
    }

    const fromPrivateKey = wallet.privateKey

    data.contents?.forEach((r => {
      if (r.tokenType === "ERC1155") {
        r.tokenType = 2
      } else if (r.tokenType === "ERC721") {
        r.tokenType = 1
      } else if (r.tokenType === "ERC20") {
        r.tokenType = 0
      }
      else {
        throw new InvalidException('Invalid Token Type')
      }
    }))
    const rawTransaction = await makeRequest(
      {
        method: 'post',
        url: `/contract/lootBox/${lootBoxFactoryAddress}/create?protocol=${protocol}`,
        body: data,
        config: this.config
      })

    let signedTx = "";
    switch (protocol) {
      case Protocol.CELO:
        signedTx = await signCeloTx(rawTransaction, fromPrivateKey)
        break;
      case Protocol.ETHEREUM:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
        signedTx = signEthereumTx(rawTransaction, protocol, fromPrivateKey, this.config.environment)
        break
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(
      new SignedTransaction({
        signedTx, protocol, type: TransactionType.LOOTBOX_CREATE
      }))
  }
  /**
 * Get lootBox content
 * @param {import('../entity').GetLootBoxContentInput} input 
 * @returns {Promise<TransactionResponse>}  
 */
  async getLootBoxContent(input) {
    validateLootBoxGetContent(input)
    const { lootBoxFactoryAddress, lootBoxId, protocol } = input

    const cc = getContractControllerInstance(this.config)
    switch (protocol) {
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
        return await cc.callMethod({
          contractAbi: LOOTBOX_CONTENT_ABI,
          contractAddress: lootBoxFactoryAddress,
          method: "getLootBoxContents",
          params: [lootBoxId],
          protocol,
        })
      default:
        throw new InvalidException('Unsupported protocol')
    }
  }

  /**
   * Approve Prizes
   * @param {import('../entity').ApproveContent} input 
   * @returns {Promise<TransactionResponse>}
   */
  async approve(input) {
    validateApproveContent(input)
    const { protocol, lootboxAddress, amount, tokenType, tokenAddress, tokenId, wallet } = input

    const tc = getTransactionControllerInstance(this.config)
    let contractAbi, method, params
    switch (tokenType) {
      case 'ERC20':
        contractAbi = ERC20_APPROVE_METHOD_ABI
        method = 'approve'
        params = [lootboxAddress, amount]
        break;
      case 'ERC721':
        contractAbi = ERC721_APPROVE_METHOD_ABI
        method = 'approve'
        params = [lootboxAddress, tokenId]
        break;
      case 'ERC1155':
        contractAbi = ERC1155_APPROVE_METHOD_ABI
        method = 'setApprovalForAll'
        params = [lootboxAddress, tokenId]
        break;
    }

    const { info, networkFee } = await tc._getFeeInfo({
      wallet,
      type: TransactionType.CALL_CONTRACT_METHOD,
      contractAddress: tokenAddress,
      contractAbi,
      method,
      params,
      fee: undefined,
      protocol,
    })
    let signedTx
    const transactionOptions = {
      fromPrivateKey: wallet.privateKey,
      nonce: info.nonce,
      value: undefined,
      contractAddress: tokenAddress,
      contractAbi,
      method,
      params,
      fee: networkFee,
      feeCurrency: undefined,
      testnet: isTestnet(this.config.environment),
    }

    if (protocol === Protocol.CELO) {
      signedTx = await buildCeloSmartContractTransaction(transactionOptions)
    } else if ([Protocol.ETHEREUM, Protocol.BSC, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
      signedTx = await buildEthereumSmartContractTransaction({ ...transactionOptions, protocol })
    } else {
      throw new InvalidException('Invalid protocol')
    }


    return await tc.sendTransaction(
      new SignedTransaction({
        signedTx, protocol, type: TransactionType.LOOTBOX_APPROVE
      }))
  }
}

module.exports.LootBoxController = Controller