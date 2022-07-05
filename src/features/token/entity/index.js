/**
 * @typedef {Object} TokenInfoInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string=} tokenUid
 * @property {string=} tokenAddress
 */
/**
 * @typedef {Object} TokenInfo
 * @property {string=} name
 * @property {string=} symbol
 * @property {string=} totalSupply
 * @property {string=} address
 */
/**
 * @typedef {Object} TokenTransferInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token name or address to transfer
 * @property {string=} destination destination address
 * @property {string} amount amount to be transferred
 * @property {Array<import('../../transaction/entity').Output>=} destinations destinations only for bitcoin, hathor and cardano transactions
 * @property {string=} issuer issuer account of the token to transfer (only for stellar and ripple transactions)
 * @property {string=} memo text to be attached to transaction
 */