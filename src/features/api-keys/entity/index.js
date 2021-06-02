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
   * @returns true if is valid and false if not
   */
  static isApiKey(apiKey) {
    if (!(apiKey instanceof ApiKeyCryptum)) return false
    if (!apiKey.key || !apiKey.id || !apiKey.accessLevel) return false

    return true
  }

  /**
   * Validate if an object can mount an ApiKeyCryptum
   * 
   * @param {*} object generic object with mandatory values: key, id, accessLevel
   * @returns true if can mount and false if not
   */
  static validateMandatoryValues(object) {
    if (!object.key || !object.id || !object.accessLevel) return false

    return true
  }
}

module.exports = ApiKeyCryptum
