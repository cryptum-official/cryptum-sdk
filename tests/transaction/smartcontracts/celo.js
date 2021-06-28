const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../axios')
const TransactionController = require('../../../src/features/transaction/controller')
const { Protocol } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const { TransactionType } = require('../../../src/features/transaction/entity')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
const contractAbi = [
  {
    constant: false,
    inputs: [
      {
        internalType: 'string',
        name: 'newMessage',
        type: 'string',
      },
    ],
    name: 'update',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
let wallets = {}

describe.only('Celo smart contract transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.celo.address}/info`)
      .query({ protocol: Protocol.CELO })
      .reply(200, {
        nonce: '2',
      })
      .persist()
      .post(`/fee?protocol=${Protocol.CELO}`, {
        type: TransactionType.CALL_CONTRACT_METHOD,
        from: '0x8C33DB44a78629cF60C88383d436EEc356884625',
        contractAddress: '0x2B751008e680E1921161C5456a763e72788Db9Ca',
        contractAbi,
        method: 'update',
        params: ['new message'],
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 44787,
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create smart contract call transaction', async () => {
    const transaction = await txController.createSmartContractTransaction({
      wallet: wallets.celo,
      contractAddress: '0x2B751008e680E1921161C5456a763e72788Db9Ca',
      contractAbi,
      method: 'update',
      params: ['new message'],
      protocol: Protocol.CELO,
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
  it('create smart contract call transaction failed when wallet is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractTransaction({
        wallet: null,
        contractAddress: '0x2B751008e680E1921161C5456a763e72788Db9Ca',
        contractAbi,
        method: 'update',
        params: ['new message'],
        protocol: Protocol.CELO,
        testnet: true,
      })
    )
  })
  it('create smart contract call transaction failed when contract address is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractTransaction({
        wallet: wallets.celo,
        contractAddress: undefined,
        contractAbi,
        method: 'update',
        params: ['new message'],
        protocol: Protocol.CELO,
      })
    )
  })
  it('create smart contract call transaction failed when contract abi is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractTransaction({
        wallet: wallets.celo,
        contractAddress: '0x2B751008e680E1921161C5456a763e72788Db9Ca',
        contractAbi: null,
        method: 'update',
        params: ['new message'],
        protocol: Protocol.CELO,
      })
    )
  })
})
