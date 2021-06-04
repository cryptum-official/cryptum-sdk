const assert = require('assert')
const ApiKeyUseCases = require('../../src/features/api-keys/use-cases')
const ApiKeyCryptum = require('../../src/features/api-keys/entity')

describe.only('Test Suite of the Api Key (Use Cases)', function () {
  it('Check UseCases to mount an Cryptum Api Keys with valid data', async () => {
    const validData = [
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
    ]

    const expectedResult = [
      new ApiKeyCryptum(validData[0]),
      new ApiKeyCryptum(validData[1]),
      new ApiKeyCryptum(validData[2]),
    ]
    const result = ApiKeyUseCases.mountApiKeys(validData)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check UseCases to mount an Cryptum Api Keys with invalid data (null)', async () => {
    const expectedResult = 'Not can mount ApiKeyCryptum entity'
    try {
      ApiKeyUseCases.mountApiKeys(null)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum Api Keys with invalid data (undefined)', async () => {
    const expectedResult = 'Not can mount ApiKeyCryptum entity'
    try {
      ApiKeyUseCases.mountApiKeys(undefined)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum Api Keys invvalid with data (Without accessLevel param)', async () => {
    const invalidData = [
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
        name: 'WITHOUT ACCESSLEVEL HERE',
        key: 'AKFHdVHfSKrXhxtL0XHdY8uE4VjYgiMS2c5cPV5n1+E=',
        active: 1,
        ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
        createdAt: null,
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
    ]

    const expectedResult = 'Not can mount ApiKeyCryptum entity'
    try {
      ApiKeyUseCases.mountApiKeys(invalidData)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum Api Keys invalid with data (Without key param)', async () => {
    const invalidData = [
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
        name: 'Sample key',
        key: 'AKFHdVHfSKrXhxtL0XHdY8uE4VjYgiMS2c5cPV5n1+E=',
        active: 1,
        ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
        createdAt: null,
        accessLevel: 'write',
      },
      {
        id: '631e643e-8f12-4d13-bf30-e640adcfe22f',
        name: 'WITHOUT KEY HERE',
        active: 1,
        ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
        createdAt: null,
        accessLevel: 'write',
      },
    ]

    const expectedResult = 'Not can mount ApiKeyCryptum entity'
    try {
      ApiKeyUseCases.mountApiKeys(invalidData)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum Api Keys invalid with data (Without id param)', async () => {
    const invalidData = [
      {
        name: 'Sample Key With created at',
        key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
        active: 1,
        ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
        createdAt: '2021-05-21T17:54:32.000Z',
        accessLevel: 'fullaccess',
      },
      {
        id: '20118495-d476-4aa9-bf29-d53fa9cb1878',
        name: 'Sample key',
        key: 'AKFHdVHfSKrXhxtL0XHdY8uE4VjYgiMS2c5cPV5n1+E=',
        active: 1,
        ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
        createdAt: null,
        accessLevel: 'write',
      },
      {
        id: '631e643e-8f12-4d13-bf30-e640adcfe22f',
        name: 'Sample key write',
        active: 1,
        key: '/5YKmKt17Iz1aotVK4iWuUKEJ9s0KnKcH/tfakSj0lQ=',
        ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
        createdAt: null,
        accessLevel: 'write',
      },
    ]

    const expectedResult = 'Not can mount ApiKeyCryptum entity'
    try {
      ApiKeyUseCases.mountApiKeys(invalidData)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum Api Keys with empty array', async () => {
    const validData = []

    const expectedResult = validData
    try {
      ApiKeyUseCases.mountApiKeys(validData)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })
})
