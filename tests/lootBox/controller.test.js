const { assert } = require('chai')
const nock = require('nock')
const { getWalletControllerInstance } = require('../../src/features/wallet/controller')
const { LootBoxController } = require('../../src/features/lootBox/controller')
const { config, getWallets } = require('../wallet/constants')
const { getTransactionControllerInstance } = require('../../src/features/transaction/controller')
const { loadNockMocks } = require('./mocks')

describe.only('LootBox Controller Tests', () => {
  let wallet1, wallet2, lootBoxAddress;

  before(async () => {
    const wallets = await getWallets();
    wallet1 = wallets.ethereum;
    wallet2 = await getWalletControllerInstance(config).generateWallet({ protocol: 'ETHEREUM' })
    loadNockMocks(nock, [wallet1, wallet2])
  })
  after(() => {
    nock.isDone();
  })

  it('should deploy loot box', async () => {
    const lootBox = new LootBoxController(config)
    const { hash } = await lootBox.deploy({
      protocol: 'ETHEREUM',
      wallet: wallet1,
      defaultAdmin: wallet1.address,
      name: 'Loot Box',
      symbol: 'LOOTBOX'
    })
    assert.include(hash, '0x');
    ({ address: lootBoxAddress } = await getTransactionControllerInstance(config).getProxyAddressByHash({ hash, protocol: 'ETHEREUM' }))
  })

  it('should create new loot box', async () => {
    const data = {
      contents: [
        { tokenAddress: '0xbbbb', tokenId: '0', tokenType: 'ERC1155', amount: '10' }
      ],
      lootBoxFactoryAddress: lootBoxAddress,
      openStartTimestamp: '0',
      protocol: 'ETHEREUM',
      recipient: wallet2.address
    }
    const controller = new LootBoxController(config)
    const { hash } = await controller.createLootBox({ wallet: wallet1, ...data })
    assert.include(hash, '0x');
  })

  it('should open the loot box', async () => {
    const controller = new LootBoxController(config)
    const { hash } = await controller.openLootBox({
      wallet: wallet2,
      lootBoxFactoryAddress: lootBoxAddress,
      lootBoxId: '0',
      protocol: 'ETHEREUM',
    })
    assert.include(hash, '0x');
  })
})


