class Wallet {
  /**
   * Constructor
   *
   * @param {Object} args
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
 * @typedef {Object} WalletInput
 * @property {string} txHash
 * @property {number} index
 * @property {string} walletId
 */
/**
 * @typedef {Object} CardanoWalletOutputToken
 * @property {string} policy
 * @property {string} amount
 * @property {string} asset
 */
/**
 * @typedef {Object} WalletOutput
 * @property {string} address
 * @property {string} amount
 * @property {string | CardanoWalletOutputToken =} token
 */

/**
 * @typedef {Object} WalletTransaction
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
/**
 * @typedef {Object} WalletTransactionStellarTrustline
 * @property {string} walletId Wallet id
 * @property {string} assetSymbol
 * @property {string} issuer
 * @property {string} limit
 * @property {string=} memo
 * @property {string=} fee
 */
/** @typedef {WalletTransactionStellarTrustline} WalletTransactionRippleTrustline */
/**
 * @typedef {Object} WalletTransactionStellarTransfer
 * @property {string} walletId
 * @property {string} assetSymbol
 * @property {string=} issuer
 * @property {boolean=} createAccount
 * @property {string} amount
 * @property {string} destination
 * @property {string=} memo
 * @property {string=} fee
 */
/** @typedef {WalletTransactionStellarTransfer} WalletTransactionRippleTransfer */
/**
 * @typedef {Object} WalletTransactionBitcoinTransfer
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {any[]} outputs
 */
/**
 * @typedef {Object} WalletTransactionCardanoTransfer
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {any[]} outputs
 */
/**
 * @typedef {Object} WalletTransactionHathorTransfer
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {any[]} outputs
 */
/**
 * @typedef {Object} WalletTransactionEthereumTransfer
 * @property {string} walletId
 * @property {string=} tokenSymbol
 * @property {string=} contractAddress
 * @property {string} amount
 * @property {string} destination
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} WalletTransactionCeloTransfer
 * @property {string} walletId
 * @property {string=} tokenSymbol
 * @property {string=} contractAddress
 * @property {string} amount
 * @property {string} destination
 * @property {string=} feeCurrency
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} WalletTransactionEthereumTokenDeploy
 * @property {string} walletId
 * @property {"ERC20"|"ERC721"|"ERC1155"} tokenType
 * @property {string[]} params
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} WalletTransactionCeloTokenDeploy
 * @property {string} walletId
 * @property {"ERC20"|"ERC721"|"ERC1155"} tokenType
 * @property {string[]} params
 * @property {{ gas: number, gasPrice: string }=} fee
 * @property {string=} feeCurrency
 */
/**
 * @typedef {Object} WalletTransactionHathorTokenDeploy
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {string} tokenName
 * @property {string} tokenSymbol
 * @property {string} amount
 * @property {string=} mintAuthorityAddress
 * @property {string=} meltAuthorityAddress
 */
/**
 * @typedef {Object} WalletTransactionHathorTokenMint
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {string} tokenUid
 * @property {string} amount
 * @property {string} address
 * @property {string} changeAddress
 * @property {string=} mintAuthorityAddress
 */
/**
 * @typedef {Object} WalletTransactionHathorTokenMelt
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {string} tokenUid
 * @property {string} amount
 * @property {string} address
 * @property {string} changeAddress
 * @property {string=} meltAuthorityAddress
 */
/**
 * @typedef {Object} WalletTransactionEthereumSmartContractDeploy
 * @property {string} walletId
 * @property {string} contractName
 * @property {string} source
 * @property {any[]} params
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} WalletTransactionCeloSmartContractDeploy
 * @property {string} walletId
 * @property {string} contractName
 * @property {string} source
 * @property {any[]} params
 * @property {string=} feeCurrency
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} WalletTransactionEthereumSmartContractSend
 * @property {string} walletId
 * @property {string} contractAddress
 * @property {any[]} contractAbi
 * @property {string} method
 * @property {any[]} params
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} WalletTransactionCeloSmartContractSend
 * @property {string} walletId
 * @property {string} contractAddress
 * @property {any[]} contractAbi
 * @property {string} method
 * @property {any[]} params
 * @property {string=} feeCurrency
 * @property {{ gas: number, gasPrice: string }=} fee
 */

module.exports = {
  Wallet,
  WalletInfoResponse,
}
