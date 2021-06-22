const { default: BigNumber } = require('bignumber.js')
const { Protocol, CUSD_CONTRACT_ADDRESS, CEUR_CONTRACT_ADDRESS } = require('./constants')

module.exports.getTokenAddress = (protocol, assetSymbol, testnet = true) => {
  const network = testnet ? 'testnet' : 'mainnet'
  if (protocol === Protocol.CELO) {
    if (assetSymbol === 'cUSD') {
      return CUSD_CONTRACT_ADDRESS[network]
    } else if (assetSymbol === 'cEUR') {
      return CEUR_CONTRACT_ADDRESS[network]
    }
  }
  return null
}

module.exports.toSatoshi = (btc) => new BigNumber(btc).times('1e8')
module.exports.fromSatoshi = (satoshi) => new BigNumber(new BigNumber(satoshi).div('1e8').toFixed(0))
