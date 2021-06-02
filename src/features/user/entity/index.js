class UserCryptum {
  constructor({
    token,
    name,
    phone,
    email,
    userId,
    id,
    language,
    institution,
  }) {
    this.token = token
    this.name = name
    this.phone = phone
    this.email = email
    this.userId = userId
    this.id = id
    this.language = language
    this.institution = institution
  }

  /**
   * Method to validate if an user is UserCryptum valid
   *
   * @param {*} user to validate if is an UserCryptum valid
   * @returns true if is valid and false if not
   */
  static isUserCryptum(user) {
    if (!(user instanceof UserCryptum)) return false
    if (!user.token || !user.id) return false

    return true
  }

  /**
   * Validate if an object can mount an UserCryptum
   *
   * @param {*} object generic object with mandatory values: token, id
   * @returns true if can mount and false if not
   */
  static validateMandatoryValues(object) {
    if (!object.token || !object.id) return false

    return true
  }
}

module.exports = UserCryptum
