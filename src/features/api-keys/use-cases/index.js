const { NotCanMountException } = require('../../../../errors')

const ApiKeyCryptum = require('../entity')
const Interface = require('./interface')

class UseCases extends Interface {
  mountApiKey(apiKey) {
    if (!apiKey) throw new NotCanMountException('ApiKeyCryptum')

    if (!ApiKeyCryptum.validateMandatoryValues(apiKey))
      throw new NotCanMountException('ApiKeyCryptum')

    return new ApiKeyCryptum(apiKey)
  }
}

module.exports = new UseCases()
