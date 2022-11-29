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
 * @property {Array<import('../../transaction/entity').Output|import('../../transaction/entity').CardanoOutput>=} destinations destinations (for bitcoin, hathor and cardano transactions only)
 * @property {string=} issuer issuer account of the token to transfer (only for stellar and ripple transactions)
 * @property {string=} memo text to be attached to transaction (for stellar and ripple only)
 * @property {string=} feeCurrency fee currency (for celo only)
 * @property {string=} fee fee 
 */
/**
 * @typedef {Object} SetTrustlineInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} symbol token symbol
 * @property {string} issuer issuer account
 * @property {string} limit limit amount
 * 
 * @typedef {Object} TokenCreationInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} name token name
 * @property {string} symbol token symbol
 * @property {string} amount amount to be created
 * @property {string=} mintAuthorityAddress address responsible to mint more tokens (for hathor only)
 * @property {string=} meltAuthorityAddress address responsible to burn more tokens (for hathor only)
 * @property {string=} feeCurrency fee currency (for celo only)
 * @property {boolean=} fixedSupply true if this token has fixed supply (for solana only)
 * @property {number=} decimals (for solana only)
 */
/**
 * @typedef {Object} TokenMintInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token name or address to transfer
 * @property {string=} destination destination address
 * @property {string} amount amount to be transferred
 * @property {string=} mintAuthorityAddress address responsible to mint more tokens (for hathor only)
 * @property {string=} feeCurrency fee currency (for celo only)
 */
/**
 * @typedef {Object} TokenBurnInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token name or address to transfer
 * @property {string} amount amount to be transferred
 * @property {string=} meltAuthorityAddress address responsible to burn more tokens (for hathor only)
 * @property {string=} feeCurrency fee currency (for celo only)
 */
/**
 * @typedef {Object} TokenApproveInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token address to invoke the approve method
 * @property {string} amount amount to be transferred
 * @property {string} spender address allowed to withdraw tokens from this wallet
 * @property {string=} feeCurrency fee currency (for celo only)
 */
module.exports = {}
