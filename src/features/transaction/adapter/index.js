const { getApiMethod, mountHeaders } = require('../../../services')

const Interface = require('./interface')
const requests = require('./requests.json')

class Adapter extends Interface {
  sendSignedTransaction(signedTransaction, config) {
    const method = getApiMethod({
      requests,
      key: 'sendSignedTransaction',
      config,
    })
    const headers = mountHeaders(config.apiKey)

    const { protocol, blob } = signedTransaction
    const payload = { protocol, signedTx: blob }

    return method(requests.sendSignedTransaction.url, payload, {
      headers,
      params: { protocol: signedTransaction.protocol },
    })
  }
}

module.exports = new Adapter()
