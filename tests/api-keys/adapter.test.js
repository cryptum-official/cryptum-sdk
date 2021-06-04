const assert = require('assert')
const nock = require('nock')

const ApiKeyAdapter = require('../../src/features/api-keys/adapter')
const UserCryptum = require('../../src/features/user/entity')

describe.only('Test Suite of the Api Key (Adapter)', function () {
  this.beforeAll(() => {
    const successResponse = {
      apikeys: [
        {
          id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
          name: 'Sample Key With created at',
          key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
          active: 1,
          ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
          createdAt: '2021-05-21T17:54:32.000Z',
          accessLevel: 'fullaccess',
        },
        {
          id: '20118495-d476-4aa9-bf29-d53fa9cb1878',
          name: 'Sample Key',
          key: 'AKFHdVHfSKrXhxtL0XHdY8uE4VjYgiMS2c5cPV5n1+E=',
          active: 1,
          ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
          createdAt: null,
          accessLevel: 'read',
        },
        {
          id: '631e643e-8f12-4d13-bf30-e640adcfe22f',
          name: 'Sample Key Write',
          key: '/5YKmKt17Iz1aotVK4iWuUKEJ9s0KnKcH/tfakSj0lQ=',
          active: 1,
          ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
          createdAt: null,
          accessLevel: 'write',
        },
      ],
    }

    const failResponse = {
      error: {
        message: 'jwt malformed',
        type: 400,
      },
    }

    nock('http://localhost:8080', {
      reqheaders: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OGIxNGEzMC1hNjc1LTRkNjEtOGFmYi1lM2M2ZDM3NzQzZmYiLCJjcmVhdGVUaW1lIjoiMjAyMS0wNi0wNFQxNDoxMzoyNC4zMzlaIiwiaWF0IjoxNjIyODE2MDA0fQ.oSS_6pd6CxNE_9tYL-hsLt1n9ui5vGfZhjhGDC02ma0',
      },
    })
      .get('/apiKey/58b14a30-a675-4d61-8afb-e3c6d37743ff')
      .reply(200, successResponse)

    nock('http://localhost:8080', {
      reqheaders: {
        Authorization: 'Bearer fail',
      },
    })
      .get('/apiKey/58b14a30-a675-4d61-8afb-e3c6d37743ff')
      .reply(401, failResponse)
  })

  it('Check if an adapter can get apikeys (With valid data)', async () => {
    const expectedResult = {
      apikeys: [
        {
          id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
          name: 'Sample Key With created at',
          key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
          active: 1,
          ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
          createdAt: '2021-05-21T17:54:32.000Z',
          accessLevel: 'fullaccess',
        },
        {
          id: '20118495-d476-4aa9-bf29-d53fa9cb1878',
          name: 'Sample Key',
          key: 'AKFHdVHfSKrXhxtL0XHdY8uE4VjYgiMS2c5cPV5n1+E=',
          active: 1,
          ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
          createdAt: null,
          accessLevel: 'read',
        },
        {
          id: '631e643e-8f12-4d13-bf30-e640adcfe22f',
          name: 'Sample Key Write',
          key: '/5YKmKt17Iz1aotVK4iWuUKEJ9s0KnKcH/tfakSj0lQ=',
          active: 1,
          ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
          createdAt: null,
          accessLevel: 'write',
        },
      ],
    }

    const user = new UserCryptum({
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OGIxNGEzMC1hNjc1LTRkNjEtOGFmYi1lM2M2ZDM3NzQzZmYiLCJjcmVhdGVUaW1lIjoiMjAyMS0wNi0wNFQxNDoxMzoyNC4zMzlaIiwiaWF0IjoxNjIyODE2MDA0fQ.oSS_6pd6CxNE_9tYL-hsLt1n9ui5vGfZhjhGDC02ma0',
      name: 'Example User',
      phone: null,
      email: 'example@blockforce.in',
      userId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      id: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      language: null,
      institution: null,
    })

    const { data } = await ApiKeyAdapter.getApiKeys(user, {
      enviroment: 'development',
    })
    assert.deepStrictEqual(data, expectedResult)
  })

  it('Check if an adapter can get apikeys (With invalid data)', async () => {
    const expectedResult = 'Request failed with status code 401'

    const user = new UserCryptum({
      token: 'fail',
      name: 'Example User',
      phone: null,
      email: 'example@blockforce.in',
      userId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      id: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      language: null,
      institution: null,
    })

    try {
      await ApiKeyAdapter.getApiKeys(user, { enviroment: 'development' })
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an adapter can get apikeys (With invalid data - null)', async () => {
    const expectedResult =
      'The "userCryptum" parameter must be of the "UserCryptum" type'

    try {
      await ApiKeyAdapter.getApiKeys(null, { enviroment: 'development' })
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an adapter can get apikeys (With invalid data - undefined)', async () => {
    const expectedResult =
      'The "userCryptum" parameter must be of the "UserCryptum" type'

    try {
      await ApiKeyAdapter.getApiKeys(undefined, { enviroment: 'development' })
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an adapter can auth (With invalid enviroment)', async () => {
    const expectedResult =
      'An error with this code: 000 and this type: Invalid enviroment has occurred'

    const user = new UserCryptum({
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OGIxNGEzMC1hNjc1LTRkNjEtOGFmYi1lM2M2ZDM3NzQzZmYiLCJjcmVhdGVUaW1lIjoiMjAyMS0wNi0wNFQxNDoxMzoyNC4zMzlaIiwiaWF0IjoxNjIyODE2MDA0fQ.oSS_6pd6CxNE_9tYL-hsLt1n9ui5vGfZhjhGDC02ma0',
      name: 'Example User',
      phone: null,
      email: 'example@blockforce.in',
      userId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      id: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      language: null,
      institution: null,
    })

    try {
      await ApiKeyAdapter.getApiKeys(user, { enviroment: 'invalid' })
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })
})
