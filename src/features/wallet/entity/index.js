
class Wallet {
  /**
   * Constructor
   *
   * @param {object} args
   * @param {string} args.privateKey Wallet private key
   * @param {string} args.publicKey Wallet public key
   * @param {string} args.address Wallet address
   * @param {string=} args.xpub Wallet xpub address
   * @param {import('../../../services/blockchain/constants').Protocol} args.protocol blockchain protocol
   * @param {boolean} args.testnet blockchain testnet or mainnet
   */
  constructor({ privateKey, publicKey, address, xpub, protocol, testnet }) {
    this.protocol = protocol
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.address = address
    this.xpub = xpub
    this.testnet = testnet
  }
}

class WalletInfoResponse {
  constructor(info) {
    Object.assign(this, info)
  }
}

/**
 * @typedef {object} WalletInput
 * @property {string} txHash
 * @property {number} index
 * @property {string} walletId
 */
/**
 * @typedef {object} CardanoWalletOutputToken
 * @property {string} policy
 * @property {string} amount
 * @property {string} asset
 */
/**
 * @typedef {object} WalletOutput
 * @property {string} address
 * @property {string} amount
 * @property {string | CardanoWalletOutputToken =} token
 */

/**
 * @typedef {object} WalletTransaction
 * @property {string} id Wallet transaction id
 * @property {string=} walletId Wallet id
 * @property {Array<WalletInput> =} inputs Inputs for transactions
 * @property {string=} addressTo
 * @property {Array<WalletOutput> =} outputs
 * @property {string} amount
 * @property {import('../../transaction/entity').TransactionType} transactionType
 * @property {string} status
 * @property {string} protocol
 * @property {string} createdAt
 * @property {string=} assetSymbol
 * @property {string=} contractAddress
 * @property {string=} issuer
 * @property {string=} transactionHash
 * @property {string=} limit
  */

module.exports = {
  Wallet,
  WalletInfoResponse,
}
