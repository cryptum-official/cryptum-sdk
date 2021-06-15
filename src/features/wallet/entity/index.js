const { Protocol } = require('../../../services/blockchain')

class Wallet {
  /**
   * Constructor
   * @param {object} args
   * @param {string} args.mnemonic Wallet mnemonic seed
   * @param {string} args.privateKey Wallet private key
   * @param {string} args.publicKey Wallet public key
   * @param {string} args.address Wallet address
   * @param {Protocol} args.protocol blockchain protocol
   * @param {Protocol} args.testnet blockchain testnet or mainnet
   */
  constructor({ mnemonic, privateKey, publicKey, address, protocol, testnet }) {
    this.mnemonic = mnemonic
    this.protocol = protocol
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.address = address
    this.testnet = testnet
  }
}

module.exports = Wallet
