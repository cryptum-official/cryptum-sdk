const hdkey = require('hdkey')
const Web3 = require('web3')
const bitcoin = require('bitcoinjs-lib')
const binance = require('@binance-chain/javascript-sdk')

/**
 * Derive path from master seed for HD wallet
 * @param {Buffer} seed HD wallet seed
 * @param {string} path derivation path
 * @param {object?} versions protocol specific versions
 * @returns {hdkey}
 */
module.exports.derivePathFromMasterSeed = (seed, path, versions) => {
  return hdkey.fromMasterSeed(seed, versions).derive(path)
}
/**
 * Build web3 account from private key
 * @param {string} privateKey private key hex string
 * @returns {object} web3 account object
 */
module.exports.privateKeyToEthAccount = privateKey => {
  const web3 = new Web3()
  return web3.eth.accounts.privateKeyToAccount(privateKey)
}
/**
 * Get Bitcoin address from private key
 * @param {string} privateKey private key hex string
 * @param {boolean?} testnet
 * @returns {string} address
 */
module.exports.getBitcoinAddressFromPrivateKey = (
  privateKey,
  testnet = true
) => {
  const keypair = bitcoin.ECPair.fromPrivateKey(
    Buffer.from(privateKey, 'hex'),
    {
      network: testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
    }
  )
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keypair.publicKey,
    network: testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
  })
  return address
}
/**
 * Get ethereum address from private key
 * @param {string} privateKey private key hex string
 * @returns {string} address
 */
module.exports.getEthereumAddressFromPrivateKey = privateKey => {
  const { address } = this.privateKeyToEthAccount(privateKey)
  return address
}
module.exports.getBscAddressFromPrivateKey = privateKey => {
  return this.getEthereumAddressFromPrivateKey(privateKey)
}
module.exports.getCeloAddressFromPrivateKey = privateKey => {
  return this.getEthereumAddressFromPrivateKey(privateKey)
}
/**
 * Get ethereum address from private key
 * @param {string} privateKey private key hex string
 * @returns {string} address
 */
module.exports.getBinancechainAddressFromPrivateKey = (privateKey, testnet = true) => {
  return binance.crypto.getAddressFromPrivateKey(
    privateKey,
    testnet ? 'tbnb' : 'bnb'
  )
}
