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
}

module.exports = UserCryptum
