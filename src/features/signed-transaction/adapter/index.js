const { getApiMethod, mountHeaders } = require('../../../services')

const Interface = require('./interface')
const requests = require('./requests.json')

class Adapter extends Interface {
  sendSignTransaction(signedTransaction, config) {
    const method = getApiMethod({
      requests,
      key: 'sendSignTransaction',
      config,
    })
    const headers = mountHeaders(config.apiKey)

    const { protocol, transaction } = signedTransaction
    const payload = { protocol, signedTx: transaction }

    return method(requests.sendSignTransaction.url, payload, {
      headers,
      params: { protocol: signedTransaction.protocol },
    })
  }
}

module.exports = new Adapter()
