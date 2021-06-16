const UseCases = require('../use-cases')
const { handleRequestError } = require('../../../services')

const Adapter = require('../adapter')
const Interface = require('./interface')

class Controller extends Interface {
  async sendSignedTransaction(signedTransaction) {
    try {
      const signedTransactionCryptum =
        UseCases.mountTransactionToSend(signedTransaction)

      const { data } = await Adapter.sendSignedTransaction(
        signedTransactionCryptum,
        this.config
      )
      return UseCases.mountSignedTransaction({ ...signedTransactionCryptum, ...data })
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
