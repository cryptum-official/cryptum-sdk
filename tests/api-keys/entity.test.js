const assert = require('assert')
const ApiKeyCryptum = require('../../src/features/api-keys/entity')

describe.only('Test Suite of the Api Key (Entity)', function () {
  it('Check if an valid ApiKeyCryptum is an ApiKeyCryptum', async () => {
    const data = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    const apiKey = new ApiKeyCryptum(data)

    const expectedResult = true
    const result = ApiKeyCryptum.isApiKey(apiKey)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON not is an ApiKeyCryptum', async () => {
    const data = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    const expectedResult = false
    const result = ApiKeyCryptum.isApiKey(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an ApiKeyCryptum (Without key)', async () => {
    const data = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      key: null,
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    const expectedResult = false
    const result = ApiKeyCryptum.isApiKey(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an ApiKeyCryptum (Without accessLevel)', async () => {
    const data = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: null,
    }

    const expectedResult = false
    const result = ApiKeyCryptum.isApiKey(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an ApiKeyCryptum (Without id)', async () => {
    const data = {
      id: null,
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    const expectedResult = false
    const result = ApiKeyCryptum.isApiKey(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid ApiKeyCryptum not is an ApiKeyCryptum (Without key)', async () => {
    const data = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    const apiKey = new ApiKeyCryptum(data)

    const expectedResult = false
    const result = ApiKeyCryptum.isApiKey(apiKey)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid ApiKeyCryptum not is an ApiKeyCryptum (Without id)', async () => {
    const data = {
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    const apiKey = new ApiKeyCryptum(data)

    const expectedResult = false
    const result = ApiKeyCryptum.isApiKey(apiKey)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid ApiKeyCryptum not is an ApiKeyCryptum (Without accessLevel)', async () => {
    const data = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
    }

    const apiKey = new ApiKeyCryptum(data)

    const expectedResult = false
    const result = ApiKeyCryptum.isApiKey(apiKey)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an null not is an ApiKeyCryptum', async () => {
    const expectedResult = false
    const result = ApiKeyCryptum.isApiKey(null)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an undefined not is an ApiKeyCryptum', async () => {
    const expectedResult = false
    const result = ApiKeyCryptum.isApiKey(undefined)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON can mount an ApiKeyCryptum', async () => {
    const data = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    const expectedResult = true
    const result = ApiKeyCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not can mount an ApiKeyCryptum (Without key)', async () => {
    const data = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    const expectedResult = false
    const result = ApiKeyCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not can mount an ApiKeyCryptum (Without id)', async () => {
    const data = {
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 'fullaccess',
    }

    const expectedResult = false
    const result = ApiKeyCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not can mount an ApiKeyCryptum (Without accessLevel)', async () => {
    const data = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
    }

    const expectedResult = false
    const result = ApiKeyCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not can mount an ApiKeyCryptum (accessLevel invalid)', async () => {
    const data = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      name: 'Sample Key With created at',
      key: 'QViCLRuuHlexTyBnwQTySrY2izWHBT5pj5fbAI4jzCg=',
      active: 1,
      ownerId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      createdAt: '2021-05-21T17:54:32.000Z',
      accessLevel: 1234,
    }

    const expectedResult = false
    const result = ApiKeyCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an null not can mount an ApiKeyCryptum', async () => {
    const expectedResult = false
    const result = ApiKeyCryptum.validateMandatoryValues(null)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an undefined not can mount an ApiKeyCryptum', async () => {
    const expectedResult = false
    const result = ApiKeyCryptum.validateMandatoryValues(undefined)
    assert.deepStrictEqual(result, expectedResult)
  })
})
