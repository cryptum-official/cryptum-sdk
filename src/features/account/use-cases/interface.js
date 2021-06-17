const { NotImplementedException } = require('../../../../errors')

class Interface {
  /**
   * Method to mount and validate an Cryptum User Account to send for API
   * 
   * @param {Object} account an Object with { internalId, name, phone, email }
   * All data required to send an new user account
   */
   mountUserAccountToCreate(account) {
    throw new NotImplementedException()
  }

  /**
   * Method to mount and validate an Cryptum User Account saved in backend
   *
   * @param {Object} account an Object with { internalId, name, phone, email, id, key, accounts }
   * All data returned of the Cryptum API
   */
   mountUserAccount(account) {
    throw new NotImplementedException()
  }
}

module.exports = Interface
