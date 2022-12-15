/**
 * @typedef {Object} CreatePoolInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {number} fee fee collected upon every swap in the pool
 * @property {string} tokenA address of the first token
 * @property {string} tokenB address of the second token
 * @property {string} priceNumerator used as the numerator for the initial swap ratio (price)
 * @property {string} priceDenominator used as the denominator for the initial swap ratio (price)
 */
/**
 * @typedef {Object} MintPositionInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} pool address of the pool to be interacted with
 * @property {string} minPriceDelta desired minimum price of the position, given in percentage points relative to current price
 * @property {string} maxPriceDelta desired maximum price of the position, given in percentage points relative to current price
 * @property {string} slippage allowed levels of slippage (in percentage points)
 * @property {string} amountTokenA amount of tokenA to be used in position
 * @property {string} amountTokenB amount of tokenB to be used in position
 * @property {string} recipient address that will receive the position's NFT
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
 * @typedef {Object} GetSwapQuotationInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} tokeIn address of the token to be swapped
 * @property {string} tokenOut address of the token swapped
 * @property {string} tradeType type of the trade, either "exact_input" or "exact_output"
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
 */
/**
 * @typedef {Object} IncreaseLiquidityInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} tokenId id of the position to be increased
 * @property {string} token0amount amount of liqudity desired to be added from token0
 * @property {string} token1amount amount of liqudity desired to be added from token1
 * @property {string} slippage allowed levels of slippage (in percentage points) 
*/
/**
 * @typedef {Object} DecreaseLiquidityInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} tokenId id of the position to be decreased
 * @property {string} percentageToDecrease percentage from the total liquidity of the position to be decreased 
 * @property {string} slippage allowed levels of slippage (in percentage points)
 * @property {string} recipient address that will receive the tokens
 * @property {boolean} burnToken whether token should be burned once entire liquidity is removed (optional, defaults to false)
*/
module.exports = {}