const nock = require('nock')
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const AxiosApi = require('../../src/axios')
const { TransactionController } = require('../../src/features/transaction/controller')
const { Protocol } = require('../../src/services/blockchain/constants')
const { getWallets, config } = require('../wallet/constants')
const { TransactionType } = require('../../src/features/transaction/entity')
const txController = new TransactionController(config)
const axiosApi = new AxiosApi(config)
const baseUrl = axiosApi.getBaseUrl(config.environment)
const contractAddress = '0xF13BfC94263F915E1Fec3d341015661056DD49FA'
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

describe.only('Stratus smart contract transactions', () => {
  before(async () => {
    wallets = await getWallets()

    nock(baseUrl)
      .get(`/wallet/${wallets.stratus.address}/info`)
      .query({ protocol: Protocol.STRATUS })
      .reply(200, {
        nonce: '2',
      })
      .persist()
      .post(`/fee?protocol=${Protocol.STRATUS}`, {
        type: TransactionType.CALL_CONTRACT_METHOD,
        from: wallets.stratus.address,
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
      .post(`/transaction/call-method?protocol=${Protocol.STRATUS}`, {
        contractAddress,
        contractAbi: contractAbiMessage,
        method: 'message',
        params: [],
      })
      .reply(200, {
        result: 'hello',
      })
      .persist()
      .post(`/transaction/contract/compile?protocol=${Protocol.STRATUS}`, {
        contractName: 'Test',
        source: 'contract Test {}',
        params: ['new message'],
      })
      .reply(200, {
        bytecode: '',
        abi: [],
      })
      .persist()
      .post(`/transaction/contract/compile?protocol=${Protocol.STRATUS}`, {
        tokenType: 'ERC20',
        params: ['new message'],
      })
      .reply(200, {
        bytecode: '',
        abi: [],
      })
      .persist()
      .post(`/fee?protocol=${Protocol.STRATUS}`, {
        type: TransactionType.DEPLOY_CONTRACT,
        from: wallets.stratus.address,
        contractName: 'Test',
        source: 'contract Test {}',
        params: ['new message'],
      })
      .reply(200, {
        gas: 21000,
        gasPrice: '4000000',
        chainId: 4,
      })
      .persist()
      .post(`/fee?protocol=${Protocol.STRATUS}`, {
        type: TransactionType.DEPLOY_ERC20,
        from: wallets.stratus.address,
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

  it.skip('create smart contract call transaction', async () => {
    const transaction = await txController.createSmartContractTransaction({
      wallet: wallets.stratus,
      contractAddress,
      contractAbi: contractAbiUpdate,
      method: 'update',
      params: ['new message'],
      protocol: Protocol.STRATUS,
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
  it.skip('create smart contract call transaction failed when wallet is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractTransaction({
        wallet: null,
        contractAddress,
        contractAbi: contractAbiUpdate,
        method: 'update',
        params: ['new message'],
        protocol: Protocol.STRATUS,
        testnet: true,
      })
    )
  })
  it.skip('create smart contract call transaction failed when contract address is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractTransaction({
        wallet: wallets.stratus,
        contractAddress: undefined,
        contractAbi: contractAbiUpdate,
        method: 'update',
        params: ['new message'],
        protocol: Protocol.STRATUS,
      })
    )
  })
  it.skip('create smart contract call transaction failed when contract abi is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractTransaction({
        wallet: wallets.stratus,
        contractAddress,
        contractAbi: null,
        method: 'update',
        params: ['new message'],
        protocol: Protocol.STRATUS,
      })
    )
  })
  it.skip('call smart contract method', async () => {
    const response = await txController.callSmartContractMethod({
      contractAddress,
      contractAbi: contractAbiMessage,
      method: 'message',
      params: [],
      protocol: Protocol.STRATUS,
      testnet: true,
    })
    assert.strictEqual(response.result, 'hello')
  })
  it.skip('call smart contract method failed when constract address missing', async () => {
    assert.isRejected(
      txController.callSmartContractMethod({
        contractAbi: contractAbiMessage,
        method: 'message',
        params: [],
        protocol: Protocol.STRATUS,
        testnet: true,
      })
    )
  })
  it.skip('call smart contract method failed when constract abi missing', async () => {
    assert.isRejected(
      txController.callSmartContractMethod({
        contractAddress,
        method: 'message',
        params: [],
        protocol: Protocol.STRATUS,
        testnet: true,
      })
    )
  })

  it.skip('create smart contract deploy transaction', async () => {
    const transaction = await txController.createSmartContractDeployTransaction({
      wallet: wallets.stratus,
      contractName: 'Test',
      source: 'contract Test {}',
      params: ['new message'],
      protocol: Protocol.STRATUS,
      testnet: true,
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
  it.skip('create smart contract token deploy transaction', async () => {
    const transaction = await txController.createTokenDeployTransaction({
      wallet: wallets.stratus,
      params: ['new message'],
      protocol: Protocol.STRATUS,
      testnet: true,
      tokenType: 'ERC20',
    })
    assert.include(transaction.signedTx, '0x')
    // console.log(await txController.sendTransaction(transaction))
  })
  it.skip('throws smart contract deploy transaction failed when wallet is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractDeployTransaction({
        params: ['new message'],
        protocol: Protocol.STRATUS,
        testnet: true,
        contractName: 'Test',
        source: 'contract Test {}',
      })
    )
  })
  it.skip('throws smart contract deploy transaction failed when params is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractDeployTransaction({
        wallet: wallets.stratus,
        protocol: Protocol.STRATUS,
        testnet: true,
        contractName: 'Test',
        source: 'contract Test {}',
      })
    )
  })
  it.skip('throws smart contract deploy transaction failed when contract name is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractDeployTransaction({
        wallet: wallets.stratus,
        protocol: Protocol.STRATUS,
        testnet: true,
        source: 'contract Test {}',
      })
    )
  })
  it.skip('throws smart contract deploy transaction failed when source is invalid', async () => {
    assert.isRejected(
      txController.createSmartContractDeployTransaction({
        wallet: wallets.stratus,
        protocol: Protocol.STRATUS,
        testnet: true,
        contractName: 'Test',
      })
    )
  })
  it.skip('throws smart contract token deploy transaction failed when wallet is invalid', async () => {
    assert.isRejected(
      txController.createTokenDeployTransaction({
        params: ['new message'],
        protocol: Protocol.STRATUS,
        testnet: true,
        tokenType: 'ERC20',
      })
    )
  })
  it.skip('throws smart contract token deploy transaction failed when params is invalid', async () => {
    assert.isRejected(
      txController.createTokenDeployTransaction({
        wallet: wallets.stratus,
        protocol: Protocol.STRATUS,
        testnet: true,
        tokenType: 'ERC20',
      })
    )
  })
  it.skip('throws smart contract token deploy transaction failed when token type is invalid', async () => {
    assert.isRejected(
      txController.createTokenDeployTransaction({
        wallet: wallets.stratus,
        protocol: Protocol.STRATUS,
        testnet: true,
        params: ['new message'],
      })
    )
  })
})
