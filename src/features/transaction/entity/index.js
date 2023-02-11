const { boolean } = require('fp-ts')

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
  SOLANA_TOKEN_CREATION: 'SOLANA_TOKEN_CREATION',
  SOLANA_TOKEN_MINT: 'SOLANA_TOKEN_MINT',
  SOLANA_TOKEN_BURN: 'SOLANA_TOKEN_BURN',
  SOLANA_COLLECTION_MINT: 'SOLANA_COLLECTION_MINT',
  SOLANA_NFT_MINT: 'SOLANA_NFT_MINT',
  LOOTBOX_DEPLOY: 'LOOTBOX_DEPLOY',
  LOOTBOX_CREATE: 'LOOTBOX_CREATE',
  LOOTBOX_APPROVE: 'LOOTBOX_APPROVE',
  CREATE_POOL: 'CREATE_POOL',
  MINT_POSITION: 'MINT_POSITION',
  REMOVE_POSITION: 'REMOVE_POSITION',
  GET_POOL: 'GET_POOL',
  INCREASE_CARDINALITY: 'INCREASE_CARDINALITY',
  INCREASE_LIQUIDITY: 'INCREASE_LIQUIDITY',
  DECREASE_LIQUIDITY: 'INCREASE_LIQUIDITY',
  COLLECT_FEES: 'COLLECT_FEES',
  SWAP: 'SWAP',
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
class CreatePoolResponse {
  /**
   * Creates an instance of TransactionResponse
   *
   * @param {object} response
   * @param {TransactionResponse | null} response.transaction transaction response object (if there is one) or null (if no transaction was made)
   * @param {string} response.pool pool address
   */
  constructor({ transaction, pool }) {
    this.transaction = transaction
    this.pool = pool
  }
}
class GetIncreaseLiquidityQuotationResponse {
  /**
   * Creates an instance of GetIncreaseLiquidityQuotation
   *
   * @param {object} response
   * @param {object} response.increaseLiquidityQuotation Quotation amounts for tokenA and tokenB
   * @param {string} response.increaseLiquidityQuotation.amountA amount of token A to be consumed by transaction
   * @param {string} response.increaseLiquidityQuotation.amountB amount of token B to be consumed by transaction
   * @param {object} response.increaseLiquidityTransaction The transaction data to be executed
   * @param {string} response.increaseLiquidityTransaction.calldata  hex string of the current transaction
   * @param {string} response.increaseLiquidityTransaction.value  amount of native token to be sent in this transaction
   * @param {string} response.increaseLiquidityTransaction.protocol  protocol of transaction
   * @param {string} response.increaseLiquidityTransaction.tokenA address of tokenA
   * @param {string} response.increaseLiquidityTransaction.tokenB  address of tokenB
   */
  constructor({
    increaseLiquidityQuotation,
    increaseLiquidityTransaction,
    value,
    protocol,
    amountA,
    amountB,
    calldata,
    tokenA,
    tokenB,
  }) {
    this.increaseLiquidityQuotation = increaseLiquidityQuotation
    this.increaseLiquidityQuotation.amountA = amountA
    this.increaseLiquidityQuotation.amountB = amountB
    this.increaseLiquidityTransaction = increaseLiquidityTransaction
    this.increaseLiquidityTransaction.calldata = calldata
    this.increaseLiquidityTransaction.value = value
    this.increaseLiquidityTransaction.protocol = protocol
    this.increaseLiquidityTransaction.tokenA = tokenA
    this.increaseLiquidityTransaction.tokenB = tokenB
  }
}
class GetMintPositionQuotationResponse {
  /**
   * Creates an instance of GetMintPositionQuotation
   *
   * @param {object} response
   * @param {object} response.mintPositionQuotation Quotation amounts for tokenA and tokenB
   * @param {string} response.mintPositionQuotation.amountA amount of token A to be consumed by transaction
   * @param {string} response.mintPositionQuotation.amountB amount of token B to be consumed by transaction
   * @param {object} response.mintPositionTransaction The transaction data to be executed
   * @param {string} response.mintPositionTransaction.calldata  hex string of the current transaction
   * @param {string} response.mintPositionTransaction.value  amount of native token to be sent in this transaction
   * @param {string} response.mintPositionTransaction.protocol  protocol of transaction
   * @param {string} response.mintPositionTransaction.tokenA address of tokenA
   * @param {string} response.mintPositionTransaction.tokenB  address of tokenB
   */
  constructor({
    mintPositionQuotation,
    mintPositionTransaction,
    value,
    protocol,
    amountA,
    amountB,
    calldata,
    tokenA,
    tokenB,
  }) {
    this.mintPositionQuotation = mintPositionQuotation
    this.mintPositionQuotation.amountA = amountA
    this.mintPositionQuotation.amountB = amountB
    this.mintPositionTransaction = mintPositionTransaction
    this.mintPositionTransaction.calldata = calldata
    this.mintPositionTransaction.value = value
    this.mintPositionTransaction.protocol = protocol
    this.mintPositionTransaction.tokenA = tokenA
    this.mintPositionTransaction.tokenB = tokenB
  }
}
class GetPoolsResponse {
  /**
   * Creates an instance of CreateGetPoolsResponse
   *
   * @param {Array.<{poolFee: String, poolAddress: String}>} response
   * @param {string} this.response[].poolFee
   * @param {string} this.response[].poolAddress
   */
  constructor({ poolFee, poolAddress }) {
    this[0].poolFee = poolFee
    this[0].poolAddress = poolAddress
  }
}

class GetPoolDataResponse {
  /**
   * Creates an instance of CreateGetPoolsResponse
   *
   * @param {Object} response Object of pool data responses
   * @param {string} response.poolAddress address of the pool
   * @param {string} response.fee transactions fee for the pool
   * @param {string} response.token0 token0 from the pool
   * @param {string} response.token1 token1 from the pool
   * @param {string} response.liquidity liquidity of the pool
   * @param {string} response.tickSpacing tickspacing of the pool
   * @param {Object} response.slot0 slot0 of the pool
   * @param {string} response.slot0.sqrtPriceX96 sqrtPriceX96
   * @param {string} response.slot0.tick tick
   * @param {string} response.slot0.observationIndex observationIndex
   * @param {string} response.slot0.observationCardinality observationCardinality
   * @param {string} response.slot0.observationCardinalityNext observationCardinalityNext
   * @param {string} response.slot0.feeProtocol feeProtocol
   * @param {string} response.slot0.unlocked unlocked
   */
  constructor({
    poolAddress,
    fee,
    token0,
    token1,
    liquidity,
    tickSpacing,
    slot0,
    sqrtPriceX96,
    tick,
    observationIndex,
    observationCardinality,
    observationCardinalityNext,
    feeProtocol,
    unlocked,
  }) {
    this.poolAddress = poolAddress
    this.fee = fee
    this.token0 = token0
    this.token1 = token1
    this.liquidity = liquidity
    this.tickSpacing = tickSpacing
    this.slot0 = slot0
    this.slot0.sqrtPriceX96 = sqrtPriceX96
    this.slot0.tick = tick
    this.slot0.observationIndex = observationIndex
    this.slot0.observationCardinality = observationCardinality
    this.slot0.observationCardinalityNext = observationCardinalityNext
    this.slot0.feeProtocol = feeProtocol
    this.slot0.unlocked = unlocked
  }
}

class ObservePoolResponse {
  /**
   * Creates an instance of ObservePoolResponse
   *
   * @param {object} response
   * @param {string} response.observedPrices array of prices at specified times
   */
  constructor({ observedPrices }) {
    this.observedPrices = observedPrices
  }
}

class GetSwapQuotationResponse {
  /**
   * Creates an instance of CreateGetSwapQuotation
   *
   * @param {object} response
   * @param {object} response.swapQuotation Quotation amounts for tokenA and tokenB
   * @param {string} response.swapQuotation.tokenIn amount of token In to be consumed by transaction
   * @param {string} response.swapQuotation.tokenOut amount of token Out to be received from transaction
   * @param {object} response.swapTransaction The transaction data to be executed
   * @param {string} response.swapTransaction.calldata  hex string of the current transaction
   * @param {string} response.swapTransaction.value  amount of native token to be sent in this transaction
   * @param {string} response.swapTransaction.protocol  protocol for this transaction
   * @param {string} response.swapTransaction.tokenIn  address of tokenIn
   * @param {string} response.swapTransaction.tokenOut  address of tokenOut
   */
  constructor({ swapQuotation, tokenIn, tokenOut, swapTransaction, calldata, value, protocol }) {
    this.swapQuotation = swapQuotation
    this.swapQuotation.tokenIn = tokenIn
    this.swapQuotation.tokenOut = tokenOut
    this.swapTransaction = swapTransaction
    this.swapTransaction.calldata = calldata
    this.swapTransaction.value = value
    this.swapTransaction.protocol = protocol
    this.swapTransaction.tokenIn = tokenIn
    this.swapTransaction.tokenOut = tokenOut
  }
}
class GetTokenIdsResponse {
  /**
   * Creates an instance of CreategetTokenIds
   *
   * @param {Array} response Array of token Ids
   */
  constructor({ response }) {
    this.response = response
  }
}
class GetPositionsResponse {
  /**
   * Creates an instance of CreateGetPosition
   *
   * @param {string} response response
   */
  constructor({ response }) {
    this.response = response
  }
}
class GetPositionResponse {
  /**
   * Creates an instance of CreateGetPositions
   *
    @param {Object} response An Array of Positions infos
    @param {string} response.nonce xxx
    @param {string} response.operator xxx
    @param {string} response.token0 xxx
    @param {string} response.token1 xxx
    @param {string} response.fee xxx
    @param {string} response.tickLower xxx
    @param {string} response.tickUpper xxx
    @param {string} response.liquidity: xxx
    @param {string} response.feeGrowthInside0LastX128 xxx
    @param {string} response.feeGrowthInside1LastX128 xxx
    @param {string} response.tokensOwed0 xxx
    @param {string} response.tokensOwed1: xxx
   */
  constructor({
    operator,
    token0,
    token1,
    fee,
    tickLower,
    tickUpper,
    liquidity,
    feeGrowthInside0LastX128,
    feeGrowthInside1LastX128,
    tokensOwed0,
    tokensOwed1,
  }) {
    this.nonce = nonce
    this.operator = operator
    this.token0 = token0
    this.token1 = token1
    this.fee = fee
    this.tickLower = tickLower
    this.tickUpper = tickUpper
    this.liquidity = liquidity
    this.feeGrowthInside0LastX128 = feeGrowthInside0LastX128
    this.feeGrowthInside1LastX128 = feeGrowthInside1LastX128
    this.tokensOwed0 = tokensOwed0
    this.tokensOwed1 = tokensOwed1
  }
}
class MintPositionResponse {
  /**
   * Creates an instance of MintPositionResponse
   *
   * @param {TransactionResponse | null} response.transaction transaction response object (if there is one) or null (if no transaction was made)
   */
  constructor({ transaction }) {
    this.transaction = transaction
  }
}
class CollectFeesResponse {
  /**
   * Creates an instance of CollectFeesResponse
   *
   * @param {TransactionResponse | null} response.transaction transaction response object (if there is one) or null (if no transaction was made)
   */
  constructor({ transaction }) {
    this.transaction = transaction
  }
}
class IncreaseLiquidityResponse {
  /**
   * Creates an instance of IncreaseLiquidityResponse
   *
   * @param {TransactionResponse | null} response.transaction transaction response object (if there is one) or null (if no transaction was made)
   */
  constructor({ transaction }) {
    this.transaction = transaction
  }
}
class DecreaseLiquidityResponse {
  /**
   * Creates an instance of DecreaseLiquidityResponse
   *
   * @param {TransactionResponse | null} response.transaction transaction response object (if there is one) or null (if no transaction was made)
   */
  constructor({ transaction }) {
    this.transaction = transaction
  }
}
class SwapResponse {
  /**
   * Creates an instance of SwapResponse
   *
   * @param {TransactionResponse | null} response.transaction transaction response object (if there is one) or null (if no transaction was made)
   */
  constructor({ transaction }) {
    this.transaction = transaction
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
  CreatePoolResponse,
  GetMintPositionQuotationResponse,
  GetIncreaseLiquidityQuotationResponse,
  GetPoolsResponse,
  GetPoolDataResponse,
  GetSwapQuotationResponse,
  GetTokenIdsResponse,
  GetPositionResponse,
  GetPositionsResponse,
  CollectFeesResponse,
  MintPositionResponse,
  IncreaseLiquidityResponse,
  DecreaseLiquidityResponse,
  ObservePoolResponse,
  SwapResponse,
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
