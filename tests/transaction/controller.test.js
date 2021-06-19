const assert = require('assert')
const nock = require('nock')

const { TransactionCryptum, TransactionResponse } = require('../../src/features/transaction/entity')
const TransactionController = require('../../src/features/transaction/controller')
const TransactionCryptumInterface = require('../../src/features/transaction/controller/interface')

describe.only('Test Suite of the Transaction (Controller)', function () {
  this.beforeAll(() => {
    const transactionResponse = {
      hash: '9a2716851aeeaee4529c84dce1b2d00c6dbc5fb2e70ae9fe19bb24c5bf93ebd2',
    }

    const params = new URLSearchParams({ protocol: 'STELLAR' })
    nock('https://api-dev.cryptum.io', {
      reqheaders: { 'x-api-key': 'apikeyexamplecryptum' },
    })
      .post('/transaction')
      .query(params)
      .reply(200, transactionResponse)
  })

  it('Check if an Not Implemented Exception in interface (Interface test) : sendTransaction', async () => {
    const expectedResult = 'Method not implemented'

    const data = {
      blob: 'samplesignaturehere',
      protocol: 'STELLAR',
    }

    try {
      const interface = new TransactionCryptumInterface()
      interface.sendTransaction(data)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check create an transaction with TransactionCryptum valid : sendTransaction', async () => {
    const data = {
      blob: 'samplesignaturehere',
      protocol: 'STELLAR',
    }

    const expectedResult = new TransactionResponse({
      hash: '9a2716851aeeaee4529c84dce1b2d00c6dbc5fb2e70ae9fe19bb24c5bf93ebd2',
    })

    const controller = new TransactionController({
      enviroment: 'development',
      apiKey: 'apikeyexamplecryptum',
    })
    const result = await controller.sendTransaction(data)
    assert.deepStrictEqual(result, expectedResult)
  })
})
