const { getApiMethod, mountHeaders } = require('../../../services')

const Interface = require('./interface')
const requests = require('./requests.json')

class Adapter extends Interface {
  sendSignTransaction(transaction, config) {
    const method = getApiMethod({ requests, key: 'sendSignTransaction', config })
    const headers = mountHeaders(config.apiKey)

    const payload = {
      ...transaction,
      signedTx: transaction.signature,
    }

    return method(requests.sendSignTransaction.url, payload, {
      headers,
      params: { protocol: transaction.protocol },
    })
  }
}

module.exports = new Adapter()
