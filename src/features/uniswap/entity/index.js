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


module.exports = {}