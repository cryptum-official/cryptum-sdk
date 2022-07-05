const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../../src/axios')
const TransactionController = require('../../../src/features/transaction/controller')
const { Protocol } = require('../../../src/services/blockchain/constants')
const { getWallets, config } = require('../../wallet/constants')
const { TransactionType } = require('../../../src/features/transaction/entity')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
const contractAddress = '0x1abd7fcFB29BF8D7EA946dA6ffc0d2DB0e30414f'
const contractAbiUpdate = [
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
const contractAbiMessage = [
  {
    constant: true,
    inputs: [],
    name: 'message',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]
let wallets = {}

describe.only('AVAXCCHAIN smart contract transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.avaxcchain.address}/info`)
      .query({ protocol: Protocol.AVAXCCHAIN })
      .reply(200, {
        nonce: '2',
      })
      .persist()
      .post(`/fee?protocol=${Protocol.AVAXCCHAIN}`, {
        type: TransactionType.CALL_CONTRACT_METHOD,
        from: wallets.bsc.address,
        contractAddress,
        contractAbi: contractAbiUpdate,
        method: 'update',
        params: ['new message'],
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 4,
      })
      .persist()
      .post(`/transaction/call-method?protocol=${Protocol.AVAXCCHAIN}`, {
        contractAddress,
        contractAbi: contractAbiMessage,
        method: 'message',
        params: [],
      })
      .reply(200, {
        result: 'hello',
      })
      .persist()
      .post(`/transaction/contract/compile?protocol=${Protocol.AVAXCCHAIN}`, {
        contractName: 'Test',
        source: 'contract Test {}',
        params: ['new message'],
      })
      .reply(200, {
        bytecode: '',
        abi: [],
      })
      .persist()
      .post(`/transaction/contract/compile?protocol=${Protocol.AVAXCCHAIN}`, {
        tokenType: 'ERC20',
        params: ['new message'],
      })
      .reply(200, {
        bytecode: '',
        abi: [],
      })
      .persist()
      .post(`/fee?protocol=${Protocol.AVAXCCHAIN}`, {
        type: TransactionType.DEPLOY_CONTRACT,
        from: wallets.avaxcchain.address,
        contractName: 'Test',
        source: 'contract Test {}',
        params: ['new message'],
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 4,
      })
      .post(`/fee?protocol=${Protocol.AVAXCCHAIN}`, {
        type: TransactionType.DEPLOY_ERC20,
        from: wallets.avaxcchain.address,
        tokenType: 'ERC20',
        params: ['new message'],
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 4,
      })
      .persist()
  })
  after(() => {
    nock.isDone()
  })

  it('create smart contract call transaction', async () => {
    const transaction = await txController.createSmartContractTransaction({
      wallet: wallets.bsc,
      contractAddress,
      contractAbi: contractAbiUpdate,
      method: 'update',
      params: ['new message'],
      protocol: Protocol.AVAXCCHAIN,
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
  it('create smart contract call transaction failed when wallet is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractTransaction({
        wallet: null,
        contractAddress,
        contractAbi: contractAbiUpdate,
        method: 'update',
        params: ['new message'],
        protocol: Protocol.AVAXCCHAIN,
        testnet: true,
      })
    )
  })
  it('create smart contract call transaction failed when contract address is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractTransaction({
        wallet: wallets.avaxcchain,
        contractAddress: undefined,
        contractAbi: contractAbiUpdate,
        method: 'update',
        params: ['new message'],
        protocol: Protocol.AVAXCCHAIN,
      })
    )
  })
  it('create smart contract call transaction failed when contract abi is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractTransaction({
        wallet: wallets.avaxcchain,
        contractAddress,
        contractAbi: null,
        method: 'update',
        params: ['new message'],
        protocol: Protocol.AVAXCCHAIN,
      })
    )
  })
  it('call smart contract method', async () => {
    const response = await txController.callSmartContractMethod({
      contractAddress,
      contractAbi: contractAbiMessage,
      method: 'message',
      params: [],
      protocol: Protocol.AVAXCCHAIN,
      testnet: true,
    })
    assert.strictEqual(response.result, 'hello')
  })
  it('call smart contract method failed when constract address missing', async () => {
    assert.isRejected(
      txController.callSmartContractMethod({
        contractAbi: contractAbiMessage,
        method: 'message',
        params: [],
        protocol: Protocol.AVAXCCHAIN,
        testnet: true,
      })
    )
  })
  it('call smart contract method failed when constract abi missing', async () => {
    assert.isRejected(
      txController.callSmartContractMethod({
        contractAddress,
        method: 'message',
        params: [],
        protocol: Protocol.AVAXCCHAIN,
        testnet: true,
      })
    )
  })

  it('create smart contract deploy transaction', async () => {
    const transaction = await txController.createSmartContractDeployTransaction({
      wallet: wallets.avaxcchain,
      params: ['new message'],
      protocol: Protocol.AVAXCCHAIN,
      testnet: true,
      contractName: 'Test',
      source: 'contract Test {}'
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
  it('create smart contract token deploy transaction', async () => {
    const transaction = await txController.createTokenDeployTransaction({
      wallet: wallets.avaxcchain,
      params: ['new message'],
      protocol: Protocol.AVAXCCHAIN,
      testnet: true,
      tokenType: 'ERC20',
    })
    assert.include(transaction.signedTx, '0x')
  })

  it('throws smart contract deploy transaction failed when wallet is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractDeployTransaction({
        params: ['new message'],
        protocol: Protocol.AVAXCCHAIN,
        testnet: true,
        contractName: 'Test',
        source: 'contract Test {}'
      })
    )
  })
  it('throws smart contract deploy transaction failed when params is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractDeployTransaction({
        wallet: wallets.avaxcchain,
        protocol: Protocol.AVAXCCHAIN,
        testnet: true,
        contractName: 'Test',
        source: 'contract Test {}'
      })
    )
  })
  it('throws smart contract deploy transaction failed when contract name is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractDeployTransaction({
        wallet: wallets.avaxcchain,
        protocol: Protocol.AVAXCCHAIN,
        testnet: true,
        source: 'contract Test {}'
      })
    )
  })
  it('throws smart contract deploy transaction failed when source is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractDeployTransaction({
        wallet: wallets.avaxcchain,
        protocol: Protocol.AVAXCCHAIN,
        testnet: true,
        contractName: 'Test',
      })
    )
  })

  it('throws smart contract token deploy transaction failed when wallet is invalid', async () => {
    assert.isRejected(
      txController.createTokenDeployTransaction({
        params: ['new message'],
        protocol: Protocol.AVAXCCHAIN,
        testnet: true,
        tokenType: 'ERC20',
      })
    )
  })
  it('throws smart contract token deploy transaction failed when params is invalid', async () => {
    assert.isRejected(
      txController.createTokenDeployTransaction({
        wallet: wallets.avaxcchain,
        protocol: Protocol.AVAXCCHAIN,
        testnet: true,
        tokenType: 'ERC20',
      })
    )
  })
  it('throws smart contract token deploy transaction failed when token type is invalid', async () => {
    assert.isRejected(
      txController.createTokenDeployTransaction({
        wallet: wallets.avaxcchain,
        protocol: Protocol.AVAXCCHAIN,
        testnet: true,
        params: ['new message'],
      })
    )
  })
})
