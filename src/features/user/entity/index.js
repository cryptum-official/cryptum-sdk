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
   */
  static isUserCryptum(user) {
    if (!(user instanceof UserCryptum)) return false
    if (!user.token || !user.id) return false

    return true
  }
}

module.exports = UserCryptum
