const { GenericException } = require('../../errors')
const { TransactionType } = require('../features/transaction/entity')

module.exports.validateBitcoinTransferTransactionParams = ({ wallet, fromUTXOs, outputs }) => {
  if (wallet && fromUTXOs) {
    throw new GenericException('Parameters wallet and fromUTXOs can not be sent at the same time', 'INVALID_PARAM')
  }
  if (!wallet && !fromUTXOs) {
    throw new GenericException('Parameters wallet and fromUTXOs are null, it should send one only', 'INVALID_PARAM')
  }
  if (fromUTXOs && (!Array.isArray(fromUTXOs) || !fromUTXOs.length)) {
    throw new GenericException(
      'Invalid parameter fromUTXOs, it should be an array with length larger than 0',
      'INVALID_PARAM'
    )
  }
  if (!Array.isArray(outputs) || !outputs.length) {
    throw new GenericException(
      'Invalid parameter outputs, it should be an array with length larger than 0',
      'INVALID_PARAM'
    )
  }
}

module.exports.validateSignedTransaction = ({ signedTx, protocol, type }) => {
  if (!protocol || typeof protocol !== 'string') {
    throw new GenericException('Invalid protocol', 'INVALID_PARAM')
  }
  if (!signedTx || typeof signedTx !== 'string') {
    throw new GenericException('Invalid signedTx parameter', 'INVALID_PARAM')
  }
  if (!type || !TransactionType[type]) {
    throw new GenericException('Invalid transaction type', 'INVALID_PARAM')
  }
}