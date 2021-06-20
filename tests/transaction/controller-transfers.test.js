const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../axios')
const TransactionController = require('../../src/features/transaction/controller')
const { Protocol } = require('../../src/services/blockchain/constants')
const { getWallets, config } = require('../wallet/constants')

const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.enviroment)
let wallets = {}

describe.only('Test Suite of the Wallet (Controller)', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(
        `/wallet/${wallets.stellar.publicKey}/info?protocol=${Protocol.STELLAR}`
      )
      .reply(200, {
        sequence: '40072044871681',
      })
    nock(baseUrl)
      .get(`/wallet/${wallets.ripple.address}/info?protocol=${Protocol.RIPPLE}`)
      .reply(200, {
        account_data: { Sequence: 18377273 },
        ledger_current_index: 18448832,
      })
    nock(baseUrl)
      .get(`/wallet/${wallets.celo.address}/info?protocol=${Protocol.CELO}`)
      .reply(200, {
        nonce: '2',
      })
    nock(baseUrl)
      .get(
        `/fee?${new URLSearchParams({
          from: wallets.celo.address,
          destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
          amount: '0.1',
          type: 'transfer',
          assetSymbol: 'CELO',
          protocol: Protocol.CELO,
        }).toString()}`
      )
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 444,
      })
    nock(baseUrl)
      .get(
        `/wallet/${wallets.ethereum.address}/info?protocol=${Protocol.ETHEREUM}`
      )
      .reply(200, {
        nonce: '2',
      })
    nock(baseUrl)
      .get(
        `/fee?${new URLSearchParams({
          from: wallets.ethereum.address,
          destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
          amount: '0.1',
          type: 'transfer',
          assetSymbol: 'ETH',
          protocol: Protocol.ETHEREUM,
        }).toString()}`
      )
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 444,
      })
  })
  describe('transfer transactions', () => {
    it(' - create transfer stellar', async () => {
      const transaction = await new TransactionController(
        config
      ).createStellarTransferTransaction({
        wallet: wallets.stellar,
        assetSymbol: 'XLM',
        amount: '1',
        destination: 'GDLCRMXZ66NFDIALVOJCIEOYJTITVNUFVYWT7MK26NO2GJXIBHTVGUIO',
        memo: 'create-transfer',
      })
      assert.include(transaction, 'AAAAAgAAAAAFqv2GZM3flypMrxlnhEDXqISoxW')
    })
    it(' - create transfer ripple', async () => {
      const transaction = await new TransactionController(
        config
      ).createRippleTransferTransaction({
        wallet: wallets.ripple,
        assetSymbol: 'XRP',
        amount: '0.59',
        destination: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
        memo: 'create-transfer',
        testnet: true,
      })
      assert.strictEqual(
        transaction,
        '12000022800000002401186A39201B011981CA6140000000000900B0684000000000000064732102C9A41967E29CF6B363D099128CF1F2F72E98589F96CDE7B767C735B5269A951074463044022077BEE41D9FBC039BEF4627FF1D6B6723918890BF285F48D28321AAAC96B75FBB0220471B7E9A22647B6380B8662A71B5ED35702BF7690AD3A1F3CD6AE8A7899CC5A3811402F4263E604CC4EDF5E76E95436E536B6B87D6868314F667B0CA50CC7709A220B0561B85E53A48461FA8F9EA7D0F6372656174652D7472616E736665727E0A746578742F706C61696EE1F1'
      )
    })
    it(' - create transfer celo', async () => {
      const transaction = await new TransactionController(
        config
      ).createCeloTransferTransaction({
        wallet: wallets.celo,
        tokenSymbol: 'CELO',
        amount: '0.1',
        destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
        memo: 'create-transfer',
        testnet: true,
      })
      console.log(transaction)
      assert.include(transaction, '0x')
    })
    it(' - create transfer eth', async () => {
      const transaction = await new TransactionController(
        config
      ).createEthereumTransferTransaction({
        wallet: wallets.ethereum,
        tokenSymbol: 'ETH',
        amount: '0.1',
        destination: '0x3f2f3D45196D7B99D0a615e8f530165eCb93e772',
        testnet: true,
      })
      console.log(transaction)
      assert.include(transaction, '0x')
    })
  })
})
