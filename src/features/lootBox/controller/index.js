module.exports.getLootBoxControllerInstance = (config) => new Controller(config)
const InvalidException = require('../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { signEthereumTx } = require('../../../services/blockchain/ethereum')
const { Protocol } = require('../../../services/blockchain/constants')
const Interface = require('./interface')
const { getTransactionControllerInstance } = require('../../transaction/controller')
const { SignedTransaction, TransactionType } = require('../../transaction/entity')
const { signCeloTx } = require('../../../services/blockchain/celo')
const {
  validateLootBoxDeploy,
  validateLootBoxCreation,
  validateLootBoxGetContent,
  validateLootBoxOpening,
  validateApproveContent,
} = require('../../../services/validations/lootBox')
const { getContractControllerInstance } = require('../../contract/controller')
const { LOOTBOX_CONTENT_ABI } = require('../../../services/blockchain/contract/abis')
const { getTokenControllerInstance } = require('../../../../dist/src/features/token/controller')
const { getNftControllerInstance } = require('../../../../dist/src/features/nft/controller')

class Controller extends Interface {
  /**
   * Deploy lootBox factory
   * @param {import('../entity').DeployLootBoxFactoryInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
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
    const rawTransaction = await makeRequest({
      method: 'post',
      url: `/contract/lootBox/deploy?protocol=${protocol}`,
      body: data,
      config: this.config,
    })

    let signedTx
    switch (protocol) {
      case Protocol.CELO:
        signedTx = await signCeloTx(rawTransaction, wallet.privateKey)
        break
      case Protocol.ETHEREUM:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ:
        signedTx = signEthereumTx(rawTransaction, protocol, wallet.privateKey, this.config.environment)
        break
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(
      new SignedTransaction({
        signedTx,
        protocol,
        type: TransactionType.LOOTBOX_DEPLOY,
      })
    )
  }

  /**
   * Open lootBox
   * @param {import('../entity').OpenLootBoxInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async openLootBox(input) {
    validateLootBoxOpening(input)
    const tc = getTransactionControllerInstance(this.config)
    const { protocol, lootBoxId, amount, lootBoxAddress, wallet } = input

    const rawTransaction = await makeRequest({
      method: 'post',
      url: `/contract/lootBox/${lootBoxAddress}/open/${lootBoxId}?protocol=${protocol}`,
      config: this.config,
      body: { amount: amount ? amount : 1, from: wallet.address },
    })

    let signedTx
    switch (protocol) {
      case Protocol.CELO:
        signedTx = await signCeloTx(rawTransaction, wallet.privateKey)
        break
      case Protocol.ETHEREUM:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ:
        signedTx = signEthereumTx(rawTransaction, protocol, wallet.privateKey, this.config.environment)
        break
      default:
        throw new InvalidException('Unsupported protocol')
    }

    return await tc.sendTransaction(
      new SignedTransaction({
        signedTx,
        protocol,
        type: TransactionType.LOOTBOX_DEPLOY,
      })
    )
  }
  /**
   * Create lootBox
   * @param {import('../entity').CreateLootBoxInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async createLootBox(input) {
    const tc = getTransactionControllerInstance(this.config)
    validateLootBoxCreation(input)
    const {
      protocol,
      contents,
      wallet,
      lootBoxAddress,
      lootBoxURI,
      openStartTimestamp,
      recipient,
      amountDistributedPerOpen,
      rewardUnits,
    } = input
    const data = {
      from: wallet.address,
      contents,
      lootBoxFactoryAddress: lootBoxAddress,
      lootBoxURI,
      openStartTimestamp,
      recipient,
      amountDistributedPerOpen,
      rewardUnits,
    }
    if (!data.rewardUnits) {
      data.rewardUnits = Array(contents.length).fill('1')
    }
    if (!data.amountDistributedPerOpen) {
      data.amountDistributedPerOpen = '1'
    }

    const fromPrivateKey = wallet.privateKey

    data.contents?.forEach((r) => {
      if (r.tokenType === 'ERC1155') {
        r.tokenType = 2
      } else if (r.tokenType === 'ERC721') {
        r.tokenType = 1
      } else if (r.tokenType === 'ERC20') {
        r.tokenType = 0
      } else {
        throw new InvalidException('Invalid Token Type')
      }
    })
    const rawTransaction = await makeRequest({
      method: 'post',
      url: `/contract/lootBox/${lootBoxAddress}/create?protocol=${protocol}`,
      body: data,
      config: this.config,
    })

    let signedTx = ''
    switch (protocol) {
      case Protocol.CELO:
        signedTx = await signCeloTx(rawTransaction, fromPrivateKey)
        break
      case Protocol.ETHEREUM:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ:
        signedTx = signEthereumTx(rawTransaction, protocol, fromPrivateKey, this.config.environment)
        break
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(
      new SignedTransaction({
        signedTx,
        protocol,
        type: TransactionType.LOOTBOX_CREATE,
      })
    )
  }
  /**
   * Get lootBox content
   * @param {import('../entity').GetLootBoxContentInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async getLootBoxContent(input) {
    validateLootBoxGetContent(input)
    const { lootBoxAddress, lootBoxId, protocol } = input

    const cc = getContractControllerInstance(this.config)
    switch (protocol) {
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ:
        return await cc.callMethod({
          contractAbi: LOOTBOX_CONTENT_ABI,
          contractAddress: lootBoxAddress,
          method: 'getLootBoxContents',
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
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async approve(input) {
    validateApproveContent(input)
    const { protocol, lootBoxAddress, amount, tokenType, tokenAddress, tokenId, wallet } = input

    const tokenController = getTokenControllerInstance(this.config)
    const nftController = getNftControllerInstance(this.config)
    switch (tokenType) {
      case 'ERC20':
        return await tokenController.approve({ amount, protocol, spender: lootBoxAddress, token: tokenAddress, wallet })
      case 'ERC721':
        return await nftController.approve({ protocol, token: tokenAddress, tokenId, wallet, operator: lootBoxAddress })
      case 'ERC1155':
        return await nftController.setApprovalForAll({
          protocol,
          isApproved: 'true',
          operator: lootBoxAddress,
          token: tokenAddress,
          wallet,
        })
    }
  }
}

module.exports.LootBoxController = Controller
