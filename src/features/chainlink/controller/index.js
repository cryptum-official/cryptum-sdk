module.exports.getChainlinkController = (config) => new Controller(config)
const PriceFeeds = require("../../../services/blockchain/chainlink/priceFeeds")
const Interface = require('./interface')
const { makeRequest } = require('../../../services')


class Controller extends Interface {
    feeds = PriceFeeds.priceFeeds

    /**
     * Get latest price 
     * @param {import('../entity').PriceFeedInput} input
     * @returns {Promise<import('../entity').PriceFeedResponse>}
     */
    async getPrices(input) {
        const { protocol, address } = input;
        return makeRequest({ method: 'get', url: `/chainlink/pricefeed/${address}?protocol=${protocol}`, config: this.config })
    }
}