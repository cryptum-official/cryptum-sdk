const InvalidException = require("../../errors/InvalidException")
const { Protocol, TOKEN_TYPES } = require("../blockchain/constants")

module.exports.validateEvmNftTransfer = ({
  wallet,
  token,
  destination,
  tokenId,
  amount,
  protocol,
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!token || typeof token !== 'string') {
    throw new InvalidException('Invalid token address')
  }
  if (!destination || typeof destination !== 'string') {
    throw new InvalidException('Invalid destination address')
  }
  if (isNaN(tokenId)) {
    throw new InvalidException('Invalid token id')
  }
  if (amount && Number(amount) < 0) {
    throw new InvalidException('Invalid amount')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
}
module.exports.validateEvmTokenCreation = ({
  wallet,
  type,
  name,
  symbol,
  uri,
  amount,
  protocol,
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!type || ![TOKEN_TYPES.ERC721, TOKEN_TYPES.ERC1155].includes(type)) {
    throw new InvalidException('Invalid token type, must be "ERC721" or "ERC1155"')
  }
  if (!name || typeof name !== 'string') {
    throw new InvalidException('Invalid name')
  }
  if (!symbol || typeof symbol !== 'string') {
    throw new InvalidException('Invalid symbol')
  }
  if (uri && typeof uri !== 'string') {
    throw new InvalidException('Invalid uri')
  }
  if (amount && Number(amount) < 0) {
    throw new InvalidException('Invalid amount')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
}
module.exports.validateEvmTokenMint = ({
  wallet,
  token,
  destination,
  amount,
  protocol,
  feeCurrency
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!token || typeof token !== 'string') {
    throw new InvalidException('Invalid token address')
  }
  if (!destination || typeof destination !== 'string') {
    throw new InvalidException('Invalid destination address')
  }
  if (amount !== undefined && (isNaN(amount) || Number(amount) < 0)) {
    throw new InvalidException('Invalid amount')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (feeCurrency && typeof feeCurrency !== 'string') {
    throw new InvalidException('Invalid feeCurrency')
  }

}
module.exports.validateEvmTokenBurn = ({
  wallet,
  token,
  amount,
  protocol,
  feeCurrency
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!token || typeof token !== 'string') {
    throw new InvalidException('Invalid token address')
  }
  if (amount !== undefined && (isNaN(amount) || Number(amount) < 0)) {
    throw new InvalidException('Invalid amount')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (feeCurrency && typeof feeCurrency !== 'string') {
    throw new InvalidException('Invalid feeCurrency')
  }
}
module.exports.validateEvmNftMint = ({
  wallet,
  token,
  tokenId,
  destination,
  amount,
  protocol,
  feeCurrency
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!token || typeof token !== 'string') {
    throw new InvalidException('Invalid token address')
  }
  if (tokenId && isNaN(tokenId)) {
    throw new InvalidException('Invalid token id')
  }
  if (!destination || typeof destination !== 'string') {
    throw new InvalidException('Invalid destination address')
  }
  if (amount !== undefined && (isNaN(amount) || Number(amount) < 0)) {
    throw new InvalidException('Invalid amount')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (feeCurrency && typeof feeCurrency !== 'string') {
    throw new InvalidException('Invalid feeCurrency')
  }

}
module.exports.validateEvmNftBurn = ({
  wallet,
  token,
  tokenId,
  amount,
  protocol,
  feeCurrency
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!token || typeof token !== 'string') {
    throw new InvalidException('Invalid token address')
  }
  if (isNaN(tokenId)) {
    throw new InvalidException('Invalid token id')
  }
  if (amount !== undefined && (isNaN(amount) || Number(amount) < 0)) {
    throw new InvalidException('Invalid amount')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (feeCurrency && typeof feeCurrency !== 'string') {
    throw new InvalidException('Invalid feeCurrency')
  }
}