/**
 * @param {'testnet'|'mainnet'|'development'|'production'} environment 
 * @returns {boolean}
 */
module.exports.isTestnet = (environment) => {
  if (['testnet', 'development'].includes(environment)) return true
  return false
}