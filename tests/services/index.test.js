const assert = require('assert')
const nock = require('nock')

const { NotCanMountException, NotImplementedException, InvalidTypeException } = require('../../errors')
const { getApiMethod, mountHeaders, handleRequestError, isValidProtocol } = require('../../src/services')

describe.only('Test Suite of the Services (All project)', function () {
  this.beforeAll(() => {
    nock('https://api-dev.cryptum.io').post('/samplePOST', { test: 'post' }).reply(200, { tested: 'post_method' })

    nock('https://api-dev.cryptum.io').put('/samplePUT', { test: 'put' }).reply(200, { tested: 'put_method' })

    nock('https://api-dev.cryptum.io').get('/sampleGET').reply(200, { tested: 'get_method' })

    nock('https://api-dev.cryptum.io').delete('/sampleDELETE').reply(200, { tested: 'delete_method' })
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
    const expectedResult = 'The "webhook" parameter must be of the "WebhookCryptum" type, or not is an valid object'

    try {
      handleRequestError(new InvalidTypeException('webhook', 'WebhookCryptum'))
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

  it('Check if an services can mount an header (With valid string) - method: mountHeaders', async () => {
    const expectedResult = {
      'x-api-key': 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
    }

    const result = mountHeaders('QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=')
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an ETHEREUM is an valid protocol : isValidProtocol', async () => {
    const expectedResult = true
    const result = isValidProtocol('ETHEREUM')
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an BITCOIN is an valid protocol : isValidProtocol', async () => {
    const expectedResult = true
    const result = isValidProtocol('BITCOIN')
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an STELLAR is an invalid protocol : isValidProtocol', async () => {
    const expectedResult = false
    const result = isValidProtocol('STELLAR')
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an null is an invalid protocol : isValidProtocol', async () => {
    const expectedResult = false
    const result = isValidProtocol(null)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an undefined is an invalid protocol : isValidProtocol', async () => {
    const expectedResult = false
    const result = isValidProtocol(undefined)
    assert.deepStrictEqual(result, expectedResult)
  })
})
