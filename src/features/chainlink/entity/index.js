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
* @typedef {Object} TransferTokenCCIPInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
* @property {string} to
* @property {string} amount
* @property {string} tokenAddress
* @property {import('../../../services/blockchain/constants').Protocol} destinationProtocol
* @property {string} feeTokenAddress 0x for native token or token address or null for LINK token
**/
//{ protocol, messageId, destinationProtocol } 

/**
* @typedef {Object} StatusCCIPInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../../services/blockchain/constants').Protocol} destinationProtocol
* @property {string} messageId
**/

/**
* @typedef {Object} EditGasLimitInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
* @property {string} upkeepID
* @property {string} gasLimit
**/


/**
* @typedef {Object} ResponseStatusCCIP
* @property {string} messageId
* @property {string} destinationTransactionHash
* @property {string} status
* @property {number} blockNumber
**/

/**
* @typedef {Object} CreateCCIP
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
**/

/**
* @typedef {Object} GetCCIP
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} address
**/

/**
* @typedef {Object} AllowlistedSendersCCIP
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} address
* @property {string} senderAddress
**/
/**
* @typedef {Object} AllowSenderCCIP
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
* @property {string} address
* @property {string} senderAddress
* @property {boolean} allowed
**/

/**
* @typedef {Object} SendMessageCCIP
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
* @property {import('../../../services/blockchain/constants').Protocol} destinationProtocol
* @property {string} contractAddress
* @property {string} text
* @property {string} tokenAddress
* @property {string} amount
* @property {string} to
* @property {boolean} payLink
**/

/**
* @typedef {Object} WithdrawCCIP
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {import('../../wallet/entity').Wallet} wallet
* @property {string} contractAddress
* @property {string} tokenAddress
* @property {string} to
**/

/**
* @typedef {Object} ResponseLastReceivedMessageCCIP
* @property {string} messageId
* @property {string} text
* @property {string} tokenAddress
* @property {string} tokenAmount
**/

/**
* @typedef {Array} ResponseMessagesIdCCIP
* @property {string} messageId
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