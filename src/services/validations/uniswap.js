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
    if (!amount || typeof amount !== 'string' || _amount.isNaN() || _amount.lte(0)) {
      throw new GenericException('Invalid amount', 'InvalidTypeException')
    }
    if (!tradeType || typeof tradeType !== 'string') {
        throw new InvalidException('Invalid tradeType')
    }
}
