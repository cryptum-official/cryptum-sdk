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
 
module.exports = {}