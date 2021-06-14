const UseCases = require('../use-cases')
const { handleRequestError } = require('../../../services')

const Adapter = require('../adapter')
const Interface = require('./interface')

class Controller extends Interface {
  async signTransaction(transaction) {
    try {
      const transactionCryptum = UseCases.mountTransactionToSign(transaction)

      const { data } = await Adapter.signTransaction(transactionCryptum, this.config)
      return UseCases.mountTransaction({ ...transactionCryptum, ...data })
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
