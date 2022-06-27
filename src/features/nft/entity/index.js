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
 * @property {string=} uri

 * @typedef {{ protocol: string, tokenUid?:string, tokenAddress?:string, tokenId?:string }} NftMetadataInput

 * @typedef {{ protocol:string, tokenUid?:string, tokenAddress?:string, tokenId?:string, address:string }} NftBalanceInfoInput

 * @typedef {{ tokenAddress:string; tokenUid: string; owner:string; amount:string; }} NftBalanceInfo 
 */
