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
 * @typedef {Object} Transaction
 * @property {string} id Wallet transaction id
 * @property {string=} walletId Wallet id
 * @property {string=} destination
 * @property {string} amount
 * @property {Array<WalletInput> =} inputs Inputs for transactions
 * @property {Array<WalletOutput> =} destinations
 * @property {import('../../transaction/entity').TransactionType} transactionType
 * @property {string} status
 * @property {string} protocol
 * @property {string} createdAt
 * @property {string=} token
 * @property {string=} contractAddress
 * @property {string=} issuer
 * @property {string=} transactionHash
 * @property {any=} data
 */
/**
 * @typedef {Object} SetTrustline
 * @property {string} walletId
 * @property {string} token
 * @property {string} issuer
 * @property {string} limit
 * @property {string=} memo
 */
/**
 * @typedef {Object} StellarTransfer
 * @property {string} walletId
 * @property {string} token
 * @property {string=} issuer
 * @property {boolean=} createAccount
 * @property {string} amount
 * @property {string} destination
 * @property {string=} memo
 */
/** @typedef {StellarTransfer} RippleTransfer */
/**
 * @typedef {Object} BitcoinTransfer
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {any[]} destinations
 */
/**
 * @typedef {Object} CardanoTransfer
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {any[]} destinations
 */
/**
 * @typedef {Object} HathorTransfer
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {any[]} destinations
 */
/**
 * @typedef {Object} EthereumTransfer
 * @property {string} walletId
 * @property {string=} token
 * @property {string} amount
 * @property {string} destination
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} CeloTransfer
 * @property {string} walletId
 * @property {string=} token
 * @property {string} amount
 * @property {string} destination
 * @property {string=} feeCurrency
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} EthereumTokenDeploy
 * @property {string} walletId
 * @property {"ERC20"|"ERC721"|"ERC1155"} tokenType
 * @property {string[]} params
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} CeloTokenDeploy
 * @property {string} walletId
 * @property {"ERC20"|"ERC721"|"ERC1155"} tokenType
 * @property {string[]} params
 * @property {{ gas: number, gasPrice: string }=} fee
 * @property {string=} feeCurrency
 */
/**
 * @typedef {Object} HathorTokenDeploy
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {string} tokenName
 * @property {string} tokenSymbol
 * @property {string} amount
 * @property {string=} mintAuthorityAddress
 * @property {string=} meltAuthorityAddress
 */
/**
 * @typedef {Object} HathorTokenMint
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {string} tokenUid
 * @property {string} amount
 * @property {string} address
 * @property {string} changeAddress
 * @property {string=} mintAuthorityAddress
 */
/**
 * @typedef {Object} HathorTokenMelt
 * @property {string=} walletId
 * @property {any[]=} inputs
 * @property {string} tokenUid
 * @property {string} amount
 * @property {string} address
 * @property {string} changeAddress
 * @property {string=} meltAuthorityAddress
 */
/**
 * @typedef {Object} EthereumSmartContractDeploy
 * @property {string} walletId
 * @property {string} contractName
 * @property {string} source
 * @property {any[]} params
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} CeloSmartContractDeploy
 * @property {string} walletId
 * @property {string} contractName
 * @property {string} source
 * @property {any[]} params
 * @property {string=} feeCurrency
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} EthereumSmartContractSend
 * @property {string} walletId
 * @property {string} contractAddress
 * @property {any[]} contractAbi
 * @property {string} method
 * @property {any[]} params
 * @property {{ gas: number, gasPrice: string }=} fee
 */
/**
 * @typedef {Object} CeloSmartContractSend
 * @property {string} walletId
 * @property {string} contractAddress
 * @property {any[]} contractAbi
 * @property {string} method
 * @property {any[]} params
 * @property {string=} feeCurrency
 * @property {{ gas: number, gasPrice: string }=} fee
 */

module.exports = {}
