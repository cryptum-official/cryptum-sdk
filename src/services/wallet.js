const { hdkey } = require('ethereumjs-wallet')
const Web3 = require('web3')
const bitcoin = require('bitcoinjs-lib')
const { mnemonicToSeed, mnemonicToEntropy } = require('bip39')
const stellarHdWallet = require('stellar-hd-wallet')
const rippleKeyPairs = require('ripple-keypairs')
const { Keypair } = require('stellar-sdk')
const hathorSdk = require('@hathor/wallet-lib')
const bitcore = require('bitcore-lib')
const {
  bech32,
  derivePrivate,
  derivePublic,
  getPubKeyBlake2b224Hash,
  mnemonicToRootKeypair,
  packBaseAddress,
} = require('cardano-crypto.js')

const DERIVATION_PATH_TEMPLATE = "m/{purpose}'/{coin}'/{account}'/{change}/{address}"

const getDerivationPath = ({ purpose, coin, account = 0, change, address }) => {
  let path = DERIVATION_PATH_TEMPLATE.replace('{purpose}', purpose).replace('{coin}', coin).replace('{account}', account)
  if (change !== undefined && typeof change === 'number') {
    path = path.replace('{change}', change)
  } else {
    path = path.replace('/{change}', '')
  }
  if (address !== undefined && typeof address === 'number') {
    path = path.replace('{address}', address)
  } else {
    path = path.replace('/{address}', '')
  }
  return path
}

const getBitcoinDerivationPath = ({ account = 0, change, address }) =>
  getDerivationPath({ purpose: 44, coin: 0, account, change, address })
const getTestnetDerivationPath = ({ account = 0, change, address }) =>
  getDerivationPath({ purpose: 44, coin: 1, account, change, address })
const getEthereumDerivationPath = ({ account = 0, change, address }) =>
  getDerivationPath({ purpose: 44, coin: 60, account, change, address })
const getCeloDerivationPath = ({ account = 0, change, address }) =>
  getDerivationPath({ purpose: 44, coin: 52752, account, change, address })
const getHathorDerivationPath = ({ account = 0, address }) =>
  getDerivationPath({ purpose: 44, coin: 280, account, address })
const getCardanoDerivationPath = ({ account = 0, address }) =>
  getDerivationPath({ purpose: 1852, coin: 1815, account, address })


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
module.exports.deriveBitcoinAddressFromXpub = (xpub, testnet, { address = 0 } = {}) => {
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
  const accountIndex = account !== undefined ? account : 0
  const changeIndex = change !== undefined ? change : 0
  const addressIndex = address !== undefined ? address : 0
  const derivedPath = bitcoin.bip32
    .fromSeed(await mnemonicToSeed(mnemonic), network)
    .derivePath(
      testnet
        ? getTestnetDerivationPath({ account: accountIndex, change: changeIndex })
        : getBitcoinDerivationPath({ account: accountIndex, change: changeIndex })
    )
  const xpub = derivedPath.neutered().toBase58()
  const btcAddress = this.deriveBitcoinAddressFromXpub(xpub, testnet, { address: addressIndex })
  const privkeyDerived = derivedPath.derive(addressIndex)

  return {
    address: btcAddress,
    privateKey: privkeyDerived.privateKey.toString('hex'),
    publicKey: privkeyDerived.publicKey.toString('hex'),
    xpub,
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
  const accountIndex = account !== undefined ? account : 0
  const changeIndex = change !== undefined ? change : 0
  const addressIndex = address !== undefined ? address : 0
  const derivedPath = hdkey
    .fromMasterSeed(await mnemonicToSeed(mnemonic))
    .derivePath(getEthereumDerivationPath({ account: accountIndex, change: changeIndex }))
  const xpub = derivedPath.publicExtendedKey().toString('hex')
  const wallet = derivedPath.deriveChild(addressIndex).getWallet()

  return {
    address: wallet.getAddressString().toLocaleLowerCase(),
    privateKey: wallet.getPrivateKeyString(),
    publicKey: wallet.getPublicKeyString(),
    xpub,
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
  return derivedPath.getWallet().getAddressString().toLowerCase()
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
  const accountIndex = account !== undefined ? account : 0
  const changeIndex = change !== undefined ? change : 0
  const addressIndex = address !== undefined ? address : 0
  const derivedPath = hdkey
    .fromMasterSeed(await mnemonicToSeed(mnemonic))
    .derivePath(getCeloDerivationPath({ account: accountIndex, change: changeIndex, address }))
  const xpub = derivedPath.publicExtendedKey().toString('hex')
  const wallet = derivedPath.deriveChild(addressIndex).getWallet()

  return {
    address: wallet.getAddressString().toLocaleLowerCase(),
    privateKey: wallet.getPrivateKeyString(),
    publicKey: wallet.getPublicKeyString(),
    xpub,
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
/**
 * Derive hathor address, private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @param {boolean} testnet true or false if testnet
 * @param {object} derivation derivation object
 */
module.exports.deriveHathorWalletFromDerivationPath = async (mnemonic, testnet, { account = 0, address } = {}) => {
  const accountIndex = account !== undefined ? account : 0
  const addressIndex = address !== undefined ? address : 0
  const networkName = testnet === true ? 'testnet' : 'mainnet'
  const partialDerivationPath = getHathorDerivationPath({ account: accountIndex }).substring(11)
  const xprivkey = hathorSdk.walletUtils.getXPrivKeyFromSeed(mnemonic, {
    networkName,
    accountDerivationIndex: partialDerivationPath,
  })
  const privkey = hathorSdk.walletUtils.deriveXpriv(xprivkey, partialDerivationPath)
  const xpub = hathorSdk.walletUtils.getXPubKeyFromXPrivKey(privkey)
  const privkeyDerived = privkey.deriveChild(addressIndex)

  return {
    address: this.deriveHathorAddressFromXpub(xpub, testnet, { address: addressIndex }),
    publicKey: privkeyDerived.publicKey.toString(),
    privateKey: privkeyDerived.privateKey.toString(),
    xpub,
  }
}

module.exports.getHathorAddressFromPrivateKey = (privateKey, testnet = true) => {
  const network = new hathorSdk.Network(testnet === true ? 'testnet' : 'mainnet')
  const privkey = new bitcore.PrivateKey(privateKey, network.bitcoreNetwork)
  return privkey.toAddress().toString()
}

module.exports.deriveHathorAddressFromXpub = (xpub, testnet, { address = 0 } = {}) => {
  const networkName = testnet === true ? 'testnet' : 'mainnet'
  const hdPublicKey = new bitcore.HDPublicKey(xpub)
  return new bitcore.Address(
    hdPublicKey.derive(address).publicKey,
    hathorSdk.network.getNetwork(networkName)
  ).toString()
}

/**
 * Derive cardano address, private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @param {boolean?} testnet
 * * @param {object} derivation derivation object
 * @returns
 */
module.exports.deriveCardanoWalletFromDerivationPath = async (mnemonic, testnet, { account = 0, address } = {}) => {
  const accountIndex = account !== undefined ? account : 0
  const addressIndex = address !== undefined ? address : 0
  const CARDANO_DERIVATION_MODE = 2
  const HARDENED_INDEX = 0x80000000
  const walletSecret = await mnemonicToRootKeypair(mnemonic, CARDANO_DERIVATION_MODE)
  const keyPair = getCardanoDerivationPath({ account: accountIndex })
    .split('/')
    .slice(1)
    .map(index => index.slice(-1) === '\'' ? HARDENED_INDEX + parseInt(index.slice(0, -1)) : parseInt(index))
    .reduce((secret, index) => derivePrivate(secret, index, CARDANO_DERIVATION_MODE), walletSecret)

  const privateKey = derivePrivate(derivePrivate(keyPair, 0, CARDANO_DERIVATION_MODE), addressIndex, CARDANO_DERIVATION_MODE).toString('hex')
  const spendXPubKey = derivePrivate(keyPair, addressIndex, CARDANO_DERIVATION_MODE).slice(64, 128).toString('hex')
  const stakeXPubKey = derivePrivate(
    derivePrivate(keyPair, 2, CARDANO_DERIVATION_MODE), 0, CARDANO_DERIVATION_MODE
  ).slice(64, 128).toString('hex')
  const xpub = spendXPubKey + stakeXPubKey
  const newAddress = bech32.encode(
    testnet ? 'addr_test' : 'addr',
    packBaseAddress(
      getPubKeyBlake2b224Hash(Buffer.from(
        derivePublic(Buffer.from(xpub.substr(0, 128),
          'hex'), addressIndex, CARDANO_DERIVATION_MODE), 'hex').slice(0, 32)),
      getPubKeyBlake2b224Hash(Buffer.from(
        stakeXPubKey,
        'hex').slice(0, 32)),
      testnet ? 0 : 1
    )
  )

  return { address: newAddress, publicKey: spendXPubKey, xpub, privateKey: privateKey }
}

/**
 * Derive cardano address, private key and public key
 *
 * @param {string} mnemonic mnemonic seed string
 * @param {boolean?} testnet
 * * @param {object} derivation derivation object
 * @returns
 */
module.exports.deriveCardanoAddressFromXpub = async (xpub, testnet, { account = 0, address } = {}) => {
  const addressIndex = address !== undefined ? address : 0
  const CARDANO_DERIVATION_MODE = 2

  const newAddress = bech32.encode(
    testnet ? 'addr_test' : 'addr',
    packBaseAddress(
      getPubKeyBlake2b224Hash(Buffer.from(
        derivePublic(Buffer.from(
          xpub.substr(0, 128),
          'hex'), addressIndex, CARDANO_DERIVATION_MODE), 'hex').slice(0, 32)),
      getPubKeyBlake2b224Hash(Buffer.from(
        xpub.substr(128, 128),
        'hex').slice(0, 32)),
      testnet ? 0 : 1
    )
  )

  return newAddress
}
