/**
* @typedef {Object} PriceFeedInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} address address contract
**/

/**
* @typedef {Object} PriceInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} asset asset
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

class Prices {
  constructor({
    USD,
    EUR,
    ETH,
    XLM,
    MDA,
    BNB,
    XRP,
    CELO,
    BTC,
    HTR,
    ADA,
    AVAX,
    CHZ,
  }) {
    if (USD) this.USD = USD;
    if (EUR) this.EUR = EUR;
    if (ETH) this.ETH = ETH;
    if (XLM) this.XLM = XLM;
    if (MDA) this.MDA = MDA;
    if (BNB) this.BNB = BNB;
    if (XRP) this.XRP = XRP;
    if (CELO) this.CELO = CELO;
    if (BTC) this.BTC = BTC;
    if (MDA) this.MDA = MDA;
    if (HTR) this.HTR = HTR;
    if (ADA) this.ADA = ADA;
    if (AVAX) this.AVAX = AVAX;
    if (CHZ) this.CHZ = CHZ;
  }
}

module.exports = {
  PriceFeedResponse,
  Prices
}