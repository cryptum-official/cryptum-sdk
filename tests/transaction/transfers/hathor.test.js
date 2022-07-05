const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../src/axios')
const TransactionController = require('../../../src/features/transaction/controller')
const { Protocol } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
let wallets = {}

describe.only('Hathor transfer transactions', () => {
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

  it('create transfer hathor with wallet (1-n transfer)', async () => {
    const transaction = await txController.createHathorTransferTransactionFromWallet({
      wallet: wallets.hathor,
      outputs: [
        { address: 'WXK74dFXd6Ctj6EUBH3ctpWwoVR2TnHCjV', amount: '0.01', token: 'HTR' },
        { address: wallets.hathor.address, amount: '0.01022223', token: 'HTR' },
      ],
    })
    assert.include(transaction.signedTx, '000100010300000')

    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer hathor from UTXOs (n-m transfer)', async () => {
    const transaction = await txController.createHathorTransferTransactionFromUTXO({
      inputs: [
        {
          index: 1,
          value: 2119,
          txHash: '00000631ba4d8d00299c6e68c40c6420461a446668b7d1f5d0e584b0186fcc6f',
          token: '00',
        },
      ],
      outputs: [
        { address: 'WXK74dFXd6Ctj6EUBH3ctpWwoVR2TnHCjV', amount: '0.08', token: 'HTR' },
        { address: 'WXpJQ1Y815pGQVC1MgD7DwJepokVnSmGD3', amount: '0.02', token: 'HTR' },
        { address: wallets.hathor.address, amount: '21.09', token: 'HTR' },
      ],
    })
    assert.include(transaction.signedTx, '000100010300000')

    // console.log(await txController.sendTransaction(transaction))
  })
  it('create transfer hathor with error when wallet and inputs are provided', async () => {
    assert.isRejected(
      txController.createHathorTransferTransactionFromWallet({
        wallet: wallets.hathor,
        inputs: [
          {
            txHash: '03fceba0863bbf2070fa2f03b20ece7ded5bf0992da2cd99948d950ff7971f94',
            index: 0,
            privateKey: wallets.hathor.privateKey,
          },
        ],
        outputs: [
          { address: 'WXK74dFXd6Ctj6EUBH3ctpWwoVR2TnHCjV', amount: '0.01' },
          { address: wallets.hathor.address, amount: '0.01' },
        ],
      }),
      'Parameters wallet and fromUTXOs can not be sent at the same time'
    )
  })
})
