const InvalidException = require('../../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { Protocol } = require('../../../services/blockchain/constants')
const Interface = require('./interface')
const TransactionController = require('../../transaction/controller');

class Controller extends Interface {
  /**
   * Get fungible token info
   * @param {import('../entity').TokenInfoInput} input
   * @returns {Promise<import('../entity').TokenInfo>}
   */
  async getInfo(input) {
    const { protocol, tokenUid, tokenAddress } = input
    switch (protocol) {
      case Protocol.HATHOR:
        return makeRequest({ method: 'get', url: `/token/${tokenUid}/info?protocol=${protocol}`, config: this.config })
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.SOLANA:
        return makeRequest({ method: 'get', url: `/token/${tokenAddress}/info?protocol=${protocol}`, config: this.config })
      default:
        throw new InvalidException('Unsupported protocol')
    }
  }
  /**
   * Get token balance
   * @param {import('../entity').NftBalanceInfoInput} input
   * @returns {Promise<import('../entity').NftBalanceInfo>}
   */
  async getBalance(input) {
    const { protocol, tokenUid, tokenAddress, address } = input
    switch (protocol) {
      case Protocol.HATHOR:
        return makeRequest({ method: 'get', url: `/token/${tokenUid}/balance/${address}?protocol=${protocol}`, config: this.config })
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.SOLANA:
        return makeRequest({
          method: 'get',
          url: `/token/${tokenAddress}/balance/${address}?protocol=${protocol}`, config: this.config
        })
      default:
        throw new InvalidException('Unsupported protocol')
    }
  }

  async transfer(input) { }

  async mint(input) { }

  async burn(input) { }

}

module.exports = Controller
