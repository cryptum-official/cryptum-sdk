const AxiosApi = require('../../../../src/axios')
const { TransactionType } = require('../../../../src/features/transaction/entity')
const { Protocol } = require('../../../../src/services/blockchain/constants')
const { config } = require('../../../wallet/constants')
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)

exports.loadNockMocks = (nock, wallets) => {
  nock(baseUrl)
    .get(`/token/000024f0ad325bd5ae8bd8710d2341d1df5ed9b97e2afaf559534ae77d160edd/info`)
    .query({
      protocol: Protocol.HATHOR,
    })
    .reply(200, {
      name: 'Token',
      symbol: 'TOK',
      tokenUid: '000024f0ad325bd5ae8bd8710d2341d1df5ed9b97e2afaf559534ae77d160edd',
      totalSupply: '1'
    })
    .persist()
  nock(baseUrl)
    .get(`/token/003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03/balance/WbrQizEXgaXu9y6VCb5fpSzhyf28U4UZFK`)
    .query({
      protocol: Protocol.HATHOR,
    })
    .reply(200, {
      tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
      owner: 'WbrQizEXgaXu9y6VCb5fpSzhyf28U4UZFK',
      balance: '3'
    })
    .persist()
  nock(baseUrl)
    .get(`/token/003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03/metadata`)
    .query({
      protocol: Protocol.HATHOR,
    })
    .reply(200, {
      tokenUid: '003b7e66586d774b35ac52cd161cad9c392fb468dfdfe3aade1a93d7fcdb2f03',
      uri: 'ipfs://Qmex96KX4evfWD5AhuKLcgocyjtsYsKt66rkGNgCRijynB',
      metadata: {}
    })
    .persist()

  nock(baseUrl)
    .get(`/transaction/utxo/${wallets.hathor.address}`)
    .query({
      protocol: Protocol.HATHOR,
    })
    .reply(200, [
      {
        index: 1,
        value: 2119,
        txHash: '00000df210d1eeca2c5eb412118f775b2138000cf64198cfb7b219690d62a82a',
        token: '00000df210d1eeca2c5eb412118f775b2138000cf64198cfb7b219690d62a82a',
      },
    ])
    .persist()
  nock(baseUrl)
    .get(`/transaction/00000df210d1eeca2c5eb412118f775b2138000cf64198cfb7b219690d62a82a`)
    .query({
      protocol: Protocol.HATHOR,
    })
    .reply(200, {
      tx: {
        outputs: [
          {},
          {
            value: 1000,
            token_data: 1,
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
  nock(baseUrl)
    .post(`/transaction`, {
      type: TransactionType.TRANSFER,
      signedTx: '000101010200000df210d1eeca2c5eb412118f775b2138000cf64198cfb7b219690d62a82a00000df210d1eeca2c5eb412118f775b2138000cf64198cfb7b219690d62a82a01006a473045022100c9471a854addc5467c75d482d449318227719407445841c2da6b74e2d6226ebb02200499e12f16f7e857b054184a83b8af474c6ffa09f03ce6761bd73d6474b2419f2102c483af3067db72fdd503230b8fe5d0e66795a6a024287f14f452c00e904a3e530000006401001976a9145ec3e3cdd94db10ee2961a54b4d11ef2dbd3991888ac000007e301001976a91464496a00cac3c8c5866aac5cdf0652614e6c256388ac40320938d122738d61805cf70200000e7946698b88a52f9c4145ca7fe2b8c0f9c9cf251a5366a48256f889cf4000000631ba4d8d00299c6e68c40c6420461a446668b7d1f5d0e584b0186fcc6f00051500'
    })
    .query({
      'protocol': 'HATHOR',
    })
    .reply(200, { hash: '000101010200000' })
    .persist()
}