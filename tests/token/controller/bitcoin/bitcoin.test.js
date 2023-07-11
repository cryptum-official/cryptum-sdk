
describe('Bitcoin transfer transactions', () => {
  const nock = require('nock')
  const chai = require('chai')
  chai.use(require('chai-as-promised'))
  const assert = chai.assert
  const { getTokenControllerInstance } = require('../../../../src/features/token/controller')
  const { Protocol } = require('../../../../src/services/blockchain/constants')
  const { getWallets, config } = require('../../../wallet/constants')
  const { loadNockMocks } = require('./mocks')

  const tokenController = getTokenControllerInstance(config)
  const protocol = Protocol.BITCOIN
  let wallets = {}

  before(async () => {
    wallets = await getWallets()
    loadNockMocks(nock, wallets)
  })
  after(() => {
    nock.isDone()
  })

  it('should transfer bitcoins to 1 destination', async () => {
    const tx = await tokenController.transfer({
      protocol,
      wallet: wallets.bitcoin,
      amount: '0.01',
      destination: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo'
    })
    assert.equal(tx.hash, '9499cda22d99f05bed7dce0ebe032ffa7020bf3b86a0ebfc03000000006b')
  })
  it('should transfer bitcoins to n destinations', async () => {
    const tx = await tokenController.transfer({
      protocol,
      wallet: wallets.bitcoin,
      destinations: [
        { address: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo', amount: '0.01' }
      ]
    })
    assert.equal(tx.hash, '9499cda22d99f05bed7dce0ebe032ffa7020bf3b86a0ebfc03000000006b')
  })
  it('should transfer bitcoins with OP_RETURN data', async () => {
    const tx = await tokenController.transfer({
      protocol,
      wallet: wallets.bitcoin,
      destination: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo',
      amount: '0.01',
      data: 'Hello :)'
    })
    assert.equal(tx.hash, '9499cda22d99f05bed7dce0ebe032ffa7020bf3b86a0ebfc03000000006b')
  })
  it('should throw error if data type is not string', async () => {
    await assert.isRejected(
      tokenController.transfer({
        protocol,
        wallet: wallets.bitcoin,
        destination: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo',
        amount: '0.01',
        data: 18
      }),
      'The "data" parameter must be of the "string" type'
    )
  })
  it('should throw error if data length is greater than 80 characters long', async () => {
    await assert.isRejected(
      tokenController.transfer({
        protocol,
        wallet: wallets.bitcoin,
        destination: 'mnPLHLXaj9rs6hr1WmPJJSvFwtvVyp4BGo',
        amount: '0.01',
        data: 'Hello :) -------------------------------------------------------------------------'
      }),
      'The data parameter has to be at most 80 characters long'
    )
  })
})
