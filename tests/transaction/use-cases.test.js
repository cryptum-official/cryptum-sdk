const assert = require('assert')
const TransactionCryptum = require('../../src/features/transaction/entity')
const TransactionCryptumUseCase = require('../../src/features/transaction/use-cases')
const TransactionCryptumInterface = require('../../src/features/transaction/use-cases/interface')

describe.only('Test Suite of the Transaction (Use Cases)', function () {
  it('Check if an Not Implemented Exception in interface (Interface test) : mountTransaction', async () => {
    const expectedResult = 'Method not implemented'

    const data = {
      hash: 'sample-secret-hash-response',
      signature: 'sample-secret-signature',
      protocol: 'STELLAR',
    }

    try {
      const interface = new TransactionCryptumInterface()
      interface.mountTransaction(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if an Not Implemented Exception in interface (Interface test) : mountTransactionToSign', async () => {
    const expectedResult = 'Method not implemented'

    const data = {
      hash: 'sample-secret-hash-response',
      signature: 'sample-secret-signature',
      protocol: 'STELLAR',
    }

    try {
      const interface = new TransactionCryptumInterface()
      interface.mountTransactionToSign(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Signed Transaction Cryptum to create in Cryptum API (Valid Data) : mountTransactionToSign', async () => {
    const data = {
      signature: 'sample-secret-signature',
      protocol: 'STELLAR',
    }

    const expectedResult = new TransactionCryptum(data)

    const result = TransactionCryptumUseCase.mountTransactionToSign(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if can mount an Signed Transaction Cryptum to create in Cryptum API (Without protocol) : mountTransactionToSign', async () => {
    const expectedResult = 'Not can mount TransactionCryptum entity'

    const data = {
      signature: 'sample-secret-signature',
    }

    try {
      TransactionCryptumUseCase.mountTransactionToSign(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Signed Transaction Cryptum to create in Cryptum API (Without signature) : mountTransactionToSign', async () => {
    const expectedResult = 'Not can mount TransactionCryptum entity'

    const data = {
      protocol: 'STELLAR',
    }

    try {
      TransactionCryptumUseCase.mountTransactionToSign(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (Valid TransactionCryptum) : mountTransaction', async () => {
    const data = {
      hash: 'sample-secret-hash-response',
      signature: 'sample-secret-signature',
      protocol: 'STELLAR',
    }

    const expectedResult = new TransactionCryptum(data)
    const result = TransactionCryptumUseCase.mountTransaction(expectedResult)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (Valid JSON) : mountTransaction', async () => {
    const data = {
      hash: 'sample-secret-hash-response',
      protocol: 'STELLAR',
    }

    const expectedResult = new TransactionCryptum(data)
    const result = TransactionCryptumUseCase.mountTransaction(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (JSON without protocol) : mountTransaction', async () => {
    const expectedResult = 'Not can mount TransactionCryptum entity'
    
    const data = {
      signature: 'sample-secret-signature',
    }

    try {
      TransactionCryptumUseCase.mountTransaction(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })


  it('Check if can mount an Transaction Cryptum to create in Cryptum API (JSON without hash) : mountTransaction', async () => {
    const expectedResult = 'Not can mount TransactionCryptum entity'
    
    const data = {
      protocol: 'STELLAR',
    }

    try {
      TransactionCryptumUseCase.mountTransaction(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (With null) : mountTransaction', async () => {
    const expectedResult = 'Not can mount TransactionCryptum entity'

    try {
      TransactionCryptumUseCase.mountTransaction(null)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check if can mount an Transaction Cryptum to create in Cryptum API (With undefined) : mountTransaction', async () => {
    const expectedResult = 'Not can mount TransactionCryptum entity'

    try {
      TransactionCryptumUseCase.mountTransaction(undefined)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })
})
