const AxiosApi = require("../../../axios")
const { isTestnet } = require("../../utils")

module.exports.getSolanaNetwork = (testnet = true) => {
	return testnet ? 'devnet' : 'mainnet-beta'
}

module.exports.getSolanaConnectionUrl = (config) => {
  const url = new AxiosApi().getBaseUrl(isTestnet(config.environment) ? 'testnet' : 'mainnet')
  return `${url}/rpc?protocol=SOLANA&apikey=${config.apiKey}`
}
module.exports.getSolanaWsConnectionUrl = (config) => {
  const url = new AxiosApi().getBaseUrl(isTestnet(config.environment) ? 'testnet' : 'mainnet')
  return `${url.replace('http', 'ws')}/rpc?protocol=SOLANA&apikey=${config.apiKey}`
}