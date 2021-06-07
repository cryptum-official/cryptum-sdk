const assert = require('assert')
const nock = require('nock')

const {
  NotCanMountException,
  NotImplementedException,
  InvalidTypeException,
} = require('../../errors')
const {
  getApiMethod,
  mountTokenHeaders,
  mountApiKeyHeaders,
  handleRequestError,
} = require('../../src/services')

const UserCryptum = require('../../src/features/user/entity')
const ApiKeyCryptum = require('../../src/features/api-keys/entity')

describe.only('Test Suite of the Services (All project)', function () {
  this.beforeAll(() => {
    nock('http://localhost:8080')
      .post('/samplePOST', { test: 'post' })
      .reply(200, { tested: 'post_method' })

    nock('http://localhost:8080')
      .put('/samplePUT', { test: 'put' })
      .reply(200, { tested: 'put_method' })

    nock('http://localhost:8080')
      .get('/sampleGET')
      .reply(200, { tested: 'get_method' })

    nock('http://localhost:8080')
      .delete('/sampleDELETE')
      .reply(200, { tested: 'delete_method' })
  })

  it('Check if an services can mount an header (With valid UserCryptum) - method: mountTokenHeaders', async () => {
    const expectedResult = {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OGIxNGEzMC1hNjc1LTRkNjEtOGFmYi1lM2M2ZDM3NzQzZmYiLCJjcmVhdGVUaW1lIjoiMjAyMS0wNi0wNFQxNDoxMzoyNC4zMzlaIiwiaWF0IjoxNjIyODE2MDA0fQ.oSS_6pd6CxNE_9tYL-hsLt1n9ui5vGfZhjhGDC02ma0',
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

    const result = mountTokenHeaders(user)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an services can mount an header (With invalid UserCryptum) - method: mountTokenHeaders', async () => {
    const expectedResult =
      'The "userCryptum" parameter must be of the "UserCryptum" type, or not is an valid object'

    const user = new UserCryptum({
      token: null,
      name: 'Example User',
      phone: null,
      email: 'example@blockforce.in',
      userId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      id: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      language: null,
      institution: null,
    })

    try {
      mountTokenHeaders(user)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services can mount an header (With null UserCryptum) - method: mountTokenHeaders', async () => {
    const expectedResult =
      'The "userCryptum" parameter must be of the "UserCryptum" type, or not is an valid object'

    try {
      mountTokenHeaders(null)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services can mount an header (With undefined UserCryptum) - method: mountTokenHeaders', async () => {
    const expectedResult =
      'The "userCryptum" parameter must be of the "UserCryptum" type, or not is an valid object'

    try {
      mountTokenHeaders(undefined)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services throw respective error (With undefined param) - method: handleRequestError', async () => {
    const expectedResult = 'An error not mapped has occurred'

    try {
      handleRequestError(undefined)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services throw respective error (With null param) - method: handleRequestError', async () => {
    const expectedResult = 'An error not mapped has occurred'

    try {
      handleRequestError(null)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services throw respective error (With status 401 param) - method: handleRequestError', async () => {
    const expectedResult =
      'You dont have permission or not provided correct credentials or token'

    try {
      const error = {
        response: { data: { error: 'RESPONSE ERROR' }, status: 401 },
      }
      handleRequestError(error)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services throw respective error (With NotCanMountException error param) - method: handleRequestError', async () => {
    const expectedResult = 'Not can mount SampleEntity entity'

    try {
      handleRequestError(new NotCanMountException('SampleEntity'))
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services throw respective error (With NotImplementedException error param) - method: handleRequestError', async () => {
    const expectedResult = 'Method not implemented'

    try {
      handleRequestError(new NotImplementedException())
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services throw respective error (With InvalidTypeException error param) - method: handleRequestError', async () => {
    const expectedResult =
      'The "user" parameter must be of the "UserCryptum" type, or not is an valid object'

    try {
      handleRequestError(new InvalidTypeException('user', 'UserCryptum'))
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services get api method (With post method) - method: getApiMethod', async () => {
    const expectedResult = { tested: 'post_method' }

    const post = getApiMethod({
      requests: {
        auth: {
          method: 'POST',
          url: '/samplePOST',
        },
      },
      key: 'auth',
      config: {
        enviroment: 'development',
      },
    })
    const result = await post('/samplePOST', { test: 'post' })
    assert.deepStrictEqual(result.data, expectedResult)
  })

  it('Check if an services get api method (With put method) - method: getApiMethod', async () => {
    const expectedResult = { tested: 'put_method' }

    const post = getApiMethod({
      requests: {
        auth: {
          method: 'PUT',
          url: '/samplePUT',
        },
      },
      key: 'auth',
      config: {
        enviroment: 'development',
      },
    })
    const result = await post('/samplePUT', { test: 'put' })
    assert.deepStrictEqual(result.data, expectedResult)
  })

  it('Check if an services get api method (With get method) - method: getApiMethod', async () => {
    const expectedResult = { tested: 'get_method' }

    const get = getApiMethod({
      requests: {
        auth: {
          method: 'GET',
          url: '/sampleGET',
        },
      },
      key: 'auth',
      config: {
        enviroment: 'development',
      },
    })
    const result = await get('/sampleGET')
    assert.deepStrictEqual(result.data, expectedResult)
  })

  it('Check if an services get api method (With delete method) - method: getApiMethod', async () => {
    const expectedResult = { tested: 'delete_method' }

    const deleteMethod = getApiMethod({
      requests: {
        auth: {
          method: 'DELETE',
          url: '/sampleDELETE',
        },
      },
      key: 'auth',
      config: {
        enviroment: 'development',
      },
    })
    const result = await deleteMethod('/sampleDELETE')
    assert.deepStrictEqual(result.data, expectedResult)
  })

  it('Check if an services can mount an header (With valid ApiKeyCryptum) - method: mountApiKeyHeaders', async () => {
    const expectedResult = {
      'x-api-key': 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
    }

    const apiKey = new ApiKeyCryptum({
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    })

    const result = mountApiKeyHeaders(apiKey)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an services can mount an header (With invalid ApiKeyCryptum without key) - method: mountApiKeyHeaders', async () => {
    const expectedResult =
      'The "apiKeyCryptum" parameter must be of the "ApiKeyCryptum" type, or not is an valid object'

    const apiKey = new ApiKeyCryptum({
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    })

    try {
      mountApiKeyHeaders(apiKey)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services can mount an header (With invalid ApiKeyCryptum without id) - method: mountApiKeyHeaders', async () => {
    const expectedResult =
      'The "apiKeyCryptum" parameter must be of the "ApiKeyCryptum" type, or not is an valid object'

    const apiKey = new ApiKeyCryptum({
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    })

    try {
      mountApiKeyHeaders(apiKey)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services can mount an header (With valid JSON, but require ApiKeyCryptum) - method: mountApiKeyHeaders', async () => {
    const expectedResult =
      'The "apiKeyCryptum" parameter must be of the "ApiKeyCryptum" type, or not is an valid object'

    const apiKey = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    try {
      mountApiKeyHeaders(apiKey)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services can mount an header (With invalid JSON without key) - method: mountApiKeyHeaders', async () => {
    const expectedResult =
      'The "apiKeyCryptum" parameter must be of the "ApiKeyCryptum" type, or not is an valid object'

    const apiKey = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    try {
      mountApiKeyHeaders(apiKey)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an services can mount an header (With invalid JSON without id) - method: mountApiKeyHeaders', async () => {
    const expectedResult =
      'The "apiKeyCryptum" parameter must be of the "ApiKeyCryptum" type, or not is an valid object'

    const apiKey = {
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    try {
      mountApiKeyHeaders(apiKey)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })
})
