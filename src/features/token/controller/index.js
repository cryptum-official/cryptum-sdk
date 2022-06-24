const InvalidException = require('../../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { Protocol } = require('../../../services/blockchain/constants')
const Interface = require('./interface')

class Controller extends Interface {
	/**
	 * Get fungible token info
	 * @param {import('../entity').TokenInfoInput} input
	 * @returns {Promise<import('../entity').TokenInfo>}
	 */
	async getTokenInfo(input) {
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
}

module.exports = Controller
