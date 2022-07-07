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
 * @typedef {Object} NftTransferInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token token name or address to transfer
 * @property {string=} destination destination address
 * @property {string | number} amount amount to be transferred
 * @property {string=} tokenId token id to be transferred only for EVMs (ethereum, bsc, celo, polygon)
 * @property {Array<import('../../transaction/entity').Output>=} destinations destinations only for bitcoin, hathor and cardano transactions
 */
module.exports = {}
