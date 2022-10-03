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

 * @typedef {{ protocol:string, lootBoxId:string, amount?:string, lootBoxFactoryAddress:string; wallet:import('../../wallet/entity').Wallet }} OpenLootBoxInput

 * @typedef {{protocol:string, lootBoxFactoryAddress:string; lootBoxId:string;}} GetLootBoxContentInput
  
 * @typedef {tokenAddress:string; tokenId:string; tokenType: "ERC721" | "ERC1155" | "ERC20"; amount: string } Contents

 * @typedef {Object} CreateLootBoxInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {contents[]} contents lootbox tokens bounty
 * @property {string=} rewardUnits number of reward units
 * @property {string} lootBoxURI loot box URI
 * @property {string} openStartTimestamp start time to loot box to be open
 * @property {string=} amountDistributedPerOpen
 * @property {string} recipient recipient
 * @property {string} lootBoxFactoryAddress Loot box factory contract address
 */

module.exports = {}