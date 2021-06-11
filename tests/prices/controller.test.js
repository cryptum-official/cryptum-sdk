const { assert } = require('chai');
const faker = require('faker');
const nock = require('nock');
const AxiosApi = require('../../axios');
const { InvalidTypeException, GenericException } = require('../../errors')
const PricesController = require('../../src/features/prices/controller');
const { pricesMock } = require('./mocks');

describe.only('Prices Controller Tests', () => {
  const config = {
    enviroment: 'development',
    apiKey: 'apikeyexamplecryptum',
  };
  const axiosApi = new AxiosApi(config);
  const baseUrl = axiosApi.getBaseUrl(config.enviroment);

  describe('getPrices()', () => {
    describe('when input is valid', () => {
      it('returns prices from the asset given', async () => {
        try {
          const asset = faker.finance.currencySymbol();

          nock(baseUrl).get(`/prices/${asset}`)
            .reply(200, pricesMock);

          const controller = new PricesController(config)

          const exec = await controller.getPrices(asset);

          assert.deepStrictEqual(exec, pricesMock);
        } catch (error) {
          throw error
        }
      })
    })
    describe('when input is invalid', () => {
      it('throws invalid type exception when asset given is not a string', async () => {
        try {
          const asset = faker.datatype.number();

          const controller = new PricesController(config)

          await controller.getPrices(asset);
        } catch (error) {
          assert.deepStrictEqual(error instanceof InvalidTypeException, true);
        }
      })
      it('throws generic exception when the request executed returns errors', async () => {
        try {
          const asset = faker.datatype.string();

          nock(baseUrl).get(`/prices/${asset}`)
            .reply(500, { error: faker.datatype.string() });

          const controller = new PricesController(config)

          await controller.getPrices(asset);
        } catch (error) {
          assert.deepStrictEqual(error instanceof Error, true);
        }
      })
      it('throws invalid cryptum api key exception when the apikey given is not a valid one', async () => {
        try {
          const asset = faker.datatype.string();

          nock(baseUrl).get(`/prices/${asset}`)
            .reply(200, pricesMock);

          const controller = new PricesController({})

          await controller.getPrices(asset);
        } catch (error) {
          assert.deepStrictEqual(error instanceof GenericException, true);
        }
      })
    })
  })
})