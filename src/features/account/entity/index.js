class UserAccountCryptum {
  constructor({ internalId, name, phone, email, twoFactor, twoFactorData, key, id, accounts }) {
    this.internalId = internalId
    this.name = name
    this.phone = phone
    this.email = email
    this.twoFactor = twoFactor
    this.twoFactorData = twoFactorData

    this.key = key
    this.id = id
    this.accounts = accounts
  }
}

module.exports = UserAccountCryptum
