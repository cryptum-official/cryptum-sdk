const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../src/axios')
const { TransactionController } = require('../../../src/features/transaction/controller')
const { Protocol } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
let wallets = {}

describe.only('Stellar trustline transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.stellar.publicKey}/info`)
      .query({ protocol: Protocol.STELLAR })
      .reply(200, {
        sequence: '6259566941569025',
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })
  it('create trustline stellar', async () => {
    const transaction = await txController.createStellarTrustlineTransaction({
      wallet: wallets.stellar,
      assetSymbol: 'BRLT',
      issuer: 'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO',
      limit: '100000000',
      fee: '100',
      memo: 'create-trustline',
    })
    assert.include(
      transaction.signedTx,
      'AAAAAgAAAAAFqv2GZM3flypMrxlnhEDXqISoxW'
    )
  })

  it('delete trustline stellar', async () => {
    const transaction = await txController.createStellarTrustlineTransaction({
      wallet: wallets.stellar,
      assetSymbol: 'BRLT',
      issuer: 'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO',
      limit: '0',
      fee: '100',
      memo: 'delete-trustline',
    })
    assert.include(
      transaction.signedTx,
      'AAAAAgAAAAAFqv2GZM3flypMrxlnhEDXqISoxW'
    )
  })

  it('create trustline stellar error with invalid issuer', async () => {
    assert.isRejected(
      txController.createStellarTrustlineTransaction({
        wallet: wallets.stellar,
        assetSymbol: 'BRLT',
        issuer: 'xxxxx',
        limit: '100000000',
        fee: '100',
        memo: 'create-trustline',
      }),
      'Issuer is invalid'
    )
  })
})
