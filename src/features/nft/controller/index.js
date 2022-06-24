const InvalidException = require('../../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { Protocol } = require('../../../services/blockchain/constants')
const Interface = require('./interface')

class Controller extends Interface {
	/**
	 * Get token info
	 * @param {import('../entity').TokenInfoInput} input
	 * @returns {Promise<import('../entity').TokenInfo>}
	 */
	async getTokenInfo(input) {
		const { protocol, tokenUid } = input
		switch (protocol) {
			case Protocol.HATHOR:
				return makeRequest({ method: 'get', url: `/token/${tokenUid}?protocol=${protocol}`, config: this.config })
			default:
				throw new InvalidException('Unsupported protocol')
		}
	}
}

module.exports = Controller
