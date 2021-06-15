const UseCases = require('../use-cases')
const { handleRequestError } = require('../../../services')

const Adapter = require('../adapter')
const Interface = require('./interface')

class Controller extends Interface {
  async sendSignTransaction(transaction) {
    try {
      const transactionCryptum = UseCases.mountTransactionToSign(transaction)

      const { data } = await Adapter.sendSignTransaction(transactionCryptum, this.config)
      return UseCases.mountTransaction({ ...transactionCryptum, ...data })
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
