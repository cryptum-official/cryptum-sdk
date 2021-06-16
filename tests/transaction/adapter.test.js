const assert = require('assert')
const nock = require('nock')

const TransactionCryptum = require('../../src/features/transaction/entity')
const TransactionCryptumAdapter = require('../../src/features/transaction/adapter')
const TransactionCryptumInterface = require('../../src/features/transaction/adapter/interface')

describe.only('Test Suite of the Transaction (Adapter)', function () {
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

    const config = {
      enviroment: 'development',
      apiKey: 'apikeyexamplecryptum',
    }

    try {
      const interface = new TransactionCryptumInterface()
      interface.sendTransaction(data, config)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check create an transaction with TransactionCryptum valid : sendTransaction', async () => {
    const data = {
      blob: 'samplesignaturehere',
      protocol: 'STELLAR',
    }

    const config = {
      enviroment: 'development',
      apiKey: 'apikeyexamplecryptum',
    }

    const transaction = new TransactionCryptum(data)
    const expectedResult = {
      hash: '9a2716851aeeaee4529c84dce1b2d00c6dbc5fb2e70ae9fe19bb24c5bf93ebd2',
    }

    const result = await TransactionCryptumAdapter.sendTransaction(
      transaction,
      config
    )
    assert.deepStrictEqual(result.data, expectedResult)
  })
})
