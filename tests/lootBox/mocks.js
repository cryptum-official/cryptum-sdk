const AxiosApi = require('../../src/axios')
const { config } = require('../wallet/constants')
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)

exports.loadNockMocks = (nock, [wallet1, wallet2]) => {
  nock(baseUrl).post(`/contract/lootBox/deploy?protocol=ETHEREUM`, {
    defaultAdmin: wallet1.address,
    name: 'Loot Box',
    symbol: 'LOOTBOX',
    royaltyRecipient: wallet1.address,
    royaltyBps: 1000,
  }).reply(200, {
    from: wallet1.address,
    chainId: 4,
    nonce: 1,
    gasPrice: '0x1000000',
    to: '',
    gasLimit: '0x1000000',
  }).persist()
  nock(baseUrl).get(`/transaction/0xfffffffffffffffffffff/proxy?protocol=ETHEREUM`).reply(200, {
    address: '0xaaaaaaaaaaaaaaaaaaaaa'
  }).persist()
  nock(baseUrl).post(`/tx?protocol=ETHEREUM`, () => true).reply(200, {
    hash: '0xfffffffffffffffffffff'
  }).persist()

  nock(baseUrl).post(`/contract/lootBox/0xaaaaaaaaaaaaaaaaaaaaa/create?protocol=ETHEREUM`, {
    from: wallet1.address,
    contents: [
      { tokenAddress: '0xbbbb', tokenId: '0', tokenType: 2, amount: '10' }
    ],
    lootBoxFactoryAddress: '0xaaaaaaaaaaaaaaaaaaaaa',
    amountDistributedPerOpen: '1',
    rewardUnits: ['1'],
    openStartTimestamp: '0',
    recipient: wallet2.address
  }).reply(200, {
    from: wallet1.address,
    chainId: 4,
    nonce: 1,
    gasPrice: '0x1000000',
    to: '',
    gasLimit: '0x1000000',
  }).persist()

  nock(baseUrl).post(`/contract/lootBox/0xaaaaaaaaaaaaaaaaaaaaa/open/0?protocol=ETHEREUM`, {
    from: wallet2.address,
    amount: 1
  }).reply(200, {
    from: wallet2.address,
    chainId: 4,
    nonce: 1,
    gasPrice: '0x1000000',
    to: '',
    gasLimit: '0x1000000',
  }).persist()
}
