const { GenericException } = require('../../errors')
const InvalidException = require('../../errors/InvalidException')
const BigNumber = require('bignumber.js')
const { Protocol } = require('../blockchain/constants')

module.exports.validateUniswapCreatePool = ({ protocol, wallet, fee, tokenA, tokenB, price }) => {
  const _fee = new BigNumber(fee)
  if (fee && (typeof fee !== 'number' || _fee.isNaN() || _fee.lte(0))) {
    throw new GenericException('Invalid fee amount', 'InvalidTypeException')
  }
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenA || typeof tokenA !== 'string') {
    throw new InvalidException('Invalid token Address')
  }
  if (!tokenB || typeof tokenB !== 'string') {
    throw new InvalidException('Invalid token Address')
  }
  if (!price || typeof price !== 'string') {
    throw new InvalidException('Invalid price')
  }
}

module.exports.validateUniswapGetMintPositionQuotation = ({
  protocol,
  wallet,
  amountTokenA,
  amountTokenB,
  slippage,
  pool,
  recipient,
  minPriceDelta,
  maxPriceDelta,
  deadline,
  wrapped,
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (amountTokenA && typeof amountTokenA !== 'string') {
    throw new InvalidException('Invalid amountTokenA')
  }
  if (wrapped && typeof wrapped !== 'boolean') {
    throw new InvalidException('Invalid wrapped value, must be true or false boolean')
  }
  if (amountTokenB && typeof amountTokenB !== 'string') {
    throw new InvalidException('Invalid amountTokenB')
  }
  if (amountTokenA && amountTokenB) {
    throw new InvalidException('Please provide either amountTokenA or amountTokenB, never both!')
  }
  if (!amountTokenA && !amountTokenB) {
    throw new InvalidException('Please provide amountTokenA or amountTokenB!')
  }
  if (slippage && typeof slippage !== 'string') {
    throw new InvalidException('Invalid slippage')
  } else if (slippage && +slippage > 50) {
    throw new InvalidException('Slippage percentage must be lesser than 50 (50%)')
  } else if (slippage && +slippage < 0) {
    throw new InvalidException('Slippage percentage must be a positive amount')
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
  if (+minPriceDelta < 0 || +minPriceDelta >= 100) {
    throw new InvalidException('minPriceDelta must be a value between 0 and 100%')
  }
  if (!maxPriceDelta || typeof maxPriceDelta !== 'string') {
    throw new InvalidException('Invalid maxPriceDelta')
  }
  if (+maxPriceDelta < 0 || +maxPriceDelta > 170) {
    throw new InvalidException('minPriceDelta must be a value between 0 and 170%')
  }
  if (deadline && typeof deadline !== 'string') {
    throw new InvalidException('Invalid deadline')
  } else if (deadline && +deadline > 4320) {
    throw new InvalidException('Deadline minutes must be lesser than 4320 (72hours)')
  } else if (deadline && +deadline < 0) {
    throw new InvalidException('Deadline minutes must be a positive amount')
  }
}

module.exports.validateUniswapRemovePosition = ({
  protocol,
  wallet,
  slippage,
  pool,
  recipient,
  tokenId,
  percentageToRemove,
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (slippage && typeof slippage !== 'string') {
    throw new InvalidException('Invalid slippage')
  } else if (slippage && +slippage > 50) {
    throw new InvalidException('Slippage percentage must be lesser than 50 (50%)')
  } else if (slippage && +slippage < 0) {
    throw new InvalidException('Slippage percentage must be a positive amount')
  }
  if (!pool || typeof pool !== 'string') {
    throw new InvalidException('Invalid pool')
  }
  if (recipient !== undefined && typeof recipient !== 'string') {
    throw new InvalidException('Invalid recipient')
  }
  if (!tokenId || typeof tokenId !== 'string') {
    throw new InvalidException('Invalid tokenId')
  }
  if (!percentageToRemove || typeof percentageToRemove !== 'string') {
    throw new InvalidException('Invalid percentageToRemove')
  }
}

module.exports.validateUniswapGetPools = ({ protocol, tokenA, tokenB, poolFee }) => {
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenA || typeof tokenA !== 'string') {
    throw new InvalidException('Invalid token Address')
  }
  if (!tokenB || typeof tokenB !== 'string') {
    throw new InvalidException('Invalid token Address')
  }
  const _fee = new BigNumber(poolFee)
  if (poolFee && (typeof poolFee !== 'number' || _fee.isNaN() || _fee.lte(0))) {
    throw new GenericException(
      'Invalid fee amount, must be number equals 100 or 500 or 3000 or 10000',
      'InvalidTypeException'
    )
  }
}

module.exports.validateUniswapGetPoolData = ({ protocol, poolAddress }) => {
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM, Protocol.AVAXCCHAIN, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!poolAddress || typeof poolAddress !== 'string') {
    throw new InvalidException('Invalid pool Address')
  }
}

module.exports.validateUniswapGetSwapQuotation = ({
  wallet,
  protocol,
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  slippage,
  deadline,
  recipient,
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenIn || typeof tokenIn !== 'string') {
    throw new InvalidException('Invalid token Address')
  }
  if (!tokenOut || typeof tokenOut !== 'string') {
    throw new InvalidException('Invalid token Address')
  }
  if (amountOut !== undefined && typeof amountOut !== 'string') {
    throw new InvalidException('Invalid amountOut')
  }
  if (amountIn !== undefined && typeof amountIn !== 'string') {
    throw new InvalidException('Invalid amountIn')
  }
  if (amountIn === undefined && amountOut === undefined) {
    throw new InvalidException('You must provide amountIn or amountOut')
  }
  if (amountIn && amountOut) {
    throw new InvalidException('You must provide either amountIn or amountOut, never both')
  }
  if (slippage && typeof slippage !== 'string') {
    throw new InvalidException('Invalid slippage')
  } else if (slippage && +slippage > 50) {
    throw new InvalidException('Slippage percentage must be lesser than 50 (50%)')
  } else if (slippage && +slippage < 0) {
    throw new InvalidException('Slippage percentage must be a positive amount')
  }
  if (deadline && typeof deadline !== 'string') {
    throw new InvalidException('Invalid deadline')
  } else if (deadline && +deadline > 4320) {
    throw new InvalidException('Deadline minutes must be lesser than 4320 (72hours)')
  } else if (deadline && +deadline < 0) {
    throw new InvalidException('Deadline minutes must be a positive amount')
  }
  if (recipient !== undefined && typeof recipient !== 'string') {
    throw new InvalidException('Invalid recipient')
  }
}

module.exports.validateGetTokenIds = ({ protocol, ownerAddress }) => {
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!ownerAddress || typeof ownerAddress !== 'string') {
    throw new InvalidException('Invalid ownerAddress')
  }
}
module.exports.validateGetPositions = ({ protocol, ownerAddress, poolAddress }) => {
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!ownerAddress || typeof ownerAddress !== 'string') {
    throw new InvalidException('Invalid ownerAddress')
  }
  if (poolAddress !== undefined && typeof poolAddress !== 'string') {
    throw new InvalidException('Invalid poolAddress')
  }
}

module.exports.validateGetPosition = ({ protocol, tokenId }) => {
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenId || typeof tokenId !== 'string') {
    throw new InvalidException('Invalid tokenId')
  }
}

module.exports.validateCollectFees = ({ wallet, protocol, tokenId, wrapped }) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenId || typeof tokenId !== 'string') {
    throw new InvalidException('Invalid tokenId')
  }
  if (wrapped && typeof wrapped !== 'boolean') {
    throw new InvalidException('Invalid wrapped value, must be true or false boolean')
  }
}

module.exports.validateGetIncreaseLiquidityQuotation = ({
  wallet,
  protocol,
  tokenId,
  amountTokenA,
  amountTokenB,
  slippage,
  deadline,
  wrapped,
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenId || typeof tokenId !== 'string') {
    throw new InvalidException('Invalid tokenId')
  }
  if (amountTokenA && typeof amountTokenA !== 'string') {
    throw new InvalidException('Invalid amountTokenA')
  }
  if (amountTokenB && typeof amountTokenB !== 'string') {
    throw new InvalidException('Invalid amountTokenB')
  }
  if (amountTokenA && amountTokenB) {
    throw new InvalidException('Please provide either amountTokenA or amountTokenB, never both!')
  }
  if (!amountTokenA && !amountTokenB) {
    throw new InvalidException('Please provide amountTokenA or amountTokenB!')
  }
  if (slippage && typeof slippage !== 'string') {
    throw new InvalidException('Invalid slippage')
  } else if (slippage && +slippage > 50) {
    throw new InvalidException('Slippage percentage must be lesser than 50 (50%)')
  } else if (slippage && +slippage < 0) {
    throw new InvalidException('Slippage percentage must be a positive amount')
  }
  if (deadline && typeof deadline !== 'string') {
    throw new InvalidException('Invalid deadline')
  } else if (deadline && +deadline > 4320) {
    throw new InvalidException('Deadline minutes must be lesser than 4320 (72hours)')
  } else if (deadline && +deadline < 0) {
    throw new InvalidException('Deadline minutes must be a positive amount')
  }
  if (wrapped && typeof wrapped !== 'boolean') {
    throw new InvalidException('Invalid wrapped value, must be true or false boolean')
  }
}
module.exports.validateDecreaseLiquidity = ({
  protocol,
  wallet,
  tokenId,
  percentageToDecrease,
  recipient,
  slippage,
  burnToken,
  deadline,
  wrapped,
}) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (recipient && typeof recipient !== 'string') {
    throw new InvalidException('Invalid recipient')
  }
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!tokenId || typeof tokenId !== 'string') {
    throw new InvalidException('Invalid tokenId')
  }
  if (!percentageToDecrease || typeof percentageToDecrease !== 'string') {
    throw new InvalidException('Invalid percentageToDecrease')
  }
  if (+percentageToDecrease < 0 || percentageToDecrease > 100) {
    throw new InvalidException('percentageToDecrease must be between 0% and 100%')
  }
  if (slippage && typeof slippage !== 'string') {
    throw new InvalidException('Invalid slippage')
  } else if (slippage && +slippage > 50) {
    throw new InvalidException('Slippage percentage must be lesser than 50 (50%)')
  } else if (slippage && +slippage < 0) {
    throw new InvalidException('Slippage percentage must be a positive amount')
  }
  if (burnToken && typeof burnToken !== 'boolean') {
    throw new InvalidException('Invalid burnToken type. Should be boolean.')
  }
  if (burnToken && percentageToDecrease !== '100') {
    throw new InvalidException(
      "You may only burn the position's token if the entire liquidity is being removed (10000 bps for percentageToDecrease)"
    )
  }
  if (deadline && typeof deadline !== 'string') {
    throw new InvalidException('Invalid deadline')
  } else if (deadline && +deadline > 4320) {
    throw new InvalidException('Deadline minutes must be lesser than 4320 (72hours)')
  } else if (deadline && +deadline < 0) {
    throw new InvalidException('Deadline minutes must be a positive amount')
  }
  if (wrapped && typeof wrapped !== 'boolean') {
    throw new InvalidException('Invalid wrapped value, must be true or false boolean')
  }
}

module.exports.validateObservePool = ({ protocol, pool, secondsAgoToCheck }) => {
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!pool || typeof pool !== 'string') {
    throw new InvalidException('Invalid pool')
  }
  if (!secondsAgoToCheck || typeof secondsAgoToCheck !== 'object') {
    throw new InvalidException('Invalid secondsAgoToCheck')
  }
}

module.exports.validateIncreaseCardinality = ({ wallet, protocol, pool, cardinality }) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (![Protocol.CELO, Protocol.ETHEREUM, Protocol.POLYGON].includes(protocol)) {
    throw new InvalidException('Invalid protocol')
  }
  if (!pool || typeof pool !== 'string') {
    throw new InvalidException('Invalid pool')
  }
  if (!cardinality || typeof cardinality !== 'number') {
    throw new InvalidException('Invalid cardinality')
  }
}

module.exports.validateSwap = ({ transaction, wallet }) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!transaction) {
    throw new InvalidException('missing transaction argument')
  }
}

module.exports.validateMintPosition = ({ transaction, wallet }) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!transaction) {
    throw new InvalidException('missing transaction argument')
  }
}

module.exports.validateIncreaseLiquidity = ({ transaction, wallet }) => {
  if (!wallet) {
    throw new InvalidException('Invalid wallet')
  }
  if (!transaction) {
    throw new InvalidException('missing transaction argument')
  }
}
