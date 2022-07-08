/**
 * @typedef {Object} TokenInfoInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string=} tokenUid token uid for hathor only
 * @property {string=} tokenAddress
 */
/**
 * @typedef {Object} TokenInfo
 * @property {string} name
 * @property {string} symbol
 * @property {string=} totalSupply
 * @property {string=} tokenAddress
 * @property {string=} decimals
 */
/**
 * @typedef {{ protocol: string, tokenUid?:string, tokenAddress?:string, tokenId?:string }} TokenMetadataInput

 * @typedef {{ protocol:string, tokenUid?:string, tokenAddress?:string, tokenId?:string, address:string }} TokenBalanceInfoInput

 * @typedef {{ tokenAddress?:string; tokenUid?: string; owner:string; balance:string; }} TokenBalanceInfo 
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
 * @property {string=} feeCurrency fee currency for only celo
 */
/**
 * @typedef {Object} HathorTokenOptions
 * @property {string=} mintAuthorityAddress
 * @property {string=} meltAuthorityAddress
 * 
 * @typedef {Object} CeloTokenOptions
 * @property {string=} feeCurrency
 * 
 * @typedef {Object} SolanaTokenOptions
 * @property {boolean} fixedSupply
 * @property {number} decimals
 * 
 * @typedef {Object} TokenCreationInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} name token name
 * @property {string} symbol token symbol
 * @property {string} amount amount to be created
 * @property {HathorTokenOptions|SolanaTokenOptions|CeloTokenOptions=} options
 */
/**
 * @typedef {Object} TokenMintInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token name or address to transfer
 * @property {string=} destination destination address
 * @property {string} amount amount to be transferred
 * @property {HathorTokenOptions|CeloTokenOptions=} options
 */
/**
 * @typedef {Object} TokenBurnInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token name or address to transfer
 * @property {string=} destination destination address
 * @property {string} amount amount to be transferred
 * @property {HathorTokenOptions|CeloTokenOptions=} options
 */
module.exports = {}
