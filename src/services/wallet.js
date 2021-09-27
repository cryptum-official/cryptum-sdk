const { hdkey } = require('ethereumjs-wallet')
const Web3 = require('web3')
const bitcoin = require('bitcoinjs-lib')
const { mnemonicToSeed, mnemonicToEntropy } = require('bip39')
const stellarHdWallet = require('stellar-hd-wallet')
const rippleKeyPairs = require('ripple-keypairs')
const { Keypair } = require('stellar-sdk')

const DERIVATION_PATH_TEMPLATE = "m/44'/{coin}'/{account}'/{change}/{address}"

const getDerivationPath = ({ coin, account = 0, change, address }) => {
  let path = DERIVATION_PATH_TEMPLATE.replace('{coin}', coin).replace('{account}', account)
  if (change !== undefined && typeof change === 'number') {
    path = path.replace('{change}', change)
  } else {
    path = path.replace('/{change}', '')
  }
  if (address !== undefined && typeof address === 'number') {
    if (change === undefined || change === null) {
      throw new Error('Derivation path change index must be set too')
    }
    path = path.replace('{address}', address)
  } else {
    path = path.replace('/{address}', '')
  }
  return path
}

const getBitcoinDerivationPath = ({ account = 0, change, address }) =>
  getDerivationPath({ coin: 0, account, change, address })
const getTestnetDerivationPath = ({ account = 0, change, address }) =>
  getDerivationPath({ coin: 1, account, change, address })
const getEthereumDerivationPath = ({ account = 0, change, address }) =>
  getDerivationPath({ coin: 60, account, change, address })
const getCeloDerivationPath = ({ account = 0, change, address }) =>
  getDerivationPath({ coin: 52752, account, change, address })

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
 * Derive bitcoin addresses from extended public key (xpub)
 *
 * @param {string} xpub extended public key string
 * @param {boolean} testnet true or false for testnet
 * @param {object?} derivationPath derivation path object
 * @param {number} derivationPath.address derivation path address index
 * @returns
 */
module.exports.deriveBitcoinAddressFromXpub = async (xpub, testnet, { address = 0 } = {}) => {
  const network = testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
  const derivedPath = bitcoin.bip32.fromBase58(xpub, network).derive(address)
  const { address: btcAddress } = bitcoin.payments.p2pkh({
    pubkey: derivedPath.publicKey,
    network,
  })
  return btcAddress
}
/**
 * Derive bitcoin address, private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @param {boolean} testnet true or false for testnet
 * @param {object?} derivationPath derivation path object
 * @param {number} derivationPath.account derivation path account index
 * @param {number} derivationPath.change derivation path change index
 * @param {number} derivationPath.address derivation path address index
 * @returns
 */
module.exports.deriveBitcoinWalletFromDerivationPath = async (
  mnemonic,
  testnet,
  { account = 0, change = 0, address } = {}
) => {
  const network = testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
  const derivedPath = bitcoin.bip32
    .fromSeed(await mnemonicToSeed(mnemonic), network)
    .derivePath(
      testnet
        ? getTestnetDerivationPath({ account, change, address })
        : getBitcoinDerivationPath({ account, change, address })
    )
  const btcAddress = this.getBitcoinAddressFromPrivateKey(derivedPath.privateKey.toString('hex'), testnet)
  return {
    address: btcAddress,
    privateKey: derivedPath.privateKey.toString('hex'),
    publicKey: derivedPath.publicKey.toString('hex'),
  }
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
 * Get ethereum address from private key
 *
 * @param {string} privateKey private key hex string
 * @returns {string} address
 */
module.exports.getEthereumAddressFromPrivateKey = (privateKey) => {
  const { address } = this.privateKeyToEthAccount(privateKey)
  return address.toLowerCase()
}
/**
 * Derive ethereum address, private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @param {object?} derivationPath derivation path object
 * @param {number} derivationPath.account derivation path account index
 * @param {number} derivationPath.change derivation path change index
 * @param {number} derivationPath.address derivation path address index
 * @returns
 */
module.exports.deriveEthereumWalletFromDerivationPath = async (mnemonic, { account = 0, change = 0, address } = {}) => {
  const derivedPath = hdkey
    .fromMasterSeed(await mnemonicToSeed(mnemonic))
    .derivePath(getEthereumDerivationPath({ account, change, address }))
  const wallet = derivedPath.getWallet()

  return {
    address: wallet.getAddressString().toLocaleLowerCase(),
    privateKey: wallet.getPrivateKeyString(),
    publicKey: wallet.getPublicKeyString(),
  }
}
/**
 * Derive ethereum addresses from extended public key (xpub)
 *
 * @param {string} xpub extended public key string
 * @param {object?} derivationPath derivation path object
 * @param {number} derivationPath.address derivation path address index
 * @returns
 */
module.exports.deriveEthereumAddressFromXpub = async (xpub, { address = 0 } = {}) => {
  const derivedPath = hdkey.fromExtendedKey(xpub).deriveChild(address)
  return `0x${derivedPath.getWallet().getAddressString().toLowerCase()}`
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
 * @param {number} derivationPath.account derivation path account index
 * @param {number} derivationPath.change derivation path change index
 * @param {number} derivationPath.address derivation path address index
 * @returns
 */
module.exports.deriveCeloWalletFromDerivationPath = async (mnemonic, { account = 0, change = 0, address } = {}) => {
  const derivedPath = hdkey
    .fromMasterSeed(await mnemonicToSeed(mnemonic))
    .derivePath(getCeloDerivationPath({ account, change, address }))
  const wallet = derivedPath.getWallet()

  return {
    address: wallet.getAddressString().toLocaleLowerCase(),
    privateKey: wallet.getPrivateKeyString(),
    publicKey: wallet.getPublicKeyString(),
  }
}
module.exports.deriveCeloAddressFromXpub = async (xpub, { address = 0 } = {}) =>
  this.deriveEthereumAddressFromXpub(xpub, { address })
module.exports.deriveBscAddressFromXpub = async (xpub, { address = 0 } = {}) =>
  this.deriveEthereumAddressFromXpub(xpub, { address })
/**
 * Derive stellar private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @param {object?} derivationPath
 * @param {number} derivationPath.account account index
 * @returns
 */
module.exports.deriveStellarWalletFromDerivationPath = (mnemonic, { account = 0 }) => {
  const keypair = stellarHdWallet.fromMnemonic(mnemonic)
  return {
    publicKey: keypair.getPublicKey(account),
    privateKey: keypair.getSecret(account),
  }
}
module.exports.getStellarPublicKeyFromPrivateKey = (privateKey) => {
  return Keypair.fromSecret(privateKey).publicKey()
}
/**
 * Derive ripple address, private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @param {number} derivationPath.account derivation path account index
 * @returns
 */
module.exports.deriveRippleWalletFromDerivationPath = (mnemonic, { account = 0 } = {}) => {
  const seed = rippleKeyPairs.generateSeed({
    entropy: mnemonicToEntropy(mnemonic),
    algorithm: 'ecdsa-secp256k1',
  })
  const keypair = rippleKeyPairs.deriveKeypair(seed, { accountIndex: account })
  const address = rippleKeyPairs.deriveAddress(keypair.publicKey)
  return { address, publicKey: keypair.publicKey, privateKey: seed }
}

module.exports.getRippleAddressFromPrivateKey = (privateKey) => {
  const keypair = rippleKeyPairs.deriveKeypair(privateKey)
  const address = rippleKeyPairs.deriveAddress(keypair.publicKey)
  return address
}
