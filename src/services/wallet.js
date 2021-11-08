const { hdkey } = require('ethereumjs-wallet')
const Web3 = require('web3')
const bitcoin = require('bitcoinjs-lib')
const { mnemonicToSeed, mnemonicToEntropy } = require('bip39')
const stellarHdWallet = require('stellar-hd-wallet')
const rippleKeyPairs = require('ripple-keypairs')
const { Keypair } = require('stellar-sdk')
const hathorSdk = require('@hathor/wallet-lib')
const bitcore = require('bitcore-lib')
const CardanoWasm = require("@emurgo/cardano-serialization-lib-nodejs");
const Bip39 = require("bip39");

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
module.exports.deriveCardanoWalletFromDerivationPath = async (mnemonic, testnet, { account = 0, address = 0 } = {}) => {
  function harden(num) {
    return 0x80000000 + num;
  }

  const entropy = Bip39.mnemonicToEntropy(mnemonic);
  const accountKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, "hex"),
    Buffer.from("")
  )
    .derive(harden(1852))
    .derive(harden(1815))
    .derive(harden(account));

  const privateKey = accountKey
    .derive(0)
    .derive(address);

  const stakingKey = accountKey
    .derive(2)
    .derive(address)

  const utxoPubKey = privateKey
    .to_public();

  const stakingPubKey = stakingKey
    .to_public();

  const pubKeyAsHex = Buffer.from(utxoPubKey.to_raw_key().as_bytes()).toString("hex");
  const stakePubKeyAsHex = Buffer.from(stakingPubKey.to_raw_key().as_bytes()).toString("hex");

  const baseAddr = CardanoWasm.BaseAddress.new(
    testnet ? 0 : 1,
    CardanoWasm.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash()),
    CardanoWasm.StakeCredential.from_keyhash(stakingPubKey.to_raw_key().hash()),
  ).to_address().to_bech32()

  return {
    address: baseAddr, xpub: pubKeyAsHex + stakePubKeyAsHex,
    publicKey: {
      spendingPublicKey: pubKeyAsHex,
      stakingPublicKey: stakePubKeyAsHex,
    },
    privateKey: {
      spendingPrivateKey: Buffer.from(privateKey.to_128_xprv()).toString('hex'),
      stakingPrivateKey: Buffer.from(stakingKey.to_128_xprv()).toString('hex')
    }
  }
}

/**
 * Derive cardano addresses from extended public key (xpub)
 *
 * @param {string} xpub extended public key string
 * @param {boolean} testnet true or false for testnet
 * * @param {object} derivation derivation object
 * @returns
 */
module.exports.deriveCardanoAddressFromXpub = async (xpub, testnet) => {
  let utxo = new Uint8Array(xpub.substr(0, 64).match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
  let stake = new Uint8Array(xpub.substr(64, 64).match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
  utxo = CardanoWasm.PublicKey.from_bytes(utxo)
  stake = CardanoWasm.PublicKey.from_bytes(stake)

  const baseAddr = CardanoWasm.BaseAddress.new(
    testnet ? 0 : 1,
    CardanoWasm.StakeCredential.from_keyhash(utxo.hash()),
    CardanoWasm.StakeCredential.from_keyhash(stake.hash()),
  ).to_address().to_bech32()

  return baseAddr
}

module.exports.getCardanoAddressFromPrivateKey = (privateKey, testnet = true) => {

  let spendingPrivateKey = new Uint8Array(privateKey.spendingPrivateKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
  let stakingPrivateKey = new Uint8Array(privateKey.stakingPrivateKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

  const spendingPublicKey = CardanoWasm.Bip32PrivateKey.from_128_xprv(spendingPrivateKey)
    .to_public();

  const stakingPubKey = CardanoWasm.Bip32PrivateKey.from_128_xprv(stakingPrivateKey)
    .to_public();

  const baseAddr = CardanoWasm.BaseAddress.new(
    testnet ? 0 : 1,
    CardanoWasm.StakeCredential.from_keyhash(spendingPublicKey.to_raw_key().hash()),
    CardanoWasm.StakeCredential.from_keyhash(stakingPubKey.to_raw_key().hash()),
  ).to_address().to_bech32()

  return baseAddr
}