const { getApiMethod } = require('../../../services')

const Interface = require('./interface')
const requests = require('./requests.json')

class Adapter extends Interface {
  auth(credentials, config) {
    const method = getApiMethod({ requests, key: 'auth', config })
    return method(requests.auth.url, credentials)
  }
}

module.exports = new Adapter()
