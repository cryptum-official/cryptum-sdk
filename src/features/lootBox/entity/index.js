/**
 * @typedef {Object} DeployLootBoxFactoryInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} name loot box name
 * @property {string} symbol loot box symbol
 * @property {string=} contractURI contract URI
 * @property {string[]=} trustedForwarders trusted forwarders addresses
 * @property {string=} royaltyRecipient royalty recipient Address
 * @property {number=} royaltyBps 

 * @typedef {{ protocol:string, lootBoxId:string, amount?:string, lootBoxAddress:string; wallet:import('../../wallet/entity').Wallet }} OpenLootBoxInput

 * @typedef {{protocol:string, lootBoxAddress:string; lootBoxId:string;}} GetLootBoxContentInput
  
 * @typedef {tokenAddress:string; tokenId:string; tokenType: "ERC721" | "ERC1155" | "ERC20"; amount: string } Contents

 * @typedef {Object} ApproveContent
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} lootBoxAddress loot box contract address
 * @property {string} tokenAddress token contract address
 * @property {"ERC721" | "ERC1155" | "ERC20"} tokenType type of the token
 * @property {string} tokenId tokenId of the content (if content is an ERC-721 token)
 * @property {string} amount amount of tokens to be approved (if content is an ERC20 token)
 
 * @typedef {Object} LootBoxContent
 * @property {string} tokenAddress 
 * @property {string} tokenId 
 * @property {"ERC721" | "ERC1155" | "ERC20"} tokenType
 * @property {string} amount 
 
 * @typedef {Object} CreateLootBoxInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {LootBoxContent[]} contents lootbox tokens bounty
 * @property {string=} rewardUnits number of reward units
 * @property {string=} lootBoxURI loot box URI
 * @property {string} openStartTimestamp start time to loot box to be open
 * @property {string=} amountDistributedPerOpen
 * @property {string} recipient recipient
 * @property {string} lootBoxAddress Loot box factory contract address
 */

module.exports = {}