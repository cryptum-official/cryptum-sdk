const CryptumSDK = require('./index')

const credentialsTest = {
  email: 'yury@sample.com',
  password: '1234',
}

const configuration = {
  config: {
    enviroment: 'development',
  },
}

const sdk = new CryptumSDK(configuration)

const testUserCryptum = async () => {
  const userController = sdk.getUserController()
  const userCryptum = await userController.auth(credentialsTest)

  console.log(userCryptum)
}

const testApiKeys = async () => {
  const userController = sdk.getUserController()
  const userCryptum = await userController.auth(credentials)

  const apiKeyController = sdk.getApiKeyController()
  const apiKeys = await apiKeyController.getApiKeys(userCryptum)
  console.log(apiKeys)
}

testApiKeys()
