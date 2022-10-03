const { GenericException } = require("../../errors")
const InvalidException = require("../../errors/InvalidException")
const BigNumber = require('bignumber.js')
const { Protocol } = require("../blockchain/constants")


module.exports.validateLootBoxDeploy = ({
  protocol,
  wallet,
  name,
  symbol,
  royaltyRecipient,
  trustedForwarders,
  royaltyBps
}) => {

  const _royaltyBps = new BigNumber(royaltyBps)
  if (royaltyBps && (typeof royaltyBps !== 'royaltyBps' || _royaltyBps.isNaN() || _royaltyBps.lte(0))) {
    throw new GenericException('Invalid amount', 'InvalidTypeException')
  }
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!name || typeof name !== 'string') {
    throw new InvalidException('Invalid name')
  }
  if (!symbol || typeof symbol !== 'string') {
    throw new InvalidException('Invalid symbol')
  }
  if (royaltyRecipient && typeof royaltyRecipient !== 'string') {
    throw new InvalidException('Invalid royaltyRecipient')
  }
  if (trustedForwarders && (!Array.isArray(trustedForwarders) || !trustedForwarders.length)) {
    throw new GenericException(
      'Invalid parameter trustedForwarders, it should be an array with length larger than 0',
      'InvalidTypeException'
    )
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
}

module.exports.validateLootBoxCreation = ({
  protocol,
  contents,
  wallet,
  lootBoxFactoryAddress,
  lootBoxURI,
  openStartTimestamp,
  recipient,
  amountDistributedPerOpen,
  rewardUnits
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!Array.isArray(contents) || !contents.length) {
    throw new GenericException(
      'Invalid parameter contents, it should be an array with length larger than 0',
      'InvalidTypeException'
    )
  }
  if (!lootBoxFactoryAddress || typeof lootBoxFactoryAddress !== 'string') {
    throw new InvalidException('Invalid lootBoxFactoryAddress')
  }
  if (lootBoxURI && typeof lootBoxURI !== 'string') {
    throw new InvalidException('Invalid lootBoxURI')
  }
  if (!openStartTimestamp || typeof openStartTimestamp !== 'string') {
    throw new InvalidException('Invalid openStartTimestamp')
  }
  if (!recipient || typeof recipient !== 'string') {
    throw new InvalidException('Invalid recipient')
  }
  if (amountDistributedPerOpen && typeof amountDistributedPerOpen !== 'string') {
    throw new InvalidException('Invalid amountDistributedPerOpen')
  }
  if (rewardUnits && (!Array.isArray(rewardUnits) || !contents.length)) {
    throw new GenericException(
      'Invalid parameter rewardUnits, it should be an array with length larger than 0',
      'InvalidTypeException'
    )
  }
}

module.exports.validateLootBoxOpening = ({
  protocol,
  wallet,
  lootBoxId,
  amount,
  lootBoxFactoryAddress
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (lootBoxId && isNaN(lootBoxId)) {
    throw new InvalidException('Invalid lootBoxId')
  }
  const _amount = new BigNumber(amount)
  if (amount && (!amount || typeof amount !== 'string' || _amount.isNaN() || _amount.lte(0))) {
    throw new GenericException('Invalid amount', 'InvalidTypeException')
  }
  if (!lootBoxFactoryAddress || typeof lootBoxFactoryAddress !== 'string') {
    throw new InvalidException('Invalid lootBoxFactoryAddress')
  }
}

module.exports.validateApproveContent = ({
  protocol,
  wallet,
  lootboxAddress,
  tokenAddress,
  tokenId,
  tokenType,
  amount
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!lootboxAddress || typeof lootboxAddress !== 'string') {
    throw new InvalidException('Invalid lootboxAddress')
  }
  if (!tokenAddress || typeof tokenAddress !== 'string') {
    throw new InvalidException('Invalid tokenAddress')
  }
  if(!tokenType){
    throw new InvalidException('Invalid tokenType')
  }
  if ((tokenType==='ERC20') && (!amount || typeof amount !== 'string')) {
    throw new InvalidException('Invalid amount')
  }
  if ((tokenType==='ERC721') && (!tokenId || typeof tokenId !== 'string')) {
    throw new InvalidException('Invalid tokenId')
  }
}

module.exports.validateLootBoxGetContent = ({
  protocol,
  lootBoxId,
  lootBoxFactoryAddress
}) => {
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (lootBoxId && isNaN(lootBoxId)) {
    throw new InvalidException('Invalid lootBoxId')
  }
  if (!lootBoxFactoryAddress || typeof lootBoxFactoryAddress !== 'string') {
    throw new InvalidException('Invalid lootBoxFactoryAddress')
  }
}