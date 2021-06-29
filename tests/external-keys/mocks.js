const faker = require('faker');

module.exports = {
  azureAuthenticationResponse: {
    access_token: faker.datatype.uuid(),
    expires_on: new Date().getTime() + 360000,
  },
  azureKeyVaultResponse: {
    value: faker.datatype.hexaDecimal(),
    id: faker.internet.url(),
    attributes: {
      enabled: faker.datatype.boolean(),
      created: faker.datatype.number(),
      updated: faker.datatype.number(),
      recoveryLevel: faker.datatype.string(),
      recoverableDays: faker.datatype.number()
    }
  },
}