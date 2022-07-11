const InvalidException = require("../../errors/InvalidException")
const { Protocol } = require("../blockchain/constants")

module.exports.validateEvmTokenTransfer = ({
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
module.exports.validateEvmTokenMint = ({
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
  if (isNaN(tokenId)) {
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
module.exports.validateEvmTokenBurn = ({
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