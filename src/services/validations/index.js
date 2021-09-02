const { default: BigNumber } = require('bignumber.js')
const bip39 = require('bip39')
const { isValidAddress } = require('ripple-lib/dist/npm/common/schema-validator')
const { StrKey } = require('stellar-sdk')
const Web3 = require('web3')
const { GenericException, InvalidTypeException } = require('../../../errors')
const { TransactionType } = require('../../features/transaction/entity')
const { Protocol, TOKEN_TYPES } = require('../blockchain/constants')

module.exports.validatePrivateKey = (privateKey) => {
  if (!privateKey || typeof privateKey !== 'string') {
    throw new GenericException('Invalid private key', 'InvalidTypeException');
  }
}

module.exports.validateMnemonic = (mnemonic) => {
  if (mnemonic && typeof mnemonic !== 'string') {
    throw new InvalidTypeException('mnemonic', 'string')
  }
  if (mnemonic && !bip39.validateMnemonic(mnemonic)) {
    throw new GenericException('Invalid mnemonic', 'InvalidTypeException')
  }
}

module.exports.validateEthereumTransferTransactionParams = ({
  wallet,
  tokenSymbol,
  amount,
  destination,
  fee,
  testnet,
  contractAddress,
}) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet', 'InvalidTypeException')
  }
  if (tokenSymbol && typeof tokenSymbol !== 'string') {
    throw new GenericException('Invalid token symbol', 'InvalidTypeException')
  }
  if (!destination || typeof destination !== 'string') {
    throw new GenericException('Invalid destination', 'InvalidTypeException')
  }
  if (!amount || typeof amount !== 'string') {
    throw new GenericException('Invalid amount', 'InvalidTypeException')
  }
  if (fee && (!fee.gas || !fee.gasPrice)) {
    throw new GenericException(
      'Invalid fee, it should be an object with gas and gasPrice parameters',
      'InvalidTypeException'
    )
  }
  if (testnet !== undefined && typeof testnet !== 'boolean') {
    throw new GenericException('Invalid testnet', 'InvalidTypeException')
  }
  if (contractAddress && typeof contractAddress !== 'string') {
    throw new GenericException('Invalid contract address', 'InvalidTypeException')
  }
}
module.exports.validateCeloTransferTransactionParams = ({
  wallet,
  tokenSymbol,
  amount,
  destination,
  memo,
  fee,
  testnet,
  contractAddress,
  feeCurrency,
}) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet', 'InvalidTypeException')
  }
  if (tokenSymbol && typeof tokenSymbol !== 'string') {
    throw new GenericException('Invalid token symbol', 'InvalidTypeException')
  }
  if (!destination || typeof destination !== 'string') {
    throw new GenericException('Invalid destination', 'InvalidTypeException')
  }
  if (!amount || typeof amount !== 'string') {
    throw new GenericException('Invalid amount', 'InvalidTypeException')
  }
  if (memo && typeof memo !== 'string') {
    throw new GenericException('Invalid memo', 'InvalidTypeException')
  }
  if (fee && (!fee.gas || !fee.gasPrice)) {
    throw new GenericException(
      'Invalid fee, it should be an object with gas and gasPrice parameters',
      'InvalidTypeException'
    )
  }
  if (testnet !== undefined && typeof testnet !== 'boolean') {
    throw new GenericException('Invalid testnet', 'InvalidTypeException')
  }
  if (contractAddress && typeof contractAddress !== 'string') {
    throw new GenericException('Invalid contract address', 'InvalidTypeException')
  }
  if (feeCurrency && typeof feeCurrency !== 'string') {
    throw new GenericException('Invalid fee currency', 'InvalidTypeException')
  }
}
module.exports.validateSmartContractTransactionParams = ({
  wallet,
  fee,
  testnet,
  contractAddress,
  feeCurrency,
  protocol,
}) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet', 'InvalidTypeException')
  }
  if (fee && (!fee.gas || !fee.gasPrice)) {
    throw new GenericException(
      'Invalid fee, it should be an object with gas and gasPrice parameters',
      'InvalidTypeException'
    )
  }
  if (testnet !== undefined && typeof testnet !== 'boolean') {
    throw new GenericException('Invalid testnet', 'InvalidTypeException')
  }
  if (contractAddress && typeof contractAddress !== 'string') {
    throw new GenericException('Invalid contract address', 'InvalidTypeException')
  }
  if (feeCurrency && typeof feeCurrency !== 'string') {
    throw new GenericException('Invalid fee currency', 'InvalidTypeException')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM].includes(protocol)) {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
}
module.exports.validateSmartContractDeployTransactionParams = ({
  wallet,
  fee,
  testnet,
  source,
  contractName,
  params,
  feeCurrency,
  protocol,
}) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet', 'InvalidTypeException')
  }
  if (fee && (!fee.gas || !fee.gasPrice)) {
    throw new GenericException(
      'Invalid fee, it should be an object with gas and gasPrice parameters',
      'InvalidTypeException'
    )
  }
  if (testnet !== undefined && typeof testnet !== 'boolean') {
    throw new GenericException('Invalid testnet', 'InvalidTypeException')
  }
  if (params && !Array.isArray(params)) {
    throw new GenericException('Invalid params', 'InvalidTypeException')
  }
  if (source && typeof source !== 'string') {
    throw new GenericException('Invalid contract source', 'InvalidTypeException')
  }
  if (contractName && typeof contractName !== 'string') {
    throw new GenericException('Invalid contract name', 'InvalidTypeException')
  }
  if (feeCurrency && typeof feeCurrency !== 'string') {
    throw new GenericException('Invalid fee currency', 'InvalidTypeException')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM].includes(protocol)) {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
}
module.exports.validateTokenDeployTransactionParams = ({
  wallet,
  fee,
  testnet,
  tokenType,
  params,
  feeCurrency,
  protocol,
}) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet', 'InvalidTypeException')
  }
  if (fee && (!fee.gas || !fee.gasPrice)) {
    throw new GenericException(
      'Invalid fee, it should be an object with gas and gasPrice parameters',
      'InvalidTypeException'
    )
  }
  if (testnet !== undefined && typeof testnet !== 'boolean') {
    throw new GenericException('Invalid testnet', 'InvalidTypeException')
  }
  if (params && !Array.isArray(params)) {
    throw new GenericException('Invalid params', 'InvalidTypeException')
  }
  if (tokenType && !Object.keys(TOKEN_TYPES).includes(tokenType)) {
    throw new GenericException('Invalid token type', 'InvalidTypeException')
  }
  if (feeCurrency && typeof feeCurrency !== 'string') {
    throw new GenericException('Invalid fee currency', 'InvalidTypeException')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM].includes(protocol)) {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
}
module.exports.validateSmartContractCallParams = ({ contractAddress, contractAbi, method, params, protocol }) => {
  if (!contractAddress || typeof contractAddress !== 'string') {
    throw new GenericException('Invalid contract address', 'InvalidTypeException')
  }
  if (!contractAbi || typeof contractAbi !== 'object') {
    throw new GenericException('Invalid contract ABI', 'InvalidTypeException')
  }
  if (!method || typeof method !== 'string') {
    throw new GenericException('Invalid contract method', 'InvalidTypeException')
  }
  if (params && !Array.isArray(params)) {
    throw new GenericException('Invalid contract params', 'InvalidTypeException')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM].includes(protocol)) {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
}

module.exports.validateBitcoinTransferTransactionParams = ({ wallet, inputs, outputs }) => {
  if (wallet && inputs) {
    throw new GenericException(
      'Parameters wallet and inputs can not be sent at the same time',
      'InvalidTypeException'
    )
  }
  if (!wallet && !inputs) {
    throw new GenericException(
      'Parameters wallet and inputs are null, it should send one only',
      'InvalidTypeException'
    )
  }
  if (inputs && (!Array.isArray(inputs) || !inputs.length)) {
    throw new GenericException(
      'Invalid parameter inputs, it should be an array with length larger than 0',
      'InvalidTypeException'
    )
  }
  if (!Array.isArray(outputs) || !outputs.length) {
    throw new GenericException(
      'Invalid parameter outputs, it should be an array with length larger than 0',
      'InvalidTypeException'
    )
  }
}

module.exports.validateStellarTransferTransactionParams = ({
  wallet,
  assetSymbol,
  issuer,
  amount,
  destination,
  memo,
  fee,
  testnet,
  createAccount,
  timeout,
}) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet', 'InvalidTypeException')
  }
  if (fee && typeof fee !== 'string') {
    throw new GenericException('Invalid fee, it should be a string in drops', 'InvalidTypeException')
  }
  if (testnet !== undefined && typeof testnet !== 'boolean') {
    throw new GenericException('Invalid testnet', 'InvalidTypeException')
  }
  if (!assetSymbol || typeof assetSymbol !== 'string') {
    throw new InvalidTypeException('assetSymbol', 'string')
  }
  if (issuer && typeof issuer !== 'string' && !StrKey.isValidEd25519PublicKey(issuer)) {
    throw new GenericException('Invalid issuer account', 'InvalidTypeException')
  }
  if (!destination || typeof destination !== 'string' || !StrKey.isValidEd25519PublicKey(destination)) {
    throw new GenericException('Invalid issuer account', 'InvalidTypeException')
  }
  const _amount = new BigNumber(amount)
  if (!amount || typeof amount !== 'string' || _amount.isNaN() || _amount.lte(0)) {
    throw new GenericException('Invalid amount', 'InvalidTypeException')
  }
  if (memo && typeof memo !== 'string') {
    throw new GenericException('Invalid memo', 'InvalidTypeException')
  }
  if (createAccount && typeof createAccount !== 'boolean') {
    throw new InvalidTypeException('createAccount', 'boolean')
  }
  const _timeout = new BigNumber(timeout)
  if (timeout && (typeof timeout !== 'number' || _timeout.isNaN() || _timeout.lte(0))) {
    throw new InvalidTypeException('timeout', 'number')
  }
}
module.exports.validateRippleTransferTransactionParams = ({
  wallet,
  assetSymbol,
  issuer,
  amount,
  destination,
  memo,
  fee,
  testnet,
}) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet', 'InvalidTypeException')
  }
  if (fee && typeof fee !== 'string') {
    throw new GenericException('Invalid fee, it should be a string in drops', 'InvalidTypeException')
  }
  if (testnet !== undefined && typeof testnet !== 'boolean') {
    throw new GenericException('Invalid testnet', 'InvalidTypeException')
  }
  if (!assetSymbol || typeof assetSymbol !== 'string') {
    throw new InvalidTypeException('assetSymbol', 'string')
  }
  if (issuer && typeof issuer !== 'string' && !isValidAddress(issuer)) {
    throw new GenericException('Invalid issuer account', 'InvalidTypeException')
  }
  if (!destination || typeof destination !== 'string' || !isValidAddress(destination)) {
    throw new GenericException('Invalid issuer account', 'InvalidTypeException')
  }
  const _amount = new BigNumber(amount)
  if (!amount || typeof amount !== 'string' || _amount.isNaN() || _amount.lte(0)) {
    throw new GenericException('Invalid amount', 'InvalidTypeException')
  }
  if (memo && typeof memo !== 'string') {
    throw new GenericException('Invalid memo', 'InvalidTypeException')
  }
}

module.exports.validateStellarTrustlineTransactionParams = ({
  wallet,
  assetSymbol,
  issuer,
  fee,
  limit,
  memo,
  timeout,
  testnet,
}) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet', 'InvalidTypeException')
  }
  if (fee && typeof fee !== 'string') {
    throw new GenericException('Invalid fee, it should be a string in drops', 'InvalidTypeException')
  }
  if (testnet !== undefined && typeof testnet !== 'boolean') {
    throw new GenericException('Invalid testnet', 'InvalidTypeException')
  }
  if (!assetSymbol || typeof assetSymbol !== 'string') {
    throw new InvalidTypeException('assetSymbol', 'string')
  }
  if (!issuer || typeof issuer !== 'string' || !StrKey.isValidEd25519PublicKey(issuer)) {
    throw new GenericException('Invalid issuer account', 'InvalidTypeException')
  }
  const _limit = new BigNumber(limit)
  if (!limit || typeof limit !== 'string' || _limit.isNaN() || _limit.lt(0)) {
    throw new GenericException('Invalid limit', 'InvalidTypeException')
  }
  const _timeout = new BigNumber(timeout)
  if (timeout && (typeof timeout !== 'number' || _timeout.isNaN() || _timeout.lte(0))) {
    throw new InvalidTypeException('timeout', 'number')
  }
  if (memo && typeof memo !== 'string') {
    throw new GenericException('Invalid memo', 'InvalidTypeException')
  }
}

module.exports.validateRippleTrustlineTransactionParams = ({
  wallet,
  assetSymbol,
  issuer,
  fee,
  limit,
  memo,
  testnet,
}) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet', 'InvalidTypeException')
  }
  if (fee && typeof fee !== 'string') {
    throw new GenericException('Invalid fee, it should be a string in drops', 'InvalidTypeException')
  }
  if (testnet !== undefined && typeof testnet !== 'boolean') {
    throw new GenericException('Invalid testnet', 'InvalidTypeException')
  }
  if (!assetSymbol || typeof assetSymbol !== 'string') {
    throw new InvalidTypeException('assetSymbol', 'string')
  }
  if (!issuer || typeof issuer !== 'string' || !isValidAddress(issuer)) {
    throw new GenericException('Invalid issuer account', 'InvalidTypeException')
  }
  const _limit = new BigNumber(limit)
  if (!limit || typeof limit !== 'string' || _limit.isNaN() || _limit.lt(0)) {
    throw new GenericException('Invalid limit', 'InvalidTypeException')
  }
  if (memo && typeof memo !== 'string') {
    throw new GenericException('Invalid memo', 'InvalidTypeException')
  }
}

module.exports.validateSignedTransaction = ({ signedTx, protocol, type }) => {
  if (!protocol || typeof protocol !== 'string') {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
  if (!signedTx || typeof signedTx !== 'string') {
    throw new GenericException('Invalid signedTx parameter', 'InvalidTypeException')
  }
  if (!type || !TransactionType[type]) {
    throw new GenericException('Invalid transaction type', 'InvalidTypeException')
  }
}

module.exports.validateEthAddress = (address) => {
  if (!Web3.utils.isAddress(address)) {
    throw new InvalidTypeException(address, 'string')
  }
}
module.exports.validateRippleAddress = (address) => {
  if (!isValidAddress(address)) {
    throw new InvalidTypeException(address, 'string')
  }
}
module.exports.validateStellarAddress = (address) => {
  if (!StrKey.isValidEd25519PublicKey(address)) {
    throw new InvalidTypeException(address, 'string')
  }
}
module.exports.validatePositiveAmount = (amount) => {
  const value = new BigNumber(amount)
  if (value.isNaN() || value.lte(0)) {
    throw new GenericException('Invalid amount', 'InvalidTypeException')
  }
}
module.exports.validatePositive = (n) => {
  const value = new BigNumber(n)
  if (value.isNaN() || value.isNegative()) {
    throw new GenericException('Invalid value', 'InvalidTypeException')
  }
}

module.exports.validateWalletInfo = ({ address, protocol, tokenAddresses }) => {
  if (!address || typeof address !== 'string') {
    throw new InvalidTypeException('address', 'string')
  }
  if (!protocol || typeof protocol !== 'string') {
    throw new InvalidTypeException('protocol', 'string')
  }
  if (tokenAddresses && !Array.isArray(tokenAddresses)) {
    throw new InvalidTypeException('tokenAddresses', 'array')
  }
}
