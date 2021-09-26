class Wallet {
  /**
   * Constructor
   *
   * @param {object} args
   * @param {string} args.privateKey Wallet private key
   * @param {string} args.publicKey Wallet public key
   * @param {string} args.address Wallet address
   * @param {Protocol} args.protocol blockchain protocol
   * @param {boolean} args.testnet blockchain testnet or mainnet
   */
  constructor({ privateKey, publicKey, address, protocol, testnet }) {
    this.protocol = protocol
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.address = address
    this.testnet = testnet
  }
}

class WalletInfoResponse {
  constructor(info) {
    Object.assign(this, info)
  }
}

module.exports = {
  Wallet,
  WalletInfoResponse,
}
