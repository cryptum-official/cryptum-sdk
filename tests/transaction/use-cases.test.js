const assert = require('assert')
const TransactionCryptum = require('../../src/features/transaction/entity')
const SignedTransactionCryptumUseCase = require('../../src/features/transaction/use-cases')
const TransactionCryptumInterface = require('../../src/features/transaction/use-cases/interface')

describe.only('Test Suite of the SignedTransaction (Use Cases)', function () {
  it('Check if an Not Implemented Exception in interface (Interface test) : mountSignedTransaction', async () => {
    const expectedResult = 'Method not implemented'

    const data = {
      hash: 'sample-secret-hash-response',
      blob: 'sample-secret-transaction',
      protocol: 'STELLAR',
    }

    try {
      const interface = new TransactionCryptumInterface()
      interface.mountSignedTransaction(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an Not Implemented Exception in interface (Interface test) : mountTransactionToSend', async () => {
    const expectedResult = 'Method not implemented'

    const data = {
      hash: 'sample-secret-hash-response',
      blob: 'sample-secret-transaction',
      protocol: 'STELLAR',
    }

    try {
      const interface = new TransactionCryptumInterface()
      interface.mountTransactionToSend(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Signed Transaction Cryptum to create in Cryptum API (Valid Data) : mountTransactionToSend', async () => {
    const data = {
      blob: 'sample-secret-transaction',
      protocol: 'STELLAR',
    }

    const expectedResult = new TransactionCryptum(data)

    const result = SignedTransactionCryptumUseCase.mountTransactionToSend(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if can mount an Signed Transaction Cryptum to create in Cryptum API (Without protocol) : mountTransactionToSend', async () => {
    const expectedResult = 'Not can mount TransactionCryptum entity'

    const data = {
      blob: 'sample-secret-transaction',
    }

    try {
      SignedTransactionCryptumUseCase.mountTransactionToSend(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Signed Transaction Cryptum to create in Cryptum API (Without transaction) : mountTransactionToSend', async () => {
    const expectedResult = 'Not can mount TransactionCryptum entity'

    const data = {
      protocol: 'STELLAR',
    }

    try {
      SignedTransactionCryptumUseCase.mountTransactionToSend(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (Valid TransactionCryptum) : mountSignedTransaction', async () => {
    const data = {
      hash: 'sample-secret-hash-response',
      blob: 'sample-secret-transaction',
      protocol: 'STELLAR',
    }

    const expectedResult = new TransactionCryptum(data)
    const result = SignedTransactionCryptumUseCase.mountSignedTransaction(expectedResult)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (Valid JSON) : mountSignedTransaction', async () => {
    const data = {
      hash: 'sample-secret-hash-response',
      protocol: 'STELLAR',
    }

    const expectedResult = new TransactionCryptum(data)
    const result = SignedTransactionCryptumUseCase.mountSignedTransaction(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (JSON without protocol) : mountSignedTransaction', async () => {
    const expectedResult = 'Not can mount TransactionCryptum entity'
    
    const data = {
      blob: 'sample-secret-blob',
    }

    try {
      SignedTransactionCryptumUseCase.mountSignedTransaction(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })


  it('Check if can mount an Transaction Cryptum to create in Cryptum API (JSON without hash) : mountSignedTransaction', async () => {
    const expectedResult = 'Not can mount TransactionCryptum entity'
    
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
    const expectedResult = 'Not can mount TransactionCryptum entity'

    try {
      SignedTransactionCryptumUseCase.mountSignedTransaction(null)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (With undefined) : mountSignedTransaction', async () => {
    const expectedResult = 'Not can mount TransactionCryptum entity'

    try {
      SignedTransactionCryptumUseCase.mountSignedTransaction(undefined)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })
})
