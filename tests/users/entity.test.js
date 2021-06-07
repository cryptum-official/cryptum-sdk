const assert = require('assert')
const UserCryptum = require('../../src/features/user/entity')

describe.only('Test Suite of the User (Entity)', function () {
  it('Check if an valid UserCryptum is an UserCryptum', async () => {
    const data = {
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

    const user = new UserCryptum(data)

    const expectedResult = true
    const result = UserCryptum.isUserCryptum(user)
    assert.deepStrictEqual(result, expectedResult)
  })
  
  it('Check if an valid JSON not is an UserCryptum', async () => {
    const data = {
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

    const expectedResult = false
    const result = UserCryptum.isUserCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an UserCryptum (Without token)', async () => {
    const data = {
      token: null,
      name: 'Example User',
      phone: null,
      email: 'example@blockforce.in',
      userId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      id: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      language: null,
      institution: null,
    }

    const expectedResult = false
    const result = UserCryptum.isUserCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an UserCryptum (Without id)', async () => {
    const data = {
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

    const expectedResult = false
    const result = UserCryptum.isUserCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid UserCryptum not is an UserCryptum (Without token)', async () => {
    const data = {
      token: null,
      name: 'Example User',
      phone: null,
      email: 'example@blockforce.in',
      userId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      id: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      language: null,
      institution: null,
    }

    const user = new UserCryptum(data)

    const expectedResult = false
    const result = UserCryptum.isUserCryptum(user)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid UserCryptum not is an UserCryptum (Without id)', async () => {
    const data = {
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

    const user = new UserCryptum(data)

    const expectedResult = false
    const result = UserCryptum.isUserCryptum(user)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an null not is an UserCryptum', async () => {
    const expectedResult = false
    const result = UserCryptum.isUserCryptum(null)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an undefined not is an UserCryptum', async () => {
    const expectedResult = false
    const result = UserCryptum.isUserCryptum(undefined)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON can mount an UserCryptum', async () => {
    const data = {
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

    const expectedResult = true
    const result = UserCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not can mount an UserCryptum (Without token)', async () => {
    const data = {
      token: null,
      name: 'Example User',
      phone: null,
      email: 'example@blockforce.in',
      userId: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      id: '58b14a30-a675-4d61-8afb-e3c6d37743ff',
      language: null,
      institution: null,
    }

    const expectedResult = false
    const result = UserCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not can mount an UserCryptum (Without id)', async () => {
    const data = {
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

    const expectedResult = false
    const result = UserCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an null not can mount an UserCryptum', async () => {
    const expectedResult = false
    const result = UserCryptum.validateMandatoryValues(null)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an undefined not can mount an UserCryptum', async () => {
    const expectedResult = false
    const result = UserCryptum.validateMandatoryValues(undefined)
    assert.deepStrictEqual(result, expectedResult)
  })
})
