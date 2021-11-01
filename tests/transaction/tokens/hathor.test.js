const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../axios')
const TransactionController = require('../../../src/features/transaction/controller')
const { Protocol } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
let wallets = {}

describe.only('Hathor token transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/transaction/utxo/${wallets.hathor.address}`)
      .query({
        protocol: Protocol.HATHOR,
      })
      .reply(200, [
        {
          index: 1,
          value: 2119,
          txHash: '00000631ba4d8d00299c6e68c40c6420461a446668b7d1f5d0e584b0186fcc6f',
          token: '00',
        },
        {
          index: 2,
          value: 1,
          txHash: '000008118892e62479bdf57880d37cb33413f319cf76fe30bcb743b81f289234',
          token: '00000cf13382ba53216f74837f0f5bd0b9a05b870637f51bbaefe9f196a04b56',
        },
        {
          index: 0,
          value: 900,
          txHash: '00000eaf2b7b37a65a2b65d00801a25ef5d9685473ea0cb97ea2afee35b10a06',
          token: '00000cf13382ba53216f74837f0f5bd0b9a05b870637f51bbaefe9f196a04b56',
        },
        {
          index: 2,
          value: 2,
          txHash: '00000eaf2b7b37a65a2b65d00801a25ef5d9685473ea0cb97ea2afee35b10a06',
          token: '00000cf13382ba53216f74837f0f5bd0b9a05b870637f51bbaefe9f196a04b56',
        },
      ])
      .persist()
    nock(baseUrl)
      .get(`/transaction/00000631ba4d8d00299c6e68c40c6420461a446668b7d1f5d0e584b0186fcc6f`)
      .query({
        protocol: Protocol.HATHOR,
      })
      .reply(200, {
        tx: {
          outputs: [
            {},
            {
              value: 2119,
              token_data: 0,
            },
          ],
        },
      })
      .persist()
    nock(baseUrl)
      .get(`/transaction/00000eaf2b7b37a65a2b65d00801a25ef5d9685473ea0cb97ea2afee35b10a06`)
      .query({
        protocol: Protocol.HATHOR,
      })
      .reply(200, {
        tx: {
          outputs: [
            {
              value: 900,
              token_data: 1,
            },
            {},
            {
              value: 2,
              token_data: 129,
            },
          ],
        },
      })
      .persist()
    nock(baseUrl)
      .get(`/transaction/000008118892e62479bdf57880d37cb33413f319cf76fe30bcb743b81f289234`)
      .query({
        protocol: Protocol.HATHOR,
      })
      .reply(200, {
        tx: {
          outputs: [
            {},
            {},
            {
              value: 1,
              token_data: 129,
            },
          ],
        },
      })
      .persist()
    nock('https://txmining.testnet.hathor.network')
      .post(`/submit-job`)
      .reply(200, {
        job_id: 'e1a27d4a8bafc584db7928325068e36bee312b42296c49ecc95fc2d4d39a1626',
        status: 'pending',
        message: '',
        created_at: 1635802361.2975092,
        tx: {
          nonce: null,
          parents: [],
          timestamp: null,
          weight: 18.036023207579593,
        },
        timeout: 20,
        submitted_at: null,
        total_time: null,
        expected_queue_time: 0,
        expected_mining_time: 1.8506551288114255,
        expected_total_time: 1.8506551288114255,
      })
      .persist()
    nock('https://txmining.testnet.hathor.network')
      .get(`/job-status`)
      .query({
        'job-id': 'e1a27d4a8bafc584db7928325068e36bee312b42296c49ecc95fc2d4d39a1626',
      })
      .reply(200, {
        job_id: 'e1a27d4a8bafc584db7928325068e36bee312b42296c49ecc95fc2d4d39a1626',
        status: 'done',
        message: '',
        created_at: 1635802361.2975092,
        tx: {
          nonce: '00051500',
          parents: [
            '00000e7946698b88a52f9c4145ca7fe2b8c0f9c9cf251a5366a48256f889cf40',
            '00000631ba4d8d00299c6e68c40c6420461a446668b7d1f5d0e584b0186fcc6f',
          ],
          timestamp: 1635802359,
          weight: 18.036023207579593,
        },
        timeout: 20,
        submitted_at: 1635802361.2975092,
        total_time: 1.2058329582214355,
        expected_queue_time: 0,
        expected_mining_time: 1.8506551288114255,
        expected_total_time: 1.8506551288114255,
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create token', async () => {
    const transaction = await txController.createHathorTokenTransactionFromWallet({
      wallet: wallets.hathor,
      tokenName: 'MyToken',
      tokenSymbol: 'TOK',
      amount: '100',
      type: 'HATHOR_TOKEN_CREATION',
      mintAuthorityAddress: wallets.hathor.address,
      meltAuthorityAddress: wallets.hathor.address,
    })
    assert.include(transaction.signedTx, '0002010400000631')
  })
  it('mint tokens', async () => {
    const transaction = await txController.createHathorTokenTransactionFromWallet({
      wallet: wallets.hathor,
      type: 'HATHOR_TOKEN_MINT',
      amount: '70',
      address: wallets.hathor.address,
      changeAddress: wallets.hathor.address,
      mintAuthorityAddress: wallets.hathor.address,
      tokenUid: '00000cf13382ba53216f74837f0f5bd0b9a05b870637f51bbaefe9f196a04b56',
    })
    assert.include(transaction.signedTx, '000101020300000')
  })
  it('melt tokens', async () => {
    const transaction = await txController.createHathorTokenTransactionFromWallet({
      wallet: wallets.hathor,
      type: 'HATHOR_TOKEN_MELT',
      amount: '100',
      address: wallets.hathor.address,
      changeAddress: wallets.hathor.address,
      meltAuthorityAddress: wallets.hathor.address,
      tokenUid: '00000cf13382ba53216f74837f0f5bd0b9a05b870637f51bbaefe9f196a04b56',
    })
    assert.include(transaction.signedTx, '000101020200000')
  })
})
