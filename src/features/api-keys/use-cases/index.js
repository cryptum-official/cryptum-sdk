const { NotCanMountException } = require('../../../../errors')

const ApiKeyCryptum = require('../entity')
const Interface = require('./interface')

class UseCases extends Interface {
  mountApiKeys(apiKeys) {
    if (!apiKeys) throw new NotCanMountException('ApiKeyCryptum')

    const keys = apiKeys.map(apiKey => {
      if (!ApiKeyCryptum.validateMandatoryValues(apiKey))
        throw new NotCanMountException('ApiKeyCryptum')

      return new ApiKeyCryptum(apiKey)
    })

    return keys
  }
}

module.exports = new UseCases()
