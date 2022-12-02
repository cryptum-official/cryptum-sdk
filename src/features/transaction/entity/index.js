/**
 * Transaction type
 * @enum {string}
 */
 const TransactionType = {
  TRANSFER: 'TRANSFER',
  CALL_CONTRACT_METHOD: 'CALL_CONTRACT_METHOD',
  DEPLOY_CONTRACT: 'DEPLOY_CONTRACT',
  DEPLOY_ERC20: 'DEPLOY_ERC20',
  DEPLOY_ERC721: 'DEPLOY_ERC721',
  DEPLOY_ERC1155: 'DEPLOY_ERC1155',
  CHANGE_TRUST: 'CHANGE_TRUST',
  HATHOR_TOKEN_CREATION: 'HATHOR_TOKEN_CREATION',
  HATHOR_TOKEN_MINT: 'HATHOR_TOKEN_MINT',
  HATHOR_TOKEN_MELT: 'HATHOR_TOKEN_MELT',
  HATHOR_NFT_MINT: 'HATHOR_NFT_MINT',
  HATHOR_NFT_MELT: 'HATHOR_NFT_MELT',
  SOLANA_TOKEN_CREATION: 'SOLANA_TOKEN_CREATION',
  SOLANA_TOKEN_MINT: 'SOLANA_TOKEN_MINT',
  SOLANA_TOKEN_BURN: 'SOLANA_TOKEN_BURN',
  SOLANA_COLLECTION_MINT: 'SOLANA_COLLECTION_MINT',
  SOLANA_NFT_MINT: 'SOLANA_NFT_MINT',
  LOOTBOX_DEPLOY: 'LOOTBOX_DEPLOY',
  LOOTBOX_CREATE: 'LOOTBOX_CREATE',
  LOOTBOX_APPROVE: 'LOOTBOX_APPROVE'
}
/**
 * @typedef {object | string} Fee
 * @property {number} gas
 * @property {string} gasPrice
 */

class SignedTransaction {
  /**
   * Creates an instance of SignedTransaction
   *
   * @param {object} signedTxArgs
   * @param {string} signedTxArgs.signedTx signed transaction data
   * @param {Protocol} signedTxArgs.protocol blockchain protocol
   * @param {TransactionType} signedTxArgs.type transaction type
   */
  constructor({ signedTx, protocol, type }) {
    this.signedTx = signedTx
    this.protocol = protocol
    this.type = type
  }
}
class TransactionResponse {
  /**
   * Creates an instance of TransactionResponse
   *
   * @param {object} response
   * @param {string} response.hash transaction hash
   */
  constructor({ hash }) {
    this.hash = hash
  }
}
class FeeResponse {
  constructor({ estimateValue, currency, gas, gasPrice, chainId, ...rest }) {
    this.estimateValue = estimateValue
    this.currency = currency
    this.gas = gas
    this.gasPrice = gasPrice
    this.chainId = chainId
    Object.assign(this, rest)
  }
}
class SmartContractCallResponse {
  constructor({ result }) {
    this.result = result
  }
}
class UTXO {
  constructor({ value, txHash, index, height, token }) {
    this.value = value
    this.txHash = txHash
    this.index = index
    this.height = height
    this.token = token
  }
}
class Input {
  constructor({ txHash, index, privateKey, value, blockhash, hex }) {
    this.txHash = txHash
    this.index = index
    this.privateKey = privateKey
    this.hex = hex
    this.value = value
    this.blockhash = blockhash
  }
}
class Output {
  /**
   *
   * @param {object} output
   * @param {string} output.address
   * @param {string} output.amount
   * @param {string=} output.token
   */
  constructor(output) {
    this.address = output.address
    this.amount = output.amount
    this.token = output.token
  }
}
class CardanoOutput extends Output {
  /**
   *
   * @param {object} output
   * @param {string} output.address
   * @param {string} output.amount
   * @param {{ policy:string; asset:string; amount:string }=} output.token
   */
  constructor(output) {
    super(output)
  }
}
class TrustlineTransactionInput {
  /**
   * Creates an instance of TrustlineTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.assetSymbol
   * @param {string} args.issuer issuer account for the trustline
   * @param {string=} args.limit max number that the trustline can allow
   * @param {string=} args.memo
   * @param {Fee=} args.fee fee in stroops (stellar) or drops (xrp)
   * @param {boolean} args.testnet
   */
  constructor({ wallet, assetSymbol, issuer, limit, memo, fee, testnet }) {
    this.wallet = wallet
    this.limit = limit
    this.issuer = issuer
    this.assetSymbol = assetSymbol
    this.memo = memo
    this.fee = fee
    this.testnet = testnet
  }
}
class StellarTrustlineTransactionInput extends TrustlineTransactionInput {
  constructor(args) {
    super(args)
  }
}
class RippleTrustlineTransactionInput extends TrustlineTransactionInput {
  constructor(args) {
    super(args)
  }
}

class TransferTransactionInput {
  /**
   * Creates an instance of TransferTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string=} args.memo
   * @param {Fee=} args.fee
   * @param {boolean} args.testnet
   */
  constructor({ wallet, amount, destination, memo, fee, testnet }) {
    this.wallet = wallet
    this.amount = amount
    this.destination = destination
    this.memo = memo
    this.fee = fee
    this.testnet = testnet
  }
}
class StellarTransferTransactionInput extends TransferTransactionInput {
  /**
   * Creates an instance of StellarTransferTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.assetSymbol asset symbol to be transferred
   * @param {string=} args.issuer issuer account to identify the asset to be transferred
   * @param {string} args.amount amount to be transferred
   * @param {string} args.destination account to be transferred to
   * @param {string=} args.memo
   * @param {Fee=} args.fee fee in stroops
   * @param {boolean=} args.createAccount true if the destination account does not exist yet
   * @param {boolean=} args.testnet
   */
  constructor({ assetSymbol, createAccount, issuer, ...args }) {
    super(args)
    this.assetSymbol = assetSymbol
    this.createAccount = createAccount
    this.issuer = issuer
  }
}
class RippleTransferTransactionInput extends TransferTransactionInput {
  /**
   * Creates an instance of CeloTransferTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.assetSymbol asset symbol to be transferred
   * @param {string=} args.issuer issuer account to identify the asset to be transferred
   * @param {string} args.amount amount to be transferred
   * @param {string} args.destination account to be transferred to
   * @param {Fee=} args.fee fee in drops
   * @param {string=} args.memo
   * @param {boolean=} args.testnet
   */
  constructor({ assetSymbol, issuer, ...args }) {
    super(args)
    this.assetSymbol = assetSymbol
    this.issuer = issuer
  }
}
class EthereumTransferTransactionInput extends TransferTransactionInput {
  /**
   * Creates an instance of EthereumTransferTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string=} args.tokenSymbol
   * @param {string=} args.contractAddress
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string=} args.memo
   * @param {Fee=} args.fee
   * @param {boolean=} args.testnet
   */
  constructor({ tokenSymbol, contractAddress, ...args }) {
    super(args)
    this.tokenSymbol = tokenSymbol
    this.contractAddress = contractAddress
  }
}
class SmartContractCallTransactionInput {
  /**
   * Creates an instance of SmartContractCallTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.contractAddress
   * @param {Array<any>} args.contractAbi
   * @param {string} args.method
   * @param {any[]} args.params
   * @param {string} args.protocol
   * @param {Fee=} args.fee
   * @param {string=} args.feeCurrency
   * @param {boolean=} args.testnet
   */
  constructor({ wallet, contractAddress, contractAbi, method, params, protocol, fee, feeCurrency }) {
    this.wallet = wallet
    this.contractAddress = contractAddress
    this.contractAbi = contractAbi
    this.method = method
    this.params = params
    this.protocol = protocol
    this.fee = fee
    this.feeCurrency = feeCurrency
  }
}
class SmartContractCallMethodInput {
  /**
   * Creates an instance of SmartContractCallMethodInput.
   *
   * @param {object} args
   * @param {string} args.from
   * @param {string} args.contractAddress
   * @param {Array<any>} args.contractAbi
   * @param {string} args.method
   * @param {any[]} args.params
   * @param {string} args.protocol
   * @param {boolean=} args.testnet
   */
  constructor({ from, contractAddress, contractAbi, method, params, protocol }) {
    this.from = from
    this.contractAddress = contractAddress
    this.contractAbi = contractAbi
    this.method = method
    this.params = params
    this.protocol = protocol
  }
}

class SmartContractDeployTransactionInput {
  /**
   * Creates an instance of SmartContractDeployTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.contractName
   * @param {any[]} args.params
   * @param {string} args.source
   * @param {string} args.protocol
   * @param {Fee=} args.fee
   * @param {string=} args.feeCurrency
   * @param {boolean=} args.testnet
   */
  constructor({ wallet, contractName, params, source, fee, feeCurrency, protocol, testnet }) {
    this.wallet = wallet
    this.contractName = contractName
    this.params = params
    this.source = source
    this.protocol = protocol
    this.fee = fee
    this.feeCurrency = feeCurrency
    this.testnet = testnet
  }
}

class SolanaTokenDeployInput {
  /**
   * Creates an instance of SolanaTokenDeployInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {boolean} args.fixedSupply
   * @param {string} args.name
   * @param {string} args.symbol
   * @param {number} args.decimals
   * @param {string} args.amount
   */
  constructor({ wallet, fixedSupply, decimals, amount, name, symbol }) {
    this.wallet = wallet
    this.fixedSupply = fixedSupply
    this.symbol = symbol
    this.name = name
    this.decimals = decimals
    this.amount = amount
  }
}

class SolanaNFTInput {
  /**
   * Creates an instance of SolanaNFTInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.from
   * @param {string} args.uri
   * @param {string} args.maxSupply
   * @param {string} args.network
   */
  constructor({ from, maxSupply, uri, network }) {
    this.from = from
    this.uri = uri
    this.maxSupply = maxSupply
    this.network = network
  }
}

class SolanaNFTEditionInput {
  /**
   * Creates an instance of SolanaNFTEdition.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.masterEdition
   */
  constructor({ wallet, masterEdition }) {
    this.wallet = wallet
    this.masterEdition = masterEdition
  }
}

class SolanaUpdateMetadataInput {
  /**
   * Creates an instance of SolanaNFTEdition.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.from
   * @param {string} args.token
   * @param {string} args.uri
   * @param {string} args.network
   */
  constructor({ from, token, uri, network }) {
    this.from = from
    this.token = token
    this.uri = uri
    this.network = network
  }
}

class SolanaCustomProgramInput {
  /**
   * Creates an instance of SolanaNFTEdition.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.from
   * @param {Array} args.keys
   * @param {string} args.programId
   * @param {Buffer} args.data
   */
  constructor({ from, keys, programId, data }) {
    this.from = from
    this.keys = keys
    this.programId = programId
    this.data = data
  }
}

class TokenDeployTransactionInput {
  /**
   * Creates an instance of TokenDeployTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {any[]} args.params
   * @param {string} args.tokenType
   * @param {Fee=} args.fee
   * @param {Protocol} args.protocol
   * @param {string=} args.feeCurrency
   * @param {boolean=} args.testnet
   */
  constructor({ wallet, tokenType, params, fee, protocol, feeCurrency, testnet }) {
    this.wallet = wallet
    this.tokenType = tokenType
    this.params = params
    this.protocol = protocol
    this.fee = fee
    this.feeCurrency = feeCurrency
    this.testnet = testnet
  }
}
class CeloTransferTransactionInput extends EthereumTransferTransactionInput {
  /**
   * Creates an instance of CeloTransferTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string=} args.tokenSymbol
   * @param {string=} args.contractAddress
   * @param {string} args.amount
   * @param {string} args.destination
   * @param {string=} args.memo
   * @param {Fee=} args.fee
   * @param {string=} args.feeCurrency
   * @param {boolean=} args.testnet
   */
  constructor({ feeCurrency, ...args }) {
    super(args)
    this.feeCurrency = feeCurrency
  }
}
class BitcoinTransferTransactionInput extends TransferTransactionInput {
  /**
   * Creates an instance of BitcoinTransferTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet=} args.wallet wallet to transfer from
   * @param {Array<Input>=} args.inputs inputs to transfer from
   * @param {Array<Output>} args.outputs outputs to transfer to
   */
  constructor({ outputs, inputs, ...args }) {
    super(args)
    this.outputs = outputs
    this.inputs = inputs
  }
}
class HathorTransferTransactionInput extends TransferTransactionInput {
  /**
   * Creates an instance of HathorTransferTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet=} args.wallet wallet to transfer from
   * @param {Array<Input>=} args.inputs inputs to transfer from
   * @param {Array<Output>} args.outputs outputs to transfer to
   * @param {boolean=} args.testnet
   */
  constructor({ outputs, inputs, ...args }) {
    super(args)
    this.outputs = outputs
    this.inputs = inputs
  }
}
class CardanoTransferTransactionInput extends TransferTransactionInput {
  /**
   * Creates an instance of CardanoTransferTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet=} args.wallet wallet to transfer from
   * @param {Array<Input>=} args.inputs inputs to transfer from
   * @param {Array<CardanoOutput>} args.outputs outputs to transfer to
   */
  constructor({ outputs, inputs, ...args }) {
    super(args)
    this.outputs = outputs
    this.inputs = inputs
  }
}
/**
 * @typedef {Object} HathorTokenTransactionFromWalletInput
 * @property {TransactionType} type token transaction type
 * @property {import('../../wallet/entity').Wallet} wallet wallet to create the token with
 * @property {string=} tokenName token name
 * @property {string=} tokenSymbol token symbol
 * @property {string=} tokenUid token uid
 * @property {string} amount token amount to mint
 * @property {string} address destination address to receive the tokens
 * @property {string=} changeAddress change address
 * @property {string=} mintAuthorityAddress mint authority address
 * @property {string=} meltAuthorityAddress melt authority address
 * @property {string=} nftData NFT data (URI, serial number, etc) if creating a NFT
 * @property {boolean=} testnet

 * @typedef {Object} HathorTokenTransactionFromUTXOInput
 * @property {TransactionType} type token transaction type
 * @property {Input[]} inputs UTXOs to create the token with
 * @property {string} tokenName token name
 * @property {string} tokenSymbol token symbol
 * @property {string} amount token amount to mint
 * @property {string} address destination address to receive the tokens
 * @property {string=} changeAddress change address
 * @property {string=} mintAuthorityAddress mint authority address
 * @property {string=} meltAuthorityAddress melt authority address
 * @property {boolean=} testnet

 * @typedef {Object} SolanaTransferTransactionInput
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} destination
 * @property {string} token
 * @property {string|number} amount
 * @property {boolean=} isNFT
 * 
 * @typedef {Object} SolanaTokenBurnTransactionInput
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} token
 * @property {string|number} amount
 * 
 * @typedef {Object} SolanaTokenMintTransactionInput
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} destination
 * @property {string} token
 * @property {string|number} amount
 * 
 * @typedef {Object} SolanaNFTCollectionTransactionInput
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} name
 * @property {string} symbol
 * @property {string} uri
 * 
 * @typedef {Object} SolanaCreator
 * @property {string} address
 * @property {number} share
 * @property {boolean} verified
 * 
 * @typedef {Object} SolanaNFTTransactionInput
 * @property {import('../../wallet/entity').Wallet} wallet
 * @property {string} name
 * @property {string} symbol
 * @property {string} uri
 * @property {string} amount
 * @property {string} maxSupply
 * @property {SolanaCreator[]=} creators
 * @property {number=} royaltiesFee
 * @property {string=} collection
 */

module.exports = {
  TransactionType,
  SignedTransaction,
  TransactionResponse,
  FeeResponse,
  UTXO,
  Input,
  Output,
  CardanoOutput,
  StellarTrustlineTransactionInput,
  RippleTrustlineTransactionInput,
  EthereumTransferTransactionInput,
  CeloTransferTransactionInput,
  StellarTransferTransactionInput,
  RippleTransferTransactionInput,
  BitcoinTransferTransactionInput,
  SmartContractCallTransactionInput,
  SolanaTokenDeployInput,
  SolanaNFTInput,
  SolanaNFTEditionInput,
  SolanaUpdateMetadataInput,
  SolanaCustomProgramInput,
  SmartContractCallResponse,
  SmartContractDeployTransactionInput,
  TokenDeployTransactionInput,
  HathorTransferTransactionInput,
  CardanoTransferTransactionInput,
  SmartContractCallMethodInput,
}