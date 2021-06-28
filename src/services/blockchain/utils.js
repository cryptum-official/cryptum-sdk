const { default: BigNumber } = require('bignumber.js')
const { Protocol, CUSD_CONTRACT_ADDRESS, CEUR_CONTRACT_ADDRESS, CELO_CONTRACT_ADDRESS } = require('./constants')

module.exports.getTokenAddress = (protocol, tokenSymbol, testnet = true) => {
  const network = testnet ? 'testnet' : 'mainnet'
  if (protocol === Protocol.CELO) {
    if (tokenSymbol === 'CELO') {
      return CELO_CONTRACT_ADDRESS[network]
    } else if (tokenSymbol === 'cUSD') {
      return CUSD_CONTRACT_ADDRESS[network]
    } else if (tokenSymbol === 'cEUR') {
      return CEUR_CONTRACT_ADDRESS[network]
    }
  }
  return null
}

module.exports.toSatoshi = (btc) => new BigNumber(btc).times('1e8')
module.exports.fromSatoshi = (satoshi) => new BigNumber(new BigNumber(satoshi).div('1e8').toFixed(0))
module.exports.toWei = (eth) => new BigNumber(eth).times('1e18')
module.exports.fromWei = (wei) => new BigNumber(new BigNumber(wei).div('1e18').toFixed(0))
module.exports.toStroop = (xlm) => new BigNumber(xlm).times('1e7')
module.exports.fromStroop = (stroop) => new BigNumber(new BigNumber(stroop).div('1e7').toFixed(0))
module.exports.toDrop = (xrp) => new BigNumber(xrp).times('1e6')
module.exports.fromDrop = (drop) => new BigNumber(new BigNumber(drop).div('1e6').toFixed(0))
