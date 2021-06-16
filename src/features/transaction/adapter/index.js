const { getApiMethod, mountHeaders } = require('../../../services')

const Interface = require('./interface')
const requests = require('./requests.json')

class Adapter extends Interface {
  sendTransaction(transaction, config) {
    const method = getApiMethod({
      requests,
      key: 'sendTransaction',
      config,
    })
    const headers = mountHeaders(config.apiKey)

    const { protocol, blob } = transaction
    const payload = { protocol, signedTx: blob }

    return method(requests.sendTransaction.url, payload, {
      headers,
      params: { protocol: transaction.protocol },
    })
  }
}

module.exports = new Adapter()
