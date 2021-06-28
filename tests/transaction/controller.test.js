const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const nock = require('nock')

const { TransactionResponse, TransactionType } = require('../../src/features/transaction/entity')
const TransactionController = require('../../src/features/transaction/controller')

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

  it('Check sendTransaction', async () => {
    const data = {
      signedTx: 'samplesignaturehere',
      protocol: 'STELLAR',
      type: TransactionType.TRANSFER
    }
    const expectedResult = new TransactionResponse({
      hash: '9a2716851aeeaee4529c84dce1b2d00c6dbc5fb2e70ae9fe19bb24c5bf93ebd2',
    })
    const controller = new TransactionController({
      environment: 'development',
      apiKey: 'apikeyexamplecryptum',
    })
    const result = await controller.sendTransaction(data)
    assert.deepStrictEqual(result, expectedResult)
  })
  it('Check sendTransaction error transaction type', async () => {
    const data = {
      signedTx: 'samplesignaturehere',
      protocol: 'STELLAR',
    }
    const controller = new TransactionController({
      environment: 'development',
      apiKey: 'apikeyexamplecryptum',
    })
    assert.isRejected(controller.sendTransaction(data), 'Invalid transaction type')
  })
})
