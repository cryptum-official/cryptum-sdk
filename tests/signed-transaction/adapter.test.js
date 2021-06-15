const assert = require('assert')
const nock = require('nock')

const SignedTransactionCryptum = require('../../src/features/signed-transaction/entity')
const SignedTransactionCryptumAdapter = require('../../src/features/signed-transaction/adapter')
const SignedTransactionCryptumInterface = require('../../src/features/signed-transaction/adapter/interface')

describe.only('Test Suite of the SignedTransaction (Adapter)', function () {
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

  it('Check if an Not Implemented Exception in interface (Interface test) : sendSignedTransaction', async () => {
    const expectedResult = 'Method not implemented'

    const data = {
      transaction: 'samplesignaturehere',
      protocol: 'STELLAR',
    }

    const config = {
      enviroment: 'development',
      apiKey: 'apikeyexamplecryptum',
    }

    try {
      const interface = new SignedTransactionCryptumInterface()
      interface.sendSignedTransaction(data, config)
    } catch (error) {
      assert.deepStrictEqual(error.message, expectedResult)
    }
  })

  it('Check create an transaction with SignedTransactionCryptum valid : sendSignedTransaction', async () => {
    const data = {
      transaction: 'samplesignaturehere',
      protocol: 'STELLAR',
    }

    const config = {
      enviroment: 'development',
      apiKey: 'apikeyexamplecryptum',
    }

    const signedTransaction = new SignedTransactionCryptum(data)
    const expectedResult = {
      hash: '9a2716851aeeaee4529c84dce1b2d00c6dbc5fb2e70ae9fe19bb24c5bf93ebd2',
    }

    const result = await SignedTransactionCryptumAdapter.sendSignedTransaction(
      signedTransaction,
      config
    )
    assert.deepStrictEqual(result.data, expectedResult)
  })
})
