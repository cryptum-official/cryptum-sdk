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
 * 
 * @typedef {(EthereumTokenDeploy | CeloTokenDeploy | HathorTokenDeploy) & ProtocolType} TokenDeploy
 */
/**
 * @typedef {Object} NftTransferInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} walletId
* @property {string} token token name or address to transfer
* @property {string} destination destination address
* @property {string | number} amount amount to be transferred
* @property {string=} tokenId token id to be transferred only for EVMs (ethereum, bsc, celo, polygon, avax, chiliz)
* @property {string=} feeCurrency fee currency (for celo only)
* 
* @typedef {Object} NftMintInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} walletId
* @property {string} token token address to mint
* @property {string} destination destination address
* @property {string} amount amount to be minted
* @property {string=} tokenId token id to be minted only for EVMs (ethereum, bsc, celo, polygon, avax, chiliz)
* @property {string=} uri metadata URI string for EVMs this will be the base URI
* @property {string=} mintAuthorityAddress mint authority address for hathor only
* @property {string=} feeCurrency fee currency (for celo only)
* 
* @typedef {Object} NftBurnInput
* @property {import('../../../services/blockchain/constants').Protocol} protocol
* @property {string} walletId
* @property {string} token token address to burn
* @property {string} amount amount to be burnt
* @property {string=} tokenId token id to be burnt only for EVMs (ethereum, bsc, celo, polygon, avax, chiliz)
* @property {string=} meltAuthorityAddress melt authority address for hathor only
* @property {string=} feeCurrency fee currency (for celo only)

/* @typedef {Object} TokenTransferInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} walletId
 * @property {string} token token name or address to transfer
 * @property {string=} destination destination address
 * @property {string} amount amount to be transferred
 * @property {Array<import('../../transaction/entity').Output|import('../../transaction/entity').CardanoOutput>=} destinations destinations (for bitcoin, hathor and cardano transactions only)
 * @property {string=} issuer issuer account of the token to transfer (only for stellar and ripple transactions)
 * @property {boolean=} createAccount true if this is a transfer to create an account in the blockchain (only for stellar transactions)
 * @property {string=} memo text to be attached to transaction (for stellar and ripple only)
 * @property {string=} feeCurrency fee currency (for celo only)
 * @property {string=} fee fee 

 * @typedef {Object} TokenCreationInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} walletId
 * @property {string} name token name
 * @property {string} symbol token symbol
 * @property {string} amount amount to be created
 * @property {string=} mintAuthorityAddress address responsible to mint more tokens (for hathor only)
 * @property {string=} meltAuthorityAddress address responsible to burn more tokens (for hathor only)
 * @property {string=} feeCurrency fee currency (for celo only)
 * @property {boolean=} fixedSupply true if this token has fixed supply (for solana only)
 * @property {number=} decimals (for solana only)
 * 
 * @typedef {Object} NftCreationInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} walletId
 * @property {string} name token name
 * @property {string} symbol token symbol
 * @property {string} amount amount to be created
 * @property {string=} uri metadata URI string for hathor and solana only, for EVMs this will be the base URI
 * @property {'ERC721'|'ERC1155'=} type token type for EVMs only
 * @property {string=} mintAuthorityAddress address responsible to mint more tokens (for hathor only)
 * @property {string=} meltAuthorityAddress address responsible to burn more tokens (for hathor only)
 * @property {string=} feeCurrency fee currency (for celo only)
 * @property {import('../../transaction/entity').SolanaCreator[]=} creators true if this token has fixed supply (for solana only)
 * @property {number=} royaltiesFee (for solana only)
 * @property {string=} collection (for solana only)
 */
/**
 * @typedef {Object} TokenMintInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} walletId
 * @property {string} token token name or address to transfer
 * @property {string=} destination destination address
 * @property {string} amount amount to be transferred
 * @property {string=} mintAuthorityAddress address responsible to mint more tokens (for hathor only)
 * @property {string=} feeCurrency fee currency (for celo only)
 */
/**
 * @typedef {Object} SetTrustlineInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} walletId
 * @property {string} symbol token symbol
 * @property {string} issuer issuer account
 * @property {string} limit limit amount
 */
/**
 * @typedef {Object} TokenBurnInput
 * @property {import('../../../services/blockchain/constants').Protocol} protocol
 * @property {string} walletId
 * @property {string} token token name or address to transfer
 * @property {string} amount amount to be transferred
 * @property {string=} meltAuthorityAddress address responsible to burn more tokens (for hathor only)
 * @property {string=} feeCurrency fee currency (for celo only)
*/
/**
 * @typedef {Object} SmartContractTransactionInput
 * @property {string} walletId
 * @property {string} contractAddress
 * @property {Array<any>} contractAbi
 * @property {string} method
 * @property {any[]} params
 * @property {string} protocol
 * @property {Fee=} fee
 * @property {string=} feeCurrency
 * 
 */
/**
 * @typedef {Object} SmartContractDeployInput
 * @property {string} walletId
 * @property {string} contractName
 * @property {any[]} params
 * @property {string} source
 * @property {string} protocol
 * @property {Fee=} fee
 * @property {string=} feeCurrency
 */

module.exports = {}
