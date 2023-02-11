/**
 * @typedef {Object} CreatePoolInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {number} fee fee collected upon every swap in the pool
 * @property {string} tokenA address of the first token
 * @property {string} tokenB address of the second token
 * @property {string} price desired price of tokenA/tokenB to be intiated
 */

/**
 * @typedef {Object} MintPositionInput
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {GetMintPositionQuotationResponse} transaction result object of the function getMintPositionQuotation
 */

/**
 * @typedef {Object} GetMintPositionQuotationInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} pool address of the pool to be interacted with
 * @property {string} amountTokenA amount of tokenA to be used in position
 * @property {string} amountTokenB amount of tokenB to be used in position
 * @property {string} minPriceDelta desired minimum price of the position, given in percentage points relative to current price
 * @property {string} maxPriceDelta desired maximum price of the position, given in percentage points relative to current price
 * @property {string} slippage allowed levels of slippage (in percentage points)
 * @property {string} recipient address that will receive the position's NFT
 * @property {boolean} wrapped mark true if you want this transaction to consume the wrapped (erc-20) version of the blockchain native currency
 * @property {string} deadline your transaction will revert if it is pending for more than this period of time (in minutes)
 */
/**
 * @typedef {Object} RemovePositionInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} pool address of the pool to be interacted with
 * @property {string} slippage allowed levels of slippage (in percentage points)
 * @property {string} tokenId id of the position to be removed
 * @property {string} percentageToRemove how much percent of the position's liquidity should be removed
 * @property {string} recipient address that will receive the position's NFT
 */
/**
 * @typedef {Object} GetPoolsInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} tokenA address of the first token
 * @property {string} tokenB address of the second token
 * @property {number} poolFee fee collected upon every swap in the pool
 */
/**
 * @typedef {Object} ObservePoolInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} pool address of the pool
 * @property {Array[number]} secondsAgoToCheck array of time points (in seconds previous to current time)
 */
/**
 * @typedef {Object} GetPoolDataInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} poolAddress address of the first token
 */
/**
 * @typedef {Object} GetSwapQuotationInput
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} tokeIn address of the input token to be sent
 * @property {string} tokenOut address of output token to be received
 * @property {string} amountIn amount of input token to send
 * @property {string} amountOut amount of result token to get
 * @property {string} slippage allowed levels of slippage (in percentage points)
 * @property {string} deadline your transaction will revert if it is pending for more than this period of time (in minutes)
 * @property {string} recipient the recipient address that will receive the swap funds
 */
/**
 * @typedef {Object} GetTokenIdsInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} ownerAddress address of the wallet owner
 */
/**
 * @typedef {Object} GetPositionsInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} ownerAddress address of the wallet owner
 * @property {string} poolAddress address of the pool
 */
/**
 * @typedef {Object} GetPositionInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} tokenId tokenId of the position to be read
 */
/**
 * @typedef {Object} CollectFeesInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} tokenId id of the position to collect fees
 * @property {boolean} wrapped mark true if you want this transaction to receive the fees in wrapped (erc-20) version of the blockchain native currency
 */
/**
 * @typedef {Object} getIncreaseLiquidityQuotationInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} tokenId id of the position to be increased
 * @property {string} amountTokenA amount of liqudity desired to be added from token A
 * @property {string} amountTokenB amount of liqudity desired to be added from token B
 * @property {string} slippage allowed levels of slippage (in percentage points)
 * @property {boolean} wrapped mark true if you want this transaction to consume the wrapped (erc-20) version of the blockchain native currency
 * @property {string} deadline your transaction will revert if it is pending for more than this period of time (in minutes)
 */
/**
 * @typedef {Object} DecreaseLiquidityInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} tokenId id of the position to be decreased
 * @property {string} percentageToDecrease percentage from the total liquidity of the position to be decreased
 * @property {string} slippage allowed levels of slippage (in percentage points)
 * @property {string} recipient address that will receive the tokens
 * @property {boolean} wrapped mark true if you want this transaction to consume the wrapped (erc-20) version of the blockchain native currency
 * @property {string} deadline your transaction will revert if it is pending for more than this period of time (in minutes)
 * @property {boolean} burnToken whether token should be burned once entire liquidity is removed (optional, defaults to false)
 */
/**
 * @typedef {Object} IncreaseCardinalityInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} pool the address of the pool
 * @property {number} cardinality the new amount of observations the pool will be able to hold
 */
/**
 * @typedef {Object} SwapInput
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {Object} transaction transaction quotation object
 */
/**
 * @typedef {Object} IncreaseLiquidityInput
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {Object} transaction transaction quotation object
 */

const { GetMintPositionQuotationResponse } = require('../../transaction/entity')

module.exports = {}
