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
 * @typedef {Object} NftCreationInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} name token name
 * @property {string} symbol token symbol
 * @property {string} amount amount to be created
 * @property {string=} uri metadata URI string for hathor and solana only, for EVMs this will be the base URI
 * @property {'ERC721'|'ERC1155'=} type token type for EVMs only
 * @property {string=} mintAuthorityAddress address responsible to mint more tokens (for hathor only)
 * @property {string=} meltAuthorityAddress address responsible to burn more tokens (for hathor only)
 * @property {string=} feeCurrency fee currency (for celo only)
 * @property {import("../../transaction/entity").Fee} fee fee
 * @property {import('../../transaction/entity').SolanaCreator[]=} creators true if this token has fixed supply (for solana only)
 * @property {number=} royaltiesFee (for solana only)
 * @property {string=} collection (for solana only)
 * 
 * @typedef {Object} NftTransferInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token name or address to transfer
 * @property {string=} destination destination address
 * @property {string | number} amount amount to be transferred
 * @property {string=} tokenId token id to be transferred only for EVMs (ethereum, bsc, celo, polygon, avax, chiliz)
 * @property {string=} feeCurrency fee currency (for celo only)
 * @property {import("../../transaction/entity").Fee} fee fee

 * 
 * @typedef {Object} NftMintInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token address to mint
 * @property {string} destination destination address
 * @property {string} amount amount to be minted
 * @property {string=} tokenId token id to be minted only for EVMs (ethereum, bsc, celo, polygon, avax, chiliz)
 * @property {string=} uri metadata URI string for EVMs this will be the base URI
 * @property {string=} mintAuthorityAddress mint authority address for hathor only
 * @property {string=} feeCurrency fee currency (for celo only)
 * @property {import("../../transaction/entity").Fee} fee fee
 * 
 * @typedef {Object} NftBurnInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token address to burn
 * @property {string} amount amount to be burnt
 * @property {string=} tokenId token id to be burnt only for EVMs (ethereum, bsc, celo, polygon, avax, chiliz)
 * @property {string=} meltAuthorityAddress melt authority address for hathor only
 * @property {string=} feeCurrency fee currency (for celo only)
 * @property {import("../../transaction/entity").Fee} fee fee

 *
 * @typedef {Object} NftApproveInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token address to invoke the approve method
 * @property {string} tokenId token id
 * @property {string} operator address to add to the set of authorized operators
 * @property {string=} feeCurrency fee currency (for celo only)
 * @property {import("../../transaction/entity").Fee} fee fee
 *
 * @typedef {Object} NftSetApprovalForAllInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token address to invoke the approve method
 * @property {string} operator address to add to the set of authorized operators
 * @property {boolean} isApproved true if the operator is approved, false to revoke approval
 * @property {string=} feeCurrency fee currency (for celo only)
* @property {import("../../transaction/entity").Fee} fee fee

 */
module.exports = {}
