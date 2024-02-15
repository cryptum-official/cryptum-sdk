const { default: BigNumber } = require('bignumber.js')
const bip39 = require('bip39')
const { isValidAddress } = require('ripple-lib/dist/npm/common/schema-validator')
const { StrKey } = require('stellar-sdk')
const Web3 = require('web3')
const { GenericException, InvalidTypeException, HathorException } = require('../../errors')
const InvalidException = require('../../errors/InvalidException')
const { TransactionType } = require('../../features/transaction/entity')
const { Protocol, TOKEN_TYPES } = require('../blockchain/constants')

const validatePrivateKey = (privateKey) => {
  if (!privateKey || typeof privateKey !== 'string') {
    throw new GenericException('Invalid private key', 'InvalidTypeException')
  }
}

const validateCardanoPrivateKey = (privateKey) => {
  if (
    !privateKey ||
    !privateKey.spendingPrivateKey ||
    !privateKey.stakingPrivateKey ||
    typeof privateKey.spendingPrivateKey !== 'string' ||
    typeof privateKey.stakingPrivateKey !== 'string'
  ) {
    throw new GenericException('Invalid private key object', 'InvalidTypeException')
  }
}

const validateMnemonic = (mnemonic) => {
  if (mnemonic && typeof mnemonic !== 'string') {
    throw new InvalidTypeException('mnemonic', 'string')
  }
  if (mnemonic && !bip39.validateMnemonic(mnemonic)) {
    throw new GenericException('Invalid mnemonic', 'InvalidTypeException')
  }
}

const validateEthereumTransferTransactionParams = ({
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

const validateCeloTransferTransactionParams = ({
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
const validateSmartContractTransactionParams = ({ wallet, fee, testnet, contractAddress, feeCurrency, protocol }) => {
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
  if (
    ![
      Protocol.BSC,
      Protocol.CELO,
      Protocol.ETHEREUM,
      Protocol.STRATUS,
      Protocol.BESU,
      Protocol.AVAXCCHAIN,
      Protocol.CHILIZ,
      Protocol.POLYGON,
    ].includes(protocol)
  ) {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
}
const validateSmartContractDeployTransactionParams = ({
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
  if (
    ![
      Protocol.BSC,
      Protocol.CELO,
      Protocol.ETHEREUM,
      Protocol.STRATUS,
      Protocol.BESU,
      Protocol.AVAXCCHAIN,
      Protocol.CHILIZ,
      Protocol.POLYGON,
    ].includes(protocol)
  ) {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
}
const validateTokenDeployTransactionParams = ({ wallet, fee, testnet, tokenType, params, feeCurrency, protocol }) => {
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
  if (
    ![
      Protocol.BSC,
      Protocol.CELO,
      Protocol.AVAXCCHAIN,
      Protocol.CHILIZ,
      Protocol.ETHEREUM,
      Protocol.STRATUS,
      Protocol.BESU,
      Protocol.POLYGON,
    ].includes(protocol)
  ) {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
}
const validateSmartContractCallParams = ({ contractAddress, contractAbi, method, params, protocol }) => {
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
  if (
    ![
      Protocol.BSC,
      Protocol.CELO,
      Protocol.AVAXCCHAIN,
      Protocol.CHILIZ,
      Protocol.ETHEREUM,
      Protocol.STRATUS,
      Protocol.BESU,
      Protocol.POLYGON,
    ].includes(protocol)
  ) {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
}

const validateBitcoinTransferTransactionParams = ({ wallet, inputs, outputs, data }) => {
  if (wallet && inputs) {
    throw new GenericException('Parameters wallet and inputs can not be sent at the same time', 'InvalidTypeException')
  }
  if (!wallet && !inputs) {
    throw new GenericException('Parameters wallet and inputs are null, it should send one only', 'InvalidTypeException')
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
  if (data) {
    if (typeof data !== 'string') {
      throw new InvalidTypeException('data', 'string')
    } else {
      if (data.length > 80) {
        throw new InvalidException('The data parameter has to be at most 80 characters long')
      }
    }
  }
}
const validateHathorTransferTransactionFromWallet = ({ wallet, outputs }) => {
  if (!wallet) {
    throw new GenericException('Parameter wallet is null', 'InvalidTypeException')
  }
  if (!Array.isArray(outputs) || !outputs.length) {
    throw new GenericException(
      'Invalid parameter outputs, it should be an array with length larger than 0',
      'InvalidTypeException'
    )
  }
}
const validateHathorTransferTransactionFromUTXO = ({ inputs, outputs }) => {
  if (!inputs) {
    throw new GenericException('Parameter inputs is null', 'InvalidTypeException')
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

const validateHathorTokenTransactionFromWallet = ({
  wallet,
  tokenUid,
  tokenName,
  tokenSymbol,
  address,
  changeAddress,
  mintAuthorityAddress,
  meltAuthorityAddress,
  amount,
  type,
  nftData,
}) => {
  if (!wallet) {
    throw new GenericException('Parameter wallet is null', 'InvalidTypeException')
  }
  if (
    ![
      TransactionType.HATHOR_TOKEN_CREATION,
      TransactionType.HATHOR_TOKEN_MELT,
      TransactionType.HATHOR_NFT_MELT,
      TransactionType.HATHOR_TOKEN_MINT,
      TransactionType.HATHOR_NFT_MINT,
    ].includes(type)
  ) {
    throw new HathorException('Invalid type')
  }
  if (type === TransactionType.HATHOR_TOKEN_CREATION) {
    if (!tokenName || typeof tokenName !== 'string') {
      throw new InvalidTypeException('tokenName', 'string')
    }
    if (!tokenSymbol || typeof tokenSymbol !== 'string') {
      throw new InvalidTypeException('tokenSymbol', 'string')
    }
    if (nftData && typeof nftData !== 'string') {
      throw new InvalidTypeException('nftData', 'string')
    }
    if (nftData && !new BigNumber(amount).isInteger()) {
      throw new InvalidException('Amount must be integer')
    }
  } else {
    if (!tokenUid || typeof tokenUid !== 'string') {
      throw new InvalidTypeException('tokenUid', 'string')
    }
  }
  validatePositiveAmount(amount)
  if (address && typeof address !== 'string') {
    throw new InvalidTypeException('address', 'string')
  }
  if (changeAddress && typeof changeAddress !== 'string') {
    throw new InvalidTypeException('changeAddress', 'string')
  }
  if (mintAuthorityAddress && typeof mintAuthorityAddress !== 'string') {
    throw new InvalidTypeException('mintAuthorityAddress', 'string')
  }
  if (meltAuthorityAddress && typeof meltAuthorityAddress !== 'string') {
    throw new InvalidTypeException('meltAuthorityAddress', 'string')
  }
}
const validateHathorTokenTransactionFromUTXO = ({
  inputs,
  tokenUid,
  tokenName,
  tokenSymbol,
  address,
  changeAddress,
  mintAuthorityAddress,
  meltAuthorityAddress,
  amount,
  type,
}) => {
  if (!inputs) {
    throw new GenericException('Parameter inputs is null', 'InvalidTypeException')
  }
  if (inputs && (!Array.isArray(inputs) || !inputs.length)) {
    throw new GenericException(
      'Invalid parameter inputs, it should be an array with length larger than 0',
      'InvalidTypeException'
    )
  }
  if (
    ![
      TransactionType.HATHOR_TOKEN_CREATION,
      TransactionType.HATHOR_TOKEN_MELT,
      TransactionType.HATHOR_TOKEN_MINT,
    ].includes(type)
  ) {
    throw new HathorException('Invalid type')
  }
  if (type === TransactionType.HATHOR_TOKEN_CREATION) {
    if (!tokenName || typeof tokenName !== 'string') {
      throw new InvalidTypeException('tokenName', 'string')
    }
    if (!tokenSymbol || typeof tokenSymbol !== 'string') {
      throw new InvalidTypeException('tokenSymbol', 'string')
    }
  } else {
    if (!tokenUid || typeof tokenUid !== 'string') {
      throw new InvalidTypeException('tokenUid', 'string')
    }
  }
  validatePositiveAmount(amount)
  if (address && typeof address !== 'string') {
    throw new InvalidTypeException('address', 'string')
  }
  if (changeAddress && typeof changeAddress !== 'string') {
    throw new InvalidTypeException('changeAddress', 'string')
  }
  if (mintAuthorityAddress && typeof mintAuthorityAddress !== 'string') {
    throw new InvalidTypeException('mintAuthorityAddress', 'string')
  }
  if (meltAuthorityAddress && typeof meltAuthorityAddress !== 'string') {
    throw new InvalidTypeException('meltAuthorityAddress', 'string')
  }
}

const validateStellarTransferTransactionParams = ({
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
const validateRippleTransferTransactionParams = ({
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

const validateStellarTrustlineTransactionParams = ({
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

const validateRippleTrustlineTransactionParams = ({ wallet, assetSymbol, issuer, fee, limit, memo, testnet }) => {
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

const validateSignedTransaction = ({ signedTx, protocol, type }) => {
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

const validateEthAddress = (address) => {
  if (!Web3.utils.isAddress(address)) {
    throw new InvalidTypeException(address, 'string')
  }
}
const validateRippleAddress = (address) => {
  if (!isValidAddress(address)) {
    throw new InvalidTypeException(address, 'string')
  }
}
const validateStellarAddress = (address) => {
  if (!StrKey.isValidEd25519PublicKey(address)) {
    throw new InvalidTypeException(address, 'string')
  }
}
const validatePositiveAmount = (amount) => {
  const value = new BigNumber(amount)
  if (value.isNaN() || value.lte(0)) {
    throw new GenericException('Invalid amount', 'InvalidTypeException')
  }
}
const validatePositive = (n) => {
  const value = new BigNumber(n)
  if (value.isNaN() || value.isNegative()) {
    throw new GenericException('Invalid value', 'InvalidTypeException')
  }
}

const validateWalletInfo = ({ address, protocol, tokenAddresses }) => {
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

const validateWalletNft = ({ address, protocol, tokenAddresses }) => {
  if (!address || typeof address !== 'string') {
    throw new InvalidTypeException('address', 'string')
  }
  if (!protocol || typeof protocol !== 'string') {
    throw new InvalidTypeException('protocol', 'string')
  }
  if (tokenAddresses && !Array.isArray(tokenAddresses)) {
    throw new InvalidTypeException('tokenAddresses', 'array of strings')
  }
}

const validateTransferTransactionParams = (input) => {
  const protocol = input.protocol

  switch (protocol) {
    case Protocol.ETHEREUM:
    case Protocol.STRATUS:
    case Protocol.BESU:
    case Protocol.BSC:
    case Protocol.POLYGON:
    case Protocol.AVAXCCHAIN:
    case Protocol.CHILIZ:
      validateEthereumTransferTransactionParams(input)
      break
    case Protocol.CELO:
      validateCeloTransferTransactionParams(input)
      break
  }
}

module.exports = {
  validateSignedTransaction,
  validateTransferTransactionParams,
  validatePrivateKey,
  validateBitcoinTransferTransactionParams,
  validateCardanoPrivateKey,
  validateCeloTransferTransactionParams,
  validateEthAddress,
  validateEthereumTransferTransactionParams,
  validateHathorTokenTransactionFromUTXO,
  validateHathorTokenTransactionFromWallet,
  validateHathorTransferTransactionFromUTXO,
  validateHathorTransferTransactionFromWallet,
  validateStellarTransferTransactionParams,
  validateRippleTransferTransactionParams,
  validateMnemonic,
  validatePositive,
  validatePositiveAmount,
  validateStellarAddress,
  validateWalletNft,
  validateWalletInfo,
  validateRippleTrustlineTransactionParams,
  validateRippleAddress,
  validateStellarTrustlineTransactionParams,
  validateTokenDeployTransactionParams,
  validateSmartContractTransactionParams,
  validateSmartContractDeployTransactionParams,
  validateSmartContractCallParams,
}
