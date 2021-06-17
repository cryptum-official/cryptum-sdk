const { getApiMethod, mountHeaders } = require('../../../services')

const Interface = require('./interface')
const requests = require('./requests.json')

class Adapter extends Interface {
  createUserAccount(account, config) {
    const method = getApiMethod({
      requests,
      key: 'create',
      config,
    })
    const headers = mountHeaders(config.apiKey)

    return method(requests.create.url, account, { headers })
  }

  updateUserAccount(account, config) {
    const method = getApiMethod({
      requests,
      key: 'update',
      config,
    })
    const headers = mountHeaders(config.apiKey)

    return method(`${requests.update.url}/${account.internalId}`, account, { headers })
  }
}

module.exports = new Adapter()
