class ApiKeyCryptum {
  constructor({ id, name, key, active, ownerId, createdAt, accessLevel }) {
    this.id = id
    this.name = name
    this.key = key
    this.active = active
    this.ownerId = ownerId
    this.createdAt = createdAt
    this.accessLevel = accessLevel
  }

  /**
   * Method to validate if an api key is valid
   *
   * @param {*} apiKey to validate if is an ApiKeyCryptum valid
   */
  isApiKey(apiKey) {
    if (!(apiKey instanceof ApiKeyCryptum)) return false
    if (!apiKey.key || !apiKey.id || !apiKey.accessLevel) return false

    return true
  }
}

module.exports = ApiKeyCryptum
