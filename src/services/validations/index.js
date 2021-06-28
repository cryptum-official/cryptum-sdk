const { GenericException } = require('../../../errors')
const { TransactionType } = require('../../features/transaction/entity')
const { Protocol } = require('../blockchain/constants')

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
  feeCurrencyContractAddress,
}) => {
  if (!wallet) {
    throw new GenericException('Invalid wallet', 'InvalidTypeException')
  }
  if (!tokenSymbol || typeof tokenSymbol !== 'string') {
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
  if (feeCurrencyContractAddress && typeof feeCurrencyContractAddress !== 'string') {
    throw new GenericException('Invalid fee currency contract address', 'InvalidTypeException')
  }
}
module.exports.validateSmartContractTransactionParams = ({
  wallet,
  fee,
  testnet,
  contractAddress,
  feeCurrency,
  feeCurrencyContractAddress,
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
  if (feeCurrencyContractAddress && typeof feeCurrencyContractAddress !== 'string') {
    throw new GenericException('Invalid fee currency contract address', 'InvalidTypeException')
  }
  if (![Protocol.BSC, Protocol.CELO, Protocol.ETHEREUM].includes(protocol)) {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
}

module.exports.validateBitcoinTransferTransactionParams = ({ wallet, fromUTXOs, outputs }) => {
  if (wallet && fromUTXOs) {
    throw new GenericException(
      'Parameters wallet and fromUTXOs can not be sent at the same time',
      'InvalidTypeException'
    )
  }
  if (!wallet && !fromUTXOs) {
    throw new GenericException(
      'Parameters wallet and fromUTXOs are null, it should send one only',
      'InvalidTypeException'
    )
  }
  if (fromUTXOs && (!Array.isArray(fromUTXOs) || !fromUTXOs.length)) {
    throw new GenericException(
      'Invalid parameter fromUTXOs, it should be an array with length larger than 0',
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
