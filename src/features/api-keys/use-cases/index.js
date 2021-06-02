const { NotCanMountException } = require('../../../../errors')

const ApiKeyCryptum = require('../entity')
const Interface = require('./interface')

class UseCases extends Interface {
  mountApiKeys(apiKeys) {
    const keys = apiKeys.map(apiKey => {
      if (!apiKey || !apiKey.key || !apiKey.id || !apiKey.accessLevel)
        throw new NotCanMountException('ApiKeyCryptum')

      return new ApiKeyCryptum(apiKey)
    })

    return keys
  }
}

module.exports = new UseCases()
