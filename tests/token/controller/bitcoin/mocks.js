
exports.loadNockMocks = (nock, wallets) => {
  const AxiosApi = require('../../../../src/axios')
  const { TransactionType } = require('../../../../src/features/transaction/entity')
  const { Protocol } = require('../../../../src/services/blockchain/constants')
  const { config } = require('../../../wallet/constants')
  const axiosApi = new AxiosApi(config)
  const baseUrl = axiosApi.getBaseUrl(config.environment)
  const protocol = Protocol.BITCOIN

  nock(baseUrl)
    .post(`/fee?protocol=${protocol}`, {
      type: TransactionType.TRANSFER,
      numInputs: 1,
      numOutputs: 1
    })
    .reply(200, {
      estimateValue: '400',
      unit: 'satoshi',
    })
    .persist()
  nock(baseUrl)
    .get(`/transaction/utxo/${wallets.bitcoin.address}`)
    .query({
      protocol,
    })
    .reply(200, [
      {
        value: 2022623,
        txHash: '03fceba0863bbf2070fa2f03b20ece7ded5bf0992da2cd99948d950ff7971f94',
        index: 0,
        height: 2005940,
      },
    ])
    .persist()
  nock(baseUrl)
    .get(`/tx/03fceba0863bbf2070fa2f03b20ece7ded5bf0992da2cd99948d950ff7971f94`)
    .query({
      protocol,
    })
    .reply(200, {
      blockhash: '0000000000242d0443cc5b1847547260dc9278a5ba6a83e73c892e6c70c459d3',
      vout: [{ value: 0.02022623 }, {}],
      hex: '02000000000101f27eb920690ce3b0c3673c36873725b677447f09817045492faa4858d6a3d08d0100000000feffffff02dfdc1e00000000001976a9141c2187a8c42875b6256fc672d84924fbcc1b7a8d88ac5718370f0000000017a91426513f88c7013b174f970161736fa562ac77f7058702473044022008f35c495c5cd0c8953666afcf8968ba4787d0b2c985b8612bb079dc7a4286b402201b0a3009465c4b3dd598aaa9fa2a63e383cf50b44a3ea52a58ea72236a4eee3e01210224c8275f744ee80f25f230c865f242f413819e305e5c0e7cee04b5d6ceacdccd97fd1f00',
    })
    .persist()
  nock(baseUrl)
    .post(`/tx`)
    .query({
      protocol,
    })
    .reply(200, {
      "hash": "9499cda22d99f05bed7dce0ebe032ffa7020bf3b86a0ebfc03000000006b",
    })
    .persist()
}
