const { getApiMethod, mountHeaders } = require('../../../services')

const Interface = require('./interface')
const requests = require('./requests.json')

class Adapter extends Interface {
  signTransaction(transaction, config) {
    const method = getApiMethod({ requests, key: 'signTransaction', config })
    const headers = mountHeaders(config.apiKey)

    const payload = {
      ...transaction,
      signedTx: transaction.signature,
    }

    return method(requests.signTransaction.url, payload, {
      headers,
      params: { protocol: transaction.protocol },
    })
  }
}

module.exports = new Adapter()
