/**
* @typedef {Object} PriceFeedInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} address address contract
**/


class PriceFeedResponse {
    constructor({
        roundId,
        answer,
        startedAt,
        updatedAt,
        answeredInRound,
        decimals,
        fromWei
    }) {
        this.roundId = roundId
        this.answer = answer
        this.startedAt = startedAt
        this.updatedAt = updatedAt
        this.answeredInRound = answeredInRound
        this.decimals = decimals
        this.fromWei = fromWei
        Object.assign(this, rest)
    }
}

module.exports = {
    PriceFeedResponse
}