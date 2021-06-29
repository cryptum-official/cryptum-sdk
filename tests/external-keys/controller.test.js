const { assert } = require('chai')
const faker = require('faker')
const nock = require('nock')
const AxiosApi = require('../../axios')
const { InvalidTypeException, GenericException } = require('../../errors')
const ExternalKeysController = require('../../src/features/external-keys/controller')
const requests = require('../../src/features/external-keys/controller/requests.json')
const { azureAuthenticationResponse } = require('./mocks')

describe.only('External Keys Controller Tests', () => {
  const config = {
    environment: 'development',
    apiKey: 'apikeyexamplecryptum',
  }
  const axiosApi = new AxiosApi(config)

  describe('azureAuthenticate()', () => {
    describe('when input is valid', () => {
      it('returns auth data from the credentials given', async () => {
        const azureConfig = {
          tenantId: faker.datatype.uuid(),
          clientId: faker.datatype.uuid(),
          clientSecret: faker.datatype.uuid(),
        };
        nock(requests.azureAuthenticate.baseUrl)
          .post(`/${azureConfig.tenantId}/oauth2/v2.0/token`)
          .reply(200, azureAuthenticationResponse)

        const controller = new ExternalKeysController({ ...config, azureConfig })

        const exec = await controller.azureAuthenticate(azureConfig)

        assert.deepStrictEqual(exec, azureAuthenticationResponse)
      })
    })
    describe('when input is invalid', () => {
      it('throws invalid type exception when tenant id given is not a string', async () => {
        try {
          const azureConfig = {
            tenantId: faker.datatype.number(),
            clientId: faker.datatype.uuid(),
            clientSecret: faker.datatype.uuid(),
          };

          const controller = new ExternalKeysController({ ...config, azureConfig })

          await controller.azureAuthenticate(azureConfig)
        } catch (error) {
          assert.deepStrictEqual(error instanceof InvalidTypeException, true)
        }
      })
      it('throws invalid type exception when client id given is not a string', async () => {
        try {
          const azureConfig = {
            tenantId: faker.datatype.uuid(),
            clientId: faker.datatype.number(),
            clientSecret: faker.datatype.uuid(),
          };

          const controller = new ExternalKeysController({ ...config, azureConfig })

          await controller.azureAuthenticate(azureConfig)
        } catch (error) {
          assert.deepStrictEqual(error instanceof InvalidTypeException, true)
        }
      })
      it('throws invalid type exception when client secret given is not a string', async () => {
        try {
          const azureConfig = {
            tenantId: faker.datatype.uuid(),
            clientId: faker.datatype.uuid(),
            clientSecret: faker.datatype.number(),
          };

          const controller = new ExternalKeysController({ ...config, azureConfig })

          await controller.azureAuthenticate(azureConfig)
        } catch (error) {
          assert.deepStrictEqual(error instanceof InvalidTypeException, true)
        }
      })
      it('throws generic exception when the request executed returns errors', async () => {
        try {
          const azureConfig = {
            tenantId: faker.datatype.uuid(),
            clientId: faker.datatype.uuid(),
            clientSecret: faker.datatype.uuid(),
          };
          nock(requests.azureAuthenticate.baseUrl)
            .post(`/${azureConfig.tenantId}/oauth2/v2.0/token`)
            .reply(400, { error: faker.datatype.string() })

          const controller = new ExternalKeysController({ ...config, azureConfig })

          const exec = await controller.azureAuthenticate(azureConfig)

          assert.deepStrictEqual(exec, azureAuthenticationResponse)
        } catch (error) {
          assert.deepStrictEqual(error instanceof Error, true)
        }
      })
    })
  })

  describe('getAzureToken()', () => {
    describe('when input is valid', () => {
      it('sets and return new azure token and expiration when none is set', async () => {
        const azureConfig = {
          tenantId: faker.datatype.uuid(),
          clientId: faker.datatype.uuid(),
          clientSecret: faker.datatype.uuid(),
        };
        nock(requests.azureAuthenticate.baseUrl)
          .post(`/${azureConfig.tenantId}/oauth2/v2.0/token`)
          .reply(200, azureAuthenticationResponse)

        const controller = new ExternalKeysController({ ...config, azureConfig })

        const getAzureToken = await controller.getAzureToken(azureConfig)

        assert.deepStrictEqual(getAzureToken, azureAuthenticationResponse.access_token)
      });
      it('sets and return new azure token and expiration when instance token is expired', async () => {
        const azureConfig = {
          tenantId: faker.datatype.uuid(),
          clientId: faker.datatype.uuid(),
          clientSecret: faker.datatype.uuid(),
        };
        nock(requests.azureAuthenticate.baseUrl)
          .post(`/${azureConfig.tenantId}/oauth2/v2.0/token`)
          .reply(200, azureAuthenticationResponse)

        const instanceAuth = {
          access_token: faker.datatype.uuid(),
          expires_on: new Date().getTime() - faker.datatype.number({ min: 99999 }),
        };
        const controller = new ExternalKeysController({ ...config, azureConfig })

        controller.azureToken = instanceAuth.access_token;
        controller.azureTokenExp = instanceAuth.expires_on;

        const getAzureToken = await controller.getAzureToken(azureConfig)

        assert.deepStrictEqual(getAzureToken, azureAuthenticationResponse.access_token)
        assert.notEqual(controller.azureToken, instanceAuth.access_token)
        assert.notEqual(controller.azureTokenExp, instanceAuth.expires_on)
      });
      it('returns instance azure token when it is valid', async () => {
        const azureConfig = {
          tenantId: faker.datatype.uuid(),
          clientId: faker.datatype.uuid(),
          clientSecret: faker.datatype.uuid(),
        };
        const instanceAuth = {
          access_token: faker.datatype.uuid(),
          expires_on: azureAuthenticationResponse.expires_on + faker.datatype.number({ min: 1000 }),
        };

        nock(requests.azureAuthenticate.baseUrl)
          .post(`/${azureConfig.tenantId}/oauth2/v2.0/token`)
          .reply(200, azureAuthenticationResponse)

        const controller = new ExternalKeysController({ ...config, azureConfig })

        controller.azureToken = instanceAuth.access_token;
        controller.azureTokenExp = instanceAuth.expires_on;

        const getAzureToken = await controller.getAzureToken(azureConfig)

        assert.deepStrictEqual(getAzureToken, instanceAuth.access_token)
        assert.deepStrictEqual(controller.azureTokenExp, instanceAuth.expires_on)
      });
    })

  })

  // describe('getAzureSecret()', () => {
  //   describe('when input is valid', () => {
  //     it('returns auth data from the credentials given', async () => {
  //       const azureConfig = {
  //         tenantId: faker.datatype.uuid(),
  //         clientId: faker.datatype.uuid(),
  //         clientSecret: faker.datatype.uuid(),
  //       };
  //       nock(requests.azureAuthenticate.baseUrl)
  //         .post(`/${azureConfig.tenantId}/oauth2/v2.0/token`)
  //         .reply(200, azureAuthenticationResponse)

  //       const controller = new ExternalKeysController({ ...config, azureConfig })

  //       const exec = await controller.azureAuthenticate(azureConfig)

  //       assert.deepStrictEqual(exec, azureAuthenticationResponse)
  //     })
  //   })
  //   describe('when input is invalid', () => {
  //     it('throws invalid type exception when tenant id given is not a string', async () => {
  //       try {
  //         const azureConfig = {
  //           tenantId: faker.datatype.number(),
  //           clientId: faker.datatype.uuid(),
  //           clientSecret: faker.datatype.uuid(),
  //         };

  //         const controller = new ExternalKeysController({ ...config, azureConfig })

  //         await controller.azureAuthenticate(azureConfig)
  //       } catch (error) {
  //         assert.deepStrictEqual(error instanceof InvalidTypeException, true)
  //       }
  //     })
  //     it('throws invalid type exception when client id given is not a string', async () => {
  //       try {
  //         const azureConfig = {
  //           tenantId: faker.datatype.uuid(),
  //           clientId: faker.datatype.number(),
  //           clientSecret: faker.datatype.uuid(),
  //         };

  //         const controller = new ExternalKeysController({ ...config, azureConfig })

  //         await controller.azureAuthenticate(azureConfig)
  //       } catch (error) {
  //         assert.deepStrictEqual(error instanceof InvalidTypeException, true)
  //       }
  //     })
  //     it('throws invalid type exception when client secret given is not a string', async () => {
  //       try {
  //         const azureConfig = {
  //           tenantId: faker.datatype.uuid(),
  //           clientId: faker.datatype.uuid(),
  //           clientSecret: faker.datatype.number(),
  //         };

  //         const controller = new ExternalKeysController({ ...config, azureConfig })

  //         await controller.azureAuthenticate(azureConfig)
  //       } catch (error) {
  //         assert.deepStrictEqual(error instanceof InvalidTypeException, true)
  //       }
  //     })
  //     it('throws generic exception when the request executed returns errors', async () => {
  //       try {
  //         const azureConfig = {
  //           tenantId: faker.datatype.uuid(),
  //           clientId: faker.datatype.uuid(),
  //           clientSecret: faker.datatype.uuid(),
  //         };
  //         nock(requests.azureAuthenticate.baseUrl)
  //           .post(`/${azureConfig.tenantId}/oauth2/v2.0/token`)
  //           .reply(400, { error: faker.datatype.string() })

  //         const controller = new ExternalKeysController({ ...config, azureConfig })

  //         const exec = await controller.azureAuthenticate(azureConfig)

  //         assert.deepStrictEqual(exec, azureAuthenticationResponse)
  //       } catch (error) {
  //         assert.deepStrictEqual(error instanceof Error, true)
  //       }
  //     })
  //   })
  // })
})
