const UseCases = require('../use-cases')
const { handleRequestError } = require('../../../services')

const Adapter = require('../adapter')
const Interface = require('./interface')

class Controller extends Interface {
  async sendTransaction(transaction) {
    try {
      const transactionCryptum =
        UseCases.mountTransactionToSend(transaction)


      const { data } = await Adapter.sendTransaction(
        transactionCryptum,
        this.config
      )
      return UseCases.mountSignedTransaction({ ...transactionCryptum, ...data })
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
