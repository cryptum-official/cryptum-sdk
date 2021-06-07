const assert = require('assert')
const UserUseCases = require('../../src/features/users/use-cases')
const UserCryptum = require('../../src/features/users/entity')

describe.only('Test Suite of the User (Use Cases)', function () {
  it('Check UseCases to mount an Cryptum user with valid data', async () => {
    const validData = {
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

    const expectedResult = new UserCryptum(validData)
    const result = UserUseCases.mount(validData)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check UseCases to mount an Cryptum user with invalid data (null)', async () => {
    const expectedResult = 'Not can mount UserCryptum entity'
    try {
      UserUseCases.mount(null)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum user with invalid data (undefined)', async () => {
    const expectedResult = 'Not can mount UserCryptum entity'
    try {
      UserUseCases.mount(undefined)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum user with invalid data (Without token param)', async () => {
    const invalidData = {
      token: null,
      name: 'Example User',
      phone: null,
      email: 'example@blockforce.in',
      userId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      id: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      language: null,
      institution: null,
    }

    const expectedResult = 'Not can mount UserCryptum entity'
    try {
      UserUseCases.mount(invalidData)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check UseCases to mount an Cryptum user with invalid data (Without id param)', async () => {
    const invalidData = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OGIxNGEzMC1hNjc1LTRkNjEtOGFmYi1lM2M2ZDM3NzQzZmYiLCJjcmVhdGVUaW1lIjoiMjAyMS0wNi0wNFQxNDoxMzoyNC4zMzlaIiwiaWF0IjoxNjIyODE2MDA0fQ.oSS_6pd6CxNE_9tYL-hsLt1n9ui5vGfZhjhGDC02ma0',
      name: 'Example User',
      phone: null,
      email: 'example@blockforce.in',
      userId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      id: null,
      language: null,
      institution: null,
    }

    const expectedResult = 'Not can mount UserCryptum entity'
    try {
      UserUseCases.mount(invalidData)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })
})
