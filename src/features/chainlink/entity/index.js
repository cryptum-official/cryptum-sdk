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

/**
* @typedef {Object} SubscriptionByIdInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {number} id asset
**/

/**
* @typedef {Object} CreateVRFInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
* @property {number} updateIntervalUpkeep
**/

/**
* @typedef {Object} CancelVRFInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
* @property {string} address address contract
**/

/**
* @typedef {Object} TopUpSubscriptionInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
* @property {string} address address contract
* @property {number} amount
**/

/**
* @typedef {Object} RequestRandomWordsSubscriptionInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
* @property {string} address address contract
* @property {number} numWords
**/


/**
* @typedef {Object} ResponseSubscription
* @property {string} subscription_id address contract
* @property {string} balance
* @property {string} fulfillments
* @property {string} owner
* @property {string} last_block_number
* @property {string[]} consumers
**/

/**
* @typedef {Object} ResponseListRequests
* @property {string[]} requests
**/

/**
* @typedef {Object} ResponseLatestRequest
* @property {string} latestRequest
**/

/**
* @typedef {Object} GetRandomWordsInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} address address contract
* @property {string} requestId
**/

/**
* @typedef {Object} RandomWordsResponse
* @property {boolean} fulfilled
* @property {string[]} randomWords
**/

/**
* @typedef {Object} ResponseListUpkeeps
* @property {string[]} upkeeps
**/

/**
* @typedef {Object} UpkeepInfoInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} upkeepID
**/

/**
* @typedef {Object} ResponseUpkeepInfo
* @property {string} target
* @property {string} performGas
* @property {string} checkData
* @property {string} balance
* @property {string} admin
* @property {string} maxValidBlocknumber
* @property {string} lastPerformedBlockNumber
* @property {string} amountSpent
* @property {boolean} paused
* @property {boolean} forwarder
**/

/**
* @typedef {Object} UpkeepBalanceInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} address
* @property {string} upkeepID
**/

/**
* @typedef {Object} ResponseUpkeepBalance
* @property {string} balance
* @property {string} minBalance
**/

/**
* @typedef {Object} RegisterUpkeepInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} address
* @property {import('../../wallet/entity').Wallet} wallet
* @property {string} name
* @property {string} encryptedEmail
* @property {string} upkeepContract
* @property {string} gasLimit
* @property {string} triggerType
* @property {string} checkData
* @property {string} triggerConfig
* @property {string} offchainConfig
* @property {string} amount
**/

/**
* @typedef {Object} UpkeepActionInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
* @property {string} upkeepID
* @property {string?} amount
**/

/**
* @typedef {Object} EditGasLimitInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
* @property {string} upkeepID
* @property {string} gasLimit
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