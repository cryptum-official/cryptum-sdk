const assert = require('assert')
const nock = require('nock')

const UserAdapter = require('../../src/features/users/adapter')

describe.only('Test Suite of the User (Adapter)', function () {
  this.beforeAll(() => {
    const successResponse = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OGIxNGEzMC1hNjc1LTRkNjEtOGFmYi1lM2M2ZDM3NzQzZmYiLCJjcmVhdGVUaW1lIjoiMjAyMS0wNi0wNFQxNDoxMzoyNC4zMzlaIiwiaWF0IjoxNjIyODE2MDA0fQ.oSS_6pd6CxNE_9tYL-hsLt1n9ui5vGfZhjhGDC02ma0',
      name: 'Example User',
      phone: null,
      email: 'example@blockforce.in',
      userId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      id: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      language: null,
      institution: null,
    }

    const failResponse = {
      error: {
        code: 'UNAUTHORIZED',
        type: 401,
      },
    }

    nock('http://localhost:8080')
      .post('/check-user', {
        email: 'example@blockforce.in',
        password: 'secret',
      })
      .reply(200, successResponse)

    nock('http://localhost:8080')
      .post('/check-user', {
        email: 'example@blockforce.in',
        password: 'error',
      })
      .reply(401, failResponse)
  })

  it('Check if an adapter can auth (With valid data)', async () => {
    const expectedResult = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OGIxNGEzMC1hNjc1LTRkNjEtOGFmYi1lM2M2ZDM3NzQzZmYiLCJjcmVhdGVUaW1lIjoiMjAyMS0wNi0wNFQxNDoxMzoyNC4zMzlaIiwiaWF0IjoxNjIyODE2MDA0fQ.oSS_6pd6CxNE_9tYL-hsLt1n9ui5vGfZhjhGDC02ma0',
      name: 'Example User',
      phone: null,
      email: 'example@blockforce.in',
      userId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      id: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      language: null,
      institution: null,
    }

    const credentials = {
      email: 'example@blockforce.in',
      password: 'secret',
    }

    const { data } = await UserAdapter.auth(credentials, {
      enviroment: 'development',
    })
    assert.deepStrictEqual(data, expectedResult)
  })

  it('Check if an adapter can auth (With invalid data)', async () => {
    const expectedResult = 'Request failed with status code 401'

    const credentials = {
      email: 'example@blockforce.in',
      password: 'error',
    }

    try {
      await UserAdapter.auth(credentials, { enviroment: 'development' })
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an adapter can auth (With invalid enviroment)', async () => {
    const expectedResult =
      'An error with this code: 000 and this type: Invalid enviroment has occurred'

    const credentials = {
      email: 'example@blockforce.in',
      password: 'error',
    }

    try {
      await UserAdapter.auth(credentials, { enviroment: 'invalid' })
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })
})
