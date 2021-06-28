const hdkey = require('hdkey')
const Web3 = require('web3')
const bitcoin = require('bitcoinjs-lib')
const binance = require('@binance-chain/javascript-sdk')
const { mnemonicToSeed, mnemonicToEntropy } = require('bip39')
const stellarHdWallet = require('stellar-hd-wallet')
const rippleKeyPairs = require('ripple-keypairs')
const { Keypair } = require('stellar-sdk')

const TESTNET_DERIVATION_PATH = "m/44'/1'/0'/0"
const BITCOIN_DERIVATION_PATH = "m/44'/0'/0'/0"
const ETHEREUM_DERIVATION_PATH = "m/44'/60'/0'/0"
const CELO_DERIVATION_PATH = "m/44'/52752'/0'/0"

/**
 * Derive path from master seed for HD wallet
 *
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
 *
 * @param {string} privateKey private key hex string
 * @returns {object} web3 account object
 */
module.exports.privateKeyToEthAccount = (privateKey) => {
  const web3 = new Web3()
  return web3.eth.accounts.privateKeyToAccount(privateKey)
}
/**
 * Get Bitcoin address from private key
 *
 * @param {string} privateKey private key hex string
 * @param {boolean?} testnet
 * @returns {string} address
 */
module.exports.getBitcoinAddressFromPrivateKey = (privateKey, testnet = true) => {
  const keypair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), {
    network: testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
  })
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keypair.publicKey,
    network: testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
  })
  return address
}

/**
 * Derive bitcoin address, private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @param {boolean} testnet true or false for testnet
 * @returns
 */
module.exports.deriveBitcoinWallet = async (mnemonic, testnet) => {
  const network = testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
  const derivedPath = this.derivePathFromMasterSeed(
    await mnemonicToSeed(mnemonic),
    testnet ? TESTNET_DERIVATION_PATH : BITCOIN_DERIVATION_PATH,
    network.bip32
  )
  const address = this.getBitcoinAddressFromPrivateKey(derivedPath.privateKey.toString('hex'), testnet)
  return {
    address,
    privateKey: derivedPath.privateKey.toString('hex'),
    publicKey: derivedPath.publicKey.toString('hex'),
  }
}
/**
 * Get ethereum address from private key
 *
 * @param {string} privateKey private key hex string
 * @returns {string} address
 */
module.exports.getEthereumAddressFromPrivateKey = (privateKey) => {
  const { address } = this.privateKeyToEthAccount(privateKey)
  return address
}
/**
 * Derive ethereum address, private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @param {boolean} testnet true or false for testnet
 * @returns
 */
module.exports.deriveEthereumWallet = async (mnemonic, testnet) => {
  const derivedPath = this.derivePathFromMasterSeed(
    await mnemonicToSeed(mnemonic),
    testnet ? TESTNET_DERIVATION_PATH : ETHEREUM_DERIVATION_PATH
  )
  const address = this.getEthereumAddressFromPrivateKey(derivedPath.privateKey.toString('hex'))
  return {
    address,
    privateKey: derivedPath.privateKey.toString('hex'),
    publicKey: derivedPath.publicKey.toString('hex'),
  }
}
module.exports.getBscAddressFromPrivateKey = (privateKey) => {
  return this.getEthereumAddressFromPrivateKey(privateKey)
}
module.exports.getCeloAddressFromPrivateKey = (privateKey) => {
  return this.getEthereumAddressFromPrivateKey(privateKey)
}
/**
 * Derive celo address, private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @returns
 */
module.exports.deriveCeloWallet = async (mnemonic) => {
  const derivedPath = this.derivePathFromMasterSeed(await mnemonicToSeed(mnemonic), CELO_DERIVATION_PATH)
  const address = this.getCeloAddressFromPrivateKey(derivedPath.privateKey.toString('hex'))
  return {
    address,
    publicKey: derivedPath.publicKey.toString('hex'),
    privateKey: derivedPath.privateKey.toString('hex'),
  }
}
/**
 * Get ethereum address from private key
 *
 * @param {string} privateKey private key hex string
 * @param testnet
 * @returns {string} address
 */
module.exports.getBinancechainAddressFromPrivateKey = (privateKey, testnet = true) => {
  return binance.crypto.getAddressFromPrivateKey(privateKey, testnet ? 'tbnb' : 'bnb')
}
/**
 * Derive binance chain address, private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @param {boolean} testnet true or false for testnet
 * @returns
 */
module.exports.deriveBinancechainWallet = (mnemonic, testnet) => {
  const privateKey = binance.crypto.getPrivateKeyFromMnemonic(mnemonic, true, 0)
  const publicKey = binance.crypto.getPublicKeyFromPrivateKey(privateKey)
  const address = this.getBinancechainAddressFromPrivateKey(privateKey, testnet)
  return { address, publicKey, privateKey }
}
/**
 * Derive stellar private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @returns
 */
module.exports.deriveStellarWallet = (mnemonic) => {
  const keypair = stellarHdWallet.fromMnemonic(mnemonic)
  return {
    publicKey: keypair.getPublicKey(0),
    privateKey: keypair.getSecret(0),
  }
}
module.exports.getStellarPublicKeyFromPrivateKey = (privateKey) => {
  return Keypair.fromSecret(privateKey).publicKey()
}
/**
 * Derive ripple address, private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @returns
 */
module.exports.deriveRippleWallet = (mnemonic) => {
  const seed = rippleKeyPairs.generateSeed({
    entropy: mnemonicToEntropy(mnemonic),
  })
  const keypair = rippleKeyPairs.deriveKeypair(seed)
  const address = rippleKeyPairs.deriveAddress(keypair.publicKey)
  return { address, publicKey: keypair.publicKey, privateKey: seed }
}

module.exports.getRippleAddressFromPrivateKey = (privateKey) => {
  const keypair = rippleKeyPairs.deriveKeypair(privateKey)
  const address = rippleKeyPairs.deriveAddress(keypair.publicKey)
  return address
}
