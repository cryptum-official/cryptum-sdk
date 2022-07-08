/**
 * @typedef {Object} NftInfoInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string=} tokenUid
 * @property {string=} tokenAddress

 * @typedef {Object} NftInfo
 * @property {string=} name
 * @property {string=} symbol
 * @property {string=} tokenAddress
 * @property {string=} type
 * @property {string=} tokenUid
 * @property {string=} totalSupply
 * @property {string=} nftData

 * @typedef {{ protocol: string, tokenUid?:string, tokenAddress?:string, tokenId?:string }} NftMetadataInput
 * @typedef {{ tokenUid?:string, tokenAddress?:string, uri:string, metadata?:any }} NftMetadata

 * @typedef {{ protocol:string, tokenUid?:string, tokenAddress?:string, tokenId?:string, address:string }} NftBalanceInfoInput

 * @typedef {{ tokenAddress?:string; tokenUid?: string; owner:string; balance:string; }} NftBalanceInfo 
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
 * @property {import('../../transaction/entity').SolanaCreator[]=} creators
 * @property {number=} royaltiesFee
 * @property {=} collection
 */
/**
 * @typedef {Object} NftCreationInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} name token name
 * @property {string} symbol token symbol
 * @property {string} amount amount to be created
 * @property {string=} uri metadata URI string for hathor and solana only
 * @property {HathorTokenOptions|CeloTokenOptions|SolanaTokenOptions=} options
 * 
 * @typedef {Object} NftTransferInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token name or address to transfer
 * @property {string=} destination destination address
 * @property {string | number} amount amount to be transferred
 * @property {string=} tokenId token id to be transferred only for EVMs (ethereum, bsc, celo, polygon, avax)
 * @property {Array<import('../../transaction/entity').Output>=} destinations destinations only for bitcoin, hathor and cardano transactions
 * 
 * @typedef {Object} NftMintInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token name or address to transfer
 * @property {string=} destination destination address
 * @property {string} amount amount to be transferred
 * @property {string=} tokenId token id to be transferred only for EVMs (ethereum, bsc, celo, polygon, avax)
 * @property {HathorTokenOptions|CeloTokenOptions=} options
 * 
 * @typedef {Object} NftBurnInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token name or address to transfer
 * @property {string=} destination destination address
 * @property {string} amount amount to be transferred
 * @property {string=} tokenId token id to be transferred only for EVMs (ethereum, bsc, celo, polygon, avax)
 * @property {HathorTokenOptions|CeloTokenOptions=} options
 */
module.exports = {}
