module.exports.getUniswapControllerInstance = (config) => new Controller(config)
const InvalidException = require('../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { signEthereumTx } = require('../../../services/blockchain/ethereum')
const { isTestnet } = require('../../../services/utils')
const { Protocol } = require('../../../services/blockchain/constants')
const Interface = require('./interface')
const { getTransactionControllerInstance } = require('../../transaction/controller')
const { SignedTransaction, TransactionType } = require('../../transaction/entity')
const { signCeloTx } = require('../../../services/blockchain/celo')


class Controller extends Interface {
  /**
   * Creates a uniswap V3 pool
   * @param {import('../entity').CreatePoolInput} input
   * @returns {Promise<import('../../transaction/entity').CreatePoolResponse>}
   * 
   * @description
   * If pool already existed prior to this call, no transaction will be made and the transaction property will be null
   */
  async createPool(input) {
    // TO-DO
    // initial validation function call
    const tc = getTransactionControllerInstance(this.config)

    const { protocol, wallet, fee, tokenA, tokenB, priceNumerator, priceDenominator } = input
    const data = { from: wallet.address, tokenA, tokenB, fee, priceNumerator, priceDenominator }
    const { rawTransaction, pool, initialized } = await makeRequest(
      {
        method: 'post',
        url: `/contract/uniswap/createPool?protocol=${protocol}`,
        body: data, config: this.config
      })

    if (initialized) {
      return {
        transaction: null,
        pool
      }
    }

    let signedTx;
    switch (protocol) {
      case Protocol.CELO:
        signedTx = await signCeloTx(rawTransaction, wallet.privateKey)
        break;
      case Protocol.ETHEREUM:
      case Protocol.POLYGON:
        signedTx = signEthereumTx(rawTransaction, protocol, wallet.privateKey, this.config.environment)
        break;
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return {
      transaction: await tc.sendTransaction(
        new SignedTransaction({
          signedTx, protocol, type: TransactionType.CREATE_POOL
        })),
      pool
    }
  }

  /**
   * Mints a position relative to a liquidity pool
   * @param {import('../entity').MintPositionInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async mintPosition(input) {
    // TO-DO
    // initial validation function call
    const tc = getTransactionControllerInstance(this.config)

    const { protocol, wallet, amountTokenA, amountTokenB, slippage, pool, recipient, minPriceDelta, maxPriceDelta } = input
    const data = { from: wallet.address, amountTokenA, amountTokenB, minPriceDelta, maxPriceDelta, slippage, pool, recipient: recipient ? recipient : wallet.address }
    const { rawTransaction, amountA, amountB } = await makeRequest(
      {
        method: 'post',
        url: `/contract/uniswap/mintPosition?protocol=${protocol}`,
        body: data, config: this.config
      })


    let signedTx;
    switch (protocol) {
      case Protocol.CELO:
        signedTx = await signCeloTx(rawTransaction, wallet.privateKey)
        break;
      case Protocol.ETHEREUM:
      case Protocol.POLYGON:
        signedTx = signEthereumTx(rawTransaction, protocol, wallet.privateKey, this.config.environment)
        break;
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(
      new SignedTransaction({
        signedTx, protocol, type: TransactionType.MINT_POSITION
      })
    )
  }

  /**
   * Mints a position relative to a liquidity pool
   * @param {import('../entity').RemovePositionInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async removePosition(input) {
    // TO-DO
    // initial validation function call
    const tc = getTransactionControllerInstance(this.config)

    const { protocol, wallet, slippage, pool, recipient, tokenId, percentageToRemove } = input
    const data = { from: wallet.address, slippage, pool, tokenId, percentageToRemove, recipient: recipient ? recipient : wallet.address }
    const { rawTransaction, amountA, amountB } = await makeRequest(
      {
        method: 'post',
        url: `/contract/uniswap/removePosition?protocol=${protocol}`,
        body: data, config: this.config
      })


    let signedTx;
    switch (protocol) {
      case Protocol.CELO:
        signedTx = await signCeloTx(rawTransaction, wallet.privateKey)
        break;
      case Protocol.ETHEREUM:
      case Protocol.POLYGON:
        signedTx = signEthereumTx(rawTransaction, protocol, wallet.privateKey, this.config.environment)
        break;
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(
      new SignedTransaction({
        signedTx, protocol, type: TransactionType.REMOVE_POSITION
      })
    )
  }
}

module.exports.UniswapController = Controller