const assert = require('assert')
const SignedTransactionCryptum = require('../../src/features/signed-transaction/entity')
const SignedTransactionCryptumUseCase = require('../../src/features/signed-transaction/use-cases')
const SignedTransactionCryptumInterface = require('../../src/features/signed-transaction/use-cases/interface')

describe.only('Test Suite of the SignedTransaction (Use Cases)', function () {
  it('Check if an Not Implemented Exception in interface (Interface test) : mountSignedTransaction', async () => {
    const expectedResult = 'Method not implemented'

    const data = {
      hash: 'sample-secret-hash-response',
      transaction: 'sample-secret-transaction',
      protocol: 'STELLAR',
    }

    try {
      const interface = new SignedTransactionCryptumInterface()
      interface.mountSignedTransaction(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an Not Implemented Exception in interface (Interface test) : mountTransactionToSend', async () => {
    const expectedResult = 'Method not implemented'

    const data = {
      hash: 'sample-secret-hash-response',
      transaction: 'sample-secret-transaction',
      protocol: 'STELLAR',
    }

    try {
      const interface = new SignedTransactionCryptumInterface()
      interface.mountTransactionToSend(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Signed Transaction Cryptum to create in Cryptum API (Valid Data) : mountTransactionToSend', async () => {
    const data = {
      transaction: 'sample-secret-transaction',
      protocol: 'STELLAR',
    }

    const expectedResult = new SignedTransactionCryptum(data)

    const result = SignedTransactionCryptumUseCase.mountTransactionToSend(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if can mount an Signed Transaction Cryptum to create in Cryptum API (Without protocol) : mountTransactionToSend', async () => {
    const expectedResult = 'Not can mount SignedTransactionCryptum entity'

    const data = {
      transaction: 'sample-secret-transaction',
    }

    try {
      SignedTransactionCryptumUseCase.mountTransactionToSend(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Signed Transaction Cryptum to create in Cryptum API (Without transaction) : mountTransactionToSend', async () => {
    const expectedResult = 'Not can mount SignedTransactionCryptum entity'

    const data = {
      protocol: 'STELLAR',
    }

    try {
      SignedTransactionCryptumUseCase.mountTransactionToSend(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (Valid SignedTransactionCryptum) : mountSignedTransaction', async () => {
    const data = {
      hash: 'sample-secret-hash-response',
      transaction: 'sample-secret-transaction',
      protocol: 'STELLAR',
    }

    const expectedResult = new SignedTransactionCryptum(data)
    const result = SignedTransactionCryptumUseCase.mountSignedTransaction(expectedResult)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (Valid JSON) : mountSignedTransaction', async () => {
    const data = {
      hash: 'sample-secret-hash-response',
      protocol: 'STELLAR',
    }

    const expectedResult = new SignedTransactionCryptum(data)
    const result = SignedTransactionCryptumUseCase.mountSignedTransaction(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (JSON without protocol) : mountSignedTransaction', async () => {
    const expectedResult = 'Not can mount SignedTransactionCryptum entity'
    
    const data = {
      transaction: 'sample-secret-transaction',
    }

    try {
      SignedTransactionCryptumUseCase.mountSignedTransaction(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })


  it('Check if can mount an Transaction Cryptum to create in Cryptum API (JSON without hash) : mountSignedTransaction', async () => {
    const expectedResult = 'Not can mount SignedTransactionCryptum entity'
    
    const data = {
      protocol: 'STELLAR',
    }

    try {
      SignedTransactionCryptumUseCase.mountSignedTransaction(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (With null) : mountSignedTransaction', async () => {
    const expectedResult = 'Not can mount SignedTransactionCryptum entity'

    try {
      SignedTransactionCryptumUseCase.mountSignedTransaction(null)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (With undefined) : mountSignedTransaction', async () => {
    const expectedResult = 'Not can mount SignedTransactionCryptum entity'

    try {
      SignedTransactionCryptumUseCase.mountSignedTransaction(undefined)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })
})
