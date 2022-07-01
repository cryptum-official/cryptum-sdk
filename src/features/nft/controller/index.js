const InvalidException = require('../../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { Protocol } = require('../../../services/blockchain/constants')
const Interface = require('./interface')

class Controller extends Interface {
  /**
   * Get token info
   * @param {import('../entity').NftInfoInput} input
   * @returns {Promise<import('../entity').NftInfo>}
   */
  async getInfo(input) {
    const { protocol, tokenUid, tokenAddress } = input
    switch (protocol) {
      case Protocol.HATHOR:
        return makeRequest({ method: 'get', url: `/nft/${tokenUid}/info?protocol=${protocol}`, config: this.config })
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.SOLANA:
        return makeRequest({ method: 'get', url: `/nft/${tokenAddress}/info?protocol=${protocol}`, config: this.config })
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
    const { protocol, tokenUid, tokenAddress, tokenId, address } = input
    switch (protocol) {
      case Protocol.HATHOR:
        return makeRequest({ method: 'get', url: `/nft/${tokenUid}/balance/${address}?protocol=${protocol}`, config: this.config })
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.SOLANA:
        return makeRequest({
          method: 'get',
          url: `/nft/${tokenAddress}/balance/${address}?protocol=${protocol}&${tokenId ? `tokenId=${tokenId}` : ''}`, config: this.config
        })
      default:
        throw new InvalidException('Unsupported protocol')
    }
  }
  /**
   * Get metadata of nft
   * @param {import('../entity').NftMetadataInput} input
   * @returns {Promise<import('../entity').NftInfo>}
   */
  async getMetadata(input) {
    const { protocol, tokenUid, tokenAddress, tokenId } = input
    switch (protocol) {
      case Protocol.HATHOR:
        return makeRequest({ method: 'get', url: `/nft/${tokenUid}/metadata?protocol=${protocol}`, config: this.config })
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.SOLANA:
        return makeRequest({
          method: 'get',
          url: `/nft/${tokenAddress}/metadata?protocol=${protocol}&tokenId=${tokenId}`, config: this.config
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
