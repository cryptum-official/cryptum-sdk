module.exports.getChainlinkController = (config) => new Controller(config)
const PriceFeeds = require("../../../services/blockchain/chainlink/priceFeeds")
const Interface = require('./interface')
const { makeRequest } = require('../../../services')
const { Prices } = require("../entity")


class Controller extends Interface {
    feeds = PriceFeeds.priceFeeds


    /**
     * Get prices by Asset
     * @param {import('../entity').PriceInput} input
     */
    async getPrices(input) {
        const { protocol, asset } = input;
        const response = await makeRequest({ method: 'get', url: `/chainlink/prices/${asset}?protocol=${protocol}`, config: this.config })
        return new Prices(response)
    }

    /**
     * Get latest price 
     * @param {import('../entity').PriceFeedInput} input
     * @returns {Promise<import('../entity').PriceFeedResponse>}
     */
    async getPricesByAddres(input) {
        const { protocol, address } = input;
        return makeRequest({ method: 'get', url: `/chainlink/pricefeed/${address}?protocol=${protocol}`, config: this.config })
    }
}