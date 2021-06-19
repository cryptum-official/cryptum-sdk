const assert = require('assert')
const { TransactionCryptum } = require('../../src/features/transaction/entity')

describe.only('Test Suite of the Transaction (Entity)', function () {
  it('Check if an valid TransactionCryptum is an TransactionCryptum (Without transaction): isTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const transaction = new TransactionCryptum(data)

    const expectedResult = true
    const result = TransactionCryptum.isTransactionCryptum(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid TransactionCryptum is an TransactionCryptum (With FULL DATA) : isTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const transaction = new TransactionCryptum(data)

    const expectedResult = true
    const result = TransactionCryptum.isTransactionCryptum(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid TransactionCryptum is not an TransactionCryptum (Without hash) : isTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      blob: 'samplesignaturehere',
    }

    const transaction = new TransactionCryptum(data)

    const expectedResult = false
    const result = TransactionCryptum.isTransactionCryptum(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid TransactionCryptum is not an TransactionCryptum (Without protocol) : isTransactionCryptum', async () => {
    const data = {
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const transaction = new TransactionCryptum(data)

    const expectedResult = false
    const result = TransactionCryptum.isTransactionCryptum(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON not is an TransactionCryptum (Without transaction): isTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const expectedResult = false
    const result = TransactionCryptum.isTransactionCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON not is an TransactionCryptum (With full data) : isTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const expectedResult = false
    const result = TransactionCryptum.isTransactionCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an TransactionCryptum (Without protocol) : isTransactionCryptum', async () => {
    const data = {
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const expectedResult = false
    const result = TransactionCryptum.isTransactionCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON not is an TransactionCryptum (Without hash) : isTransactionCryptum', async () => {
    const data = {
      protocol: 'BITCOIN',
      blob: 'samplesignaturehere',
    }

    const expectedResult = false
    const result = TransactionCryptum.isTransactionCryptum(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid TransactionCryptum contains mandatory values to an valid TransactionCryptum : validateMandatoryValues', async () => {
    const data = {
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const transaction = new TransactionCryptum(data)

    const expectedResult = false
    const result = TransactionCryptum.validateMandatoryValues(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid TransactionCryptum contains mandatory values to an valid TransactionCryptum : validateMandatoryValues', async () => {
    const data = {
      protocol: 'BITCOIN',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const transaction = new TransactionCryptum(data)

    const expectedResult = true
    const result = TransactionCryptum.validateMandatoryValues(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an valid JSON contains mandatory values to an valid TransactionCryptum : validateMandatoryValues', async () => {
    const data = {
      protocol: 'BITCOIN',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const expectedResult = true
    const result = TransactionCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON contains mandatory values to an valid TransactionCryptum (Without hash) : validateMandatoryValues', async () => {
    const data = {
      blob: 'samplesignaturehere',
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = TransactionCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an invalid JSON contains mandatory values to an valid TransactionCryptum (Without protocol) : validateMandatoryValues', async () => {
    const data = {
      blob: 'samplesignaturehere',
      hash: 'SOAowjdsajoiw321ojodsa',
    }

    const expectedResult = false
    const result = TransactionCryptum.validateMandatoryValues(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an null contains mandatory values to an valid TransactionCryptum (With null) : validateMandatoryValues', async () => {
    const expectedResult = false
    const result = TransactionCryptum.validateMandatoryValues(null)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if an undefined contains mandatory values to an valid TransactionCryptum (With undefined) : validateMandatoryValues', async () => {
    const expectedResult = false
    const result = TransactionCryptum.validateMandatoryValues(undefined)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with TransactionCryptum can create an TransactionCryptum in API (With valid data) : canSend', async () => {
    const data = {
      blob: 'samplesignaturehere',
      protocol: 'BITCOIN',
    }

    const transaction = new TransactionCryptum(data)

    const expectedResult = true
    const result = TransactionCryptum.canSend(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an TransactionCryptum (With valid data) : canSend', async () => {
    const data = {
      blob: 'samplesignaturehere',
      protocol: 'BITCOIN',
    }

    const expectedResult = true
    const result = TransactionCryptum.canSend(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an TransactionCryptum (Without transaction) : canSend', async () => {
    const data = {
      protocol: 'BITCOIN',
    }

    const expectedResult = false
    const result = TransactionCryptum.canSend(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with JSON can create an TransactionCryptum (Without protocol) : canSend', async () => {
    const data = {
      blob: 'samplesignaturehere',
    }

    const expectedResult = false
    const result = TransactionCryptum.canSend(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with TransactionCryptum can create an TransactionCryptum (Without transaction) : canSend', async () => {
    const data = {
      protocol: 'BITCOIN',
    }

    const transaction = new TransactionCryptum(data)

    const expectedResult = false
    const result = TransactionCryptum.canSend(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if with TransactionCryptum can create an TransactionCryptum (Without protocol) : canSend', async () => {
    const data = {
      blob: 'samplesignaturehere',
    }

    const transaction = new TransactionCryptum(data)

    const expectedResult = false
    const result = TransactionCryptum.canSend(transaction)
    assert.deepStrictEqual(result, expectedResult)
  })
})
