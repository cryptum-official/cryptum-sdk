const CryptumSDK = require('./index')

const sdk = new CryptumSDK({
  config: {
    enviroment: 'development',
  },
})

const userController = sdk.getUserController()

userController.auth({
  email: 'yury@sample.com',
  password: '12344',
}).then(user => console.log(user))
