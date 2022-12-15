const { GenericException } = require("../../errors")
const InvalidException = require("../../errors/InvalidException")
const BigNumber = require('bignumber.js')
const { Protocol } = require("../blockchain/constants")


module.exports.validateUniswapCreatePool = ({
  protocol,
  wallet,
  fee,
  tokenA,
  tokenB,
  priceNumerator,
  priceDenominator
}) => {

  const _fee = new BigNumber(fee)
  if (fee && (typeof fee !== 'number' || _fee.isNaN() || _fee.lte(0))) {
    throw new GenericException('Invalid fee amount', 'InvalidTypeException')
  }
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenA || typeof tokenA !== 'string') {
    throw new InvalidException('Invalid tokenAddress')
  }
  if (!tokenB || typeof tokenB !== 'string') {
    throw new InvalidException('Invalid tokenAddress')
  }
  if (!priceNumerator || typeof priceNumerator !== 'string') {
    throw new InvalidException('Invalid priceNumerator')
  }
  if (!priceDenominator || typeof priceDenominator !== 'string') {
    throw new InvalidException('Invalid priceDenominator')
  }
}

module.exports.validateUniswapMintPosition = ({
  protocol,
  wallet,
  amountTokenA,
  amountTokenB,
  slippage,
  pool,
  recipient,
  minPriceDelta,
  maxPriceDelta
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!amountTokenA || typeof amountTokenA !== 'string') {
    throw new InvalidException('Invalid amountTokenA')
  }
  if (!amountTokenB || typeof amountTokenB !== 'string') {
    throw new InvalidException('Invalid amountTokenB')
  }
  if (!slippage || typeof slippage !== 'string') {
    throw new InvalidException('Invalid slippage')
  }
  if (!pool || typeof pool !== 'string') {
    throw new InvalidException('Invalid pool')
  }
  if (recipient !== undefined && typeof recipient !== 'string') {
    throw new InvalidException('Invalid recipient')
  }
  if (!minPriceDelta || typeof minPriceDelta !== 'string') {
    throw new InvalidException('Invalid minPriceDelta')
  }
  if (!maxPriceDelta || typeof maxPriceDelta !== 'string') {
    throw new InvalidException('Invalid maxPriceDelta')
  }
}

module.exports.validateUniswapRemovePosition = ({
  protocol,
  wallet,
  slippage,
  pool,
  recipient,
  tokenId,
  percentageToRemove
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!slippage || typeof slippage !== 'string') {
    throw new InvalidException('Invalid slippage')
  }
  if (!pool || typeof pool !== 'string') {
    throw new InvalidException('Invalid pool')
  }
  if (recipient !== undefined && typeof recipient !== 'string') {
    throw new InvalidException('Invalid recipient')
  }
  if (!tokenId || typeof minPriceDelta !== 'string') {
    throw new InvalidException('Invalid minPriceDelta')
  }
  if (!percentageToRemove || typeof maxPriceDelta !== 'string') {
    throw new InvalidException('Invalid maxPriceDelta')
  }
}

module.exports.validateUniswapGetPools = ({
  protocol, tokenA, tokenB, poolFee
}) => {
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenA || typeof tokenA !== 'string') {
    throw new InvalidException('Invalid tokenAddress')
  }
  if (!tokenB || typeof tokenB !== 'string') {
    throw new InvalidException('Invalid tokenAddress')
  }
  const _fee = new BigNumber(poolFee)
  if (poolFee && (typeof poolFee !== 'number' || _fee.isNaN() || _fee.lte(0))) {
    throw new GenericException('Invalid fee amount, must be number equals 100 or 500 or 3000 or 10000', 'InvalidTypeException')
  }
}

module.exports.validateUniswapGetSwapQuotation = ({
  protocol, tokenIn, tokenOut, amount, tradeType
}) => {
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenIn || typeof tokenIn !== 'string') {
    throw new InvalidException('Invalid tokenAddress')
  }
  if (!tokenOut || typeof tokenOut !== 'string') {
    throw new InvalidException('Invalid tokenAddress')
  }
  const _amount = new BigNumber(amount)
  if (!amount || typeof amount !== 'number' || _amount.isNaN() || _amount.lte(0)) {
    throw new GenericException('Invalid amount', 'InvalidTypeException')
  }
  if (!tradeType || typeof tradeType !== 'string') {
    throw new InvalidException('Invalid tradeType')
  }
}

module.exports.validateGetTokenIds = ({
  protocol, ownerAddress
}) => {
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!ownerAddress || typeof ownerAddress !== 'string') {
    throw new InvalidException('Invalid ownerAddress')
  }
}
module.exports.validateGetPositions = ({
  protocol, ownerAddress, poolAddress
}) => {
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!ownerAddress || typeof ownerAddress !== 'string') {
    throw new InvalidException('Invalid ownerAddress')
  }
  if (poolAddress !== undefined && typeof poolAddress !== 'string') {
    throw new InvalidException('Invalid poolAddress')
  }
}

module.exports.validateGetPosition = ({
  protocol, tokenId
}) => {
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenId || typeof tokenId !== 'string') {
    throw new InvalidException('Invalid tokenId')
  }
}

module.exports.validateCollectFees = ({
  wallet, protocol, tokenId
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenId || typeof tokenId !== 'string') {
    throw new InvalidException('Invalid tokenId')
  }
}

module.exports.validateIncreaseLiquidity = ({
  wallet, protocol, tokenId, token0amount, token1amount, slippage
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenId || typeof tokenId !== 'string') {
    throw new InvalidException('Invalid tokenId')
  }
  if (!token0amount || typeof token0amount !== 'string') {
    throw new InvalidException('Invalid token0amount')
  }
  if (!token1amount || typeof token1amount !== 'string') {
    throw new InvalidException('Invalid token1amount')
  }
  if (!slippage || typeof slippage !== 'string') {
    throw new InvalidException('Invalid slippage')
  }
}

module.exports.validateDecreaseLiquidity = ({
  wallet, protocol, tokenId, percentageToDecrease, recipient, slippage, burnToken
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenId || typeof tokenId !== 'string') {
    throw new InvalidException('Invalid tokenId')
  }
  if (!percentageToDecrease || typeof percentageToDecrease !== 'string') {
    throw new InvalidException('Invalid percentageToDecrease')
  }
  if (recipient !== undefined && typeof recipient !== 'string') {
    throw new InvalidException('Invalid recipient')
  }
  if (!slippage || typeof slippage !== 'string') {
    throw new InvalidException('Invalid slippage')
  }
  if (burnToken && typeof burnToken !== 'boolean') {
    throw new InvalidException('Invalid burnToken type. Should be boolean.')
  }
  if (burnToken && percentageToDecrease !== '10000') {
    throw new InvalidException('You may only burn the position\'s token if the entire liquidity is being removed (10000 bps for percentageToDecrease)')
  }
}