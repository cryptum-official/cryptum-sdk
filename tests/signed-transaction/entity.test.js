const assert = require('assert')
const SignedTransactionCryptum = require('../../src/features/transaction/entity')

describe.only('Test Suite of the SignedTransaction (Entity)', function () {
  it('Check if an valid SignedTransactionCryptum is an SignedTransactionCryptum (Without transaction): isSignedTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const transaction = new SignedTransactionCryptum(data)

    const expectedResult = true
    const result = SignedTransactionCryptum.isSignedTransactionCryptum(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid SignedTransactionCryptum is an SignedTransactionCryptum (With FULL DATA) : isSignedTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const transaction = new SignedTransactionCryptum(data)

    const expectedResult = true
    const result = SignedTransactionCryptum.isSignedTransactionCryptum(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid SignedTransactionCryptum is not an SignedTransactionCryptum (Without hash) : isSignedTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      blob: 'samplesignaturehere',
    }

    const transaction = new SignedTransactionCryptum(data)

    const expectedResult = false
    const result = SignedTransactionCryptum.isSignedTransactionCryptum(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid SignedTransactionCryptum is not an SignedTransactionCryptum (Without protocol) : isSignedTransactionCryptum', async () => {
    const data = {
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const transaction = new SignedTransactionCryptum(data)

    const expectedResult = false
    const result = SignedTransactionCryptum.isSignedTransactionCryptum(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON not is an SignedTransactionCryptum (Without transaction): isSignedTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const expectedResult = false
    const result = SignedTransactionCryptum.isSignedTransactionCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON not is an SignedTransactionCryptum (With full data) : isSignedTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const expectedResult = false
    const result = SignedTransactionCryptum.isSignedTransactionCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an SignedTransactionCryptum (Without protocol) : isSignedTransactionCryptum', async () => {
    const data = {
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const expectedResult = false
    const result = SignedTransactionCryptum.isSignedTransactionCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an SignedTransactionCryptum (Without hash) : isSignedTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      blob: 'samplesignaturehere',
    }

    const expectedResult = false
    const result = SignedTransactionCryptum.isSignedTransactionCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid SignedTransactionCryptum contains mandatory values to an valid SignedTransactionCryptum : validateMandatoryValues', async () => {
    const data = {
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const transaction = new SignedTransactionCryptum(data)

    const expectedResult = false
    const result = SignedTransactionCryptum.validateMandatoryValues(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid SignedTransactionCryptum contains mandatory values to an valid SignedTransactionCryptum : validateMandatoryValues', async () => {
    const data = {
      protocol: 'BITCOIN',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const transaction = new SignedTransactionCryptum(data)

    const expectedResult = true
    const result = SignedTransactionCryptum.validateMandatoryValues(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON contains mandatory values to an valid SignedTransactionCryptum : validateMandatoryValues', async () => {
    const data = {
      protocol: 'BITCOIN',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const expectedResult = true
    const result = SignedTransactionCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON contains mandatory values to an valid SignedTransactionCryptum (Without hash) : validateMandatoryValues', async () => {
    const data = {
      blob: 'samplesignaturehere',
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = SignedTransactionCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON contains mandatory values to an valid SignedTransactionCryptum (Without protocol) : validateMandatoryValues', async () => {
    const data = {
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const expectedResult = false
    const result = SignedTransactionCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an null contains mandatory values to an valid SignedTransactionCryptum (With null) : validateMandatoryValues', async () => {
    const expectedResult = false
    const result = SignedTransactionCryptum.validateMandatoryValues(null)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an undefined contains mandatory values to an valid SignedTransactionCryptum (With undefined) : validateMandatoryValues', async () => {
    const expectedResult = false
    const result = SignedTransactionCryptum.validateMandatoryValues(undefined)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with SignedTransactionCryptum can create an SignedTransactionCryptum in API (With valid data) : canSend', async () => {
    const data = {
      blob: 'samplesignaturehere',
      protocol: 'BITCOIN',
    }

    const transaction = new SignedTransactionCryptum(data)

    const expectedResult = true
    const result = SignedTransactionCryptum.canSend(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an SignedTransactionCryptum (With valid data) : canSend', async () => {
    const data = {
      blob: 'samplesignaturehere',
      protocol: 'BITCOIN',
    }

    const expectedResult = true
    const result = SignedTransactionCryptum.canSend(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an SignedTransactionCryptum (Without transaction) : canSend', async () => {
    const data = {
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = SignedTransactionCryptum.canSend(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an SignedTransactionCryptum (Without protocol) : canSend', async () => {
    const data = {
      blob: 'samplesignaturehere',
    }

    const expectedResult = false
    const result = SignedTransactionCryptum.canSend(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with SignedTransactionCryptum can create an SignedTransactionCryptum (Without transaction) : canSend', async () => {
    const data = {
      protocol: 'BITCOIN',
    }

    const transaction = new SignedTransactionCryptum(data)

    const expectedResult = false
    const result = SignedTransactionCryptum.canSend(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with SignedTransactionCryptum can create an SignedTransactionCryptum (Without protocol) : canSend', async () => {
    const data = {
      blob: 'samplesignaturehere',
    }

    const transaction = new SignedTransactionCryptum(data)

    const expectedResult = false
    const result = SignedTransactionCryptum.canSend(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })
})
