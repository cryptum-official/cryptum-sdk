const assert = require('assert')
const ApiKeyUseCases = require('../../src/features/api-keys/use-cases')
const ApiKeyCryptum = require('../../src/features/api-keys/entity')

describe.only('Test Suite of the Api Key (Use Cases)', function () {
  it('Check UseCases to mount an Cryptum Api Key with valid data', async () => {
    const data = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    const expectedResult = new ApiKeyCryptum(data)
    const result = ApiKeyUseCases.mountApiKey(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check UseCases to mount an Cryptum Api Key with invalid data (null)', async () => {
    const expectedResult = 'Not can mount ApiKeyCryptum entity'
    try {
      ApiKeyUseCases.mountApiKey(null)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum Api Key with invalid data (undefined)', async () => {
    const expectedResult = 'Not can mount ApiKeyCryptum entity'
    try {
      ApiKeyUseCases.mountApiKey(undefined)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum Api Key invvalid with data (Without accessLevel param)', async () => {
    const data = {
      id: '20118495-d476-4aa9-bf29-d53fa9cb1878',
      name: 'WITHOUT ACCESSLEVEL HERE',
      key: 'AKFHdVHfSKrXhxtL0XHdY8uE4VjYgiMS2c5cPV5n1+E=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: null,
    }

    const expectedResult = 'Not can mount ApiKeyCryptum entity'
    try {
      ApiKeyUseCases.mountApiKey(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum Api Key invalid with data (Without key param)', async () => {
    const data = {
      id: '631e643e-8f12-4d13-bf30-e640adcfe22f',
      name: 'WITHOUT KEY HERE',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: null,
      accessLevel: 'write',
    }

    const expectedResult = 'Not can mount ApiKeyCryptum entity'
    try {
      ApiKeyUseCases.mountApiKey(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum Api Key invalid with data (Without id param)', async () => {
    const data = {
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    const expectedResult = 'Not can mount ApiKeyCryptum entity'
    try {
      ApiKeyUseCases.mountApiKey(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })
})
