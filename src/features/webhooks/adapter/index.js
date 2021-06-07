const { getApiMethod, mountTokenHeaders } = require('../../../services')

const Interface = require('./interface')
const requests = require('./requests.json')

class Adapter extends Interface {
  getApiKeys(user, config) {
    const method = getApiMethod({ requests, key: 'getApiKeys', config })
    const headers = mountTokenHeaders(user)

    return method(`${requests.getApiKeys.url}/${user.id}`, { headers })
  }
}

module.exports = new Adapter()
