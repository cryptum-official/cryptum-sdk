const { Protocol } = require('../constants')

class Wallet {
  /**
   * Constructor
   * @param {object} args
   * @param {string} args.mnemonic Wallet mnemonic seed
   * @param {string} args.privateKey Wallet private key
   * @param {string} args.publicKey Wallet public key
   * @param {string} args.address Wallet address
   * @param {Protocol} args.protocol blockchain protocol
   */
  constructor({ mnemonic, privateKey, publicKey, address, protocol }) {
    this.mnemonic = mnemonic
    this.protocol = protocol
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.address = address
  }
}

module.exports = Wallet
