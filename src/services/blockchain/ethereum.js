const { Transaction: EthereumTransaction } = require('@ethereumjs/tx')
const { default: EthereumCommon } = require('@ethereumjs/common')
const BigNumber = require('bignumber.js')
const Web3 = require('web3')
const { TRANSFER_METHOD_ABI, BSC_COMMON_CHAIN, POLYGON_COMMON_CHAIN, Protocol, AVAXCCHAIN_COMMON_CHAIN } = require('./constants')
const { GenericException } = require('../../../errors')
const { compileContract } = require('../../services/blockchain/contract')

module.exports.buildEthereumTransferTransaction = async function ({
  fromPrivateKey,
  nonce,
  tokenSymbol,
  contractAddress,
  amount,
  destination,
  fee,
}) {
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: '',
    value: undefined,
    data: undefined,
    gasLimit: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
  }
  const value = Web3.utils.toWei(amount, 'ether')
  if (tokenSymbol === 'ETH') {
    rawTransaction.to = destination
    rawTransaction.value = Web3.utils.toHex(value)
  } else {
    rawTransaction.to = contractAddress
    const web3 = new Web3()
    const token = new web3.eth.Contract(TRANSFER_METHOD_ABI, rawTransaction.to)
    rawTransaction.data = token.methods.transfer(destination, value).encodeABI()
  }
  const tx = new EthereumTransaction(rawTransaction, {
    common: new EthereumCommon({ chain: chainId }),
  })
  const signedTx = tx.sign(Buffer.from(fromPrivateKey.substring(2), 'hex'))
  return `0x${signedTx.serialize().toString('hex')}`
}

module.exports.buildAvaxCChainTransferTransaction = async function ({
  fromPrivateKey,
  nonce,
  tokenSymbol,
  contractAddress,
  amount,
  destination,
  fee,
  testnet
}) {
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: '',
    value: undefined,
    data: undefined,
    gasLimit: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
  }
  const value = Web3.utils.toWei(amount, 'ether')
  if (tokenSymbol === 'AVAX') {
    rawTransaction.to = destination
    rawTransaction.value = Web3.utils.toHex(value)
  } else {
    rawTransaction.to = contractAddress
    const web3 = new Web3()
    const token = new web3.eth.Contract(TRANSFER_METHOD_ABI, rawTransaction.to)
    rawTransaction.data = token.methods.transfer(destination, value).encodeABI()
  }
  const network = testnet ? 'testnet' : 'mainnet'
  const tx = new EthereumTransaction(rawTransaction, {
    common: EthereumCommon.forCustomChain(AVAXCCHAIN_COMMON_CHAIN[network].base, AVAXCCHAIN_COMMON_CHAIN[network].chain),
  })
  const signedTx = tx.sign(Buffer.from(fromPrivateKey.substring(2), 'hex'))
  return `0x${signedTx.serialize().toString('hex')}`
}

module.exports.buildPolygonTransferTransaction = async function ({
  fromPrivateKey,
  nonce,
  tokenSymbol,
  contractAddress,
  amount,
  destination,
  fee,
  testnet,
}) {
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: '',
    value: undefined,
    data: undefined,
    gasLimit: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
  }
  const value = Web3.utils.toWei(amount, 'ether')
  if (tokenSymbol === 'MATIC') {
    rawTransaction.to = destination
    rawTransaction.value = Web3.utils.toHex(value)
  } else {
    rawTransaction.to = contractAddress
    const web3 = new Web3()
    const token = new web3.eth.Contract(TRANSFER_METHOD_ABI, rawTransaction.to)
    rawTransaction.data = token.methods.transfer(destination, value).encodeABI()
  }
  const network = testnet ? 'testnet' : 'mainnet'
  const tx = new EthereumTransaction(rawTransaction, {
    common: EthereumCommon.forCustomChain(POLYGON_COMMON_CHAIN[network].base, POLYGON_COMMON_CHAIN[network].chain),
  })

  const signedTx = tx.sign(Buffer.from(fromPrivateKey.substring(2), 'hex'))
  return `0x${signedTx.serialize().toString('hex')}`
}

module.exports.buildBscTransferTransaction = async function ({
  fromPrivateKey,
  nonce,
  tokenSymbol,
  contractAddress,
  amount,
  destination,
  fee,
  testnet,
}) {
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: '',
    value: undefined,
    data: undefined,
    gasLimit: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
  }
  const value = Web3.utils.toWei(amount, 'ether')
  if (tokenSymbol === 'BNB') {
    rawTransaction.to = destination
    rawTransaction.value = Web3.utils.toHex(value)
  } else {
    rawTransaction.to = contractAddress
    const web3 = new Web3()
    const token = new web3.eth.Contract(TRANSFER_METHOD_ABI, rawTransaction.to)
    rawTransaction.data = token.methods.transfer(destination, value).encodeABI()
  }
  const network = testnet ? 'testnet' : 'mainnet'
  const tx = new EthereumTransaction(rawTransaction, {
    common: EthereumCommon.forCustomChain(BSC_COMMON_CHAIN[network].base, BSC_COMMON_CHAIN[network].chain),
  })

  const signedTx = tx.sign(Buffer.from(fromPrivateKey.substring(2), 'hex'))
  return `0x${signedTx.serialize().toString('hex')}`
}

module.exports.buildEthereumSmartContractTransaction = async ({
  fromPrivateKey,
  nonce,
  contractAddress,
  contractAbi,
  method,
  params,
  value,
  fee,
  testnet,
  protocol,
}) => {
  const network = testnet ? 'testnet' : 'mainnet'
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: contractAddress,
    value: Web3.utils.toHex(value),
    data: undefined,
    gasLimit: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
  }
  const web3 = new Web3()
  const contract = new web3.eth.Contract(contractAbi, contractAddress)
  rawTransaction.data = contract.methods[method](...params).encodeABI()

  let common = null
  if (protocol === Protocol.ETHEREUM) {
    common = new EthereumCommon({ chain: chainId })
  } else if (protocol === Protocol.BSC) {
    common = EthereumCommon.forCustomChain(BSC_COMMON_CHAIN[network].base, BSC_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.AVAXCCHAIN) {
    common = EthereumCommon.forCustomChain(AVAXCCHAIN_COMMON_CHAIN[network].base, AVAXCCHAIN_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.POLYGON) {
    common = EthereumCommon.forCustomChain(POLYGON_COMMON_CHAIN[network].base, POLYGON_COMMON_CHAIN[network].chain)
  }
  else {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
  const tx = new EthereumTransaction(rawTransaction, { common })
  const signedTx = tx.sign(Buffer.from(fromPrivateKey.substring(2), 'hex'))
  return `0x${signedTx.serialize().toString('hex')}`
}

module.exports.buildEthereumSmartContractDeployTransaction = async ({
  fromPrivateKey,
  nonce,
  contractName,
  source,
  fee,
  testnet,
  protocol,
  tokenType,
  config,
  params,
}) => {
  const { bytecode } = await compileContract({
    source, contractName, tokenType, protocol, config, params,
  });
  const network = testnet ? 'testnet' : 'mainnet'
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: null,
    value: null,
    data: bytecode,
    gasLimit: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
  }

  let common = null
  if (protocol === Protocol.ETHEREUM) {
    common = new EthereumCommon({ chain: chainId })
  } else if (protocol === Protocol.BSC) {
    common = EthereumCommon.forCustomChain(BSC_COMMON_CHAIN[network].base, BSC_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.AVAXCCHAIN) {
    common = EthereumCommon.forCustomChain(AVAXCCHAIN_COMMON_CHAIN[network].base, AVAXCCHAIN_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.POLYGON) {
    common = EthereumCommon.forCustomChain(POLYGON_COMMON_CHAIN[network].base, POLYGON_COMMON_CHAIN[network].chain)
  } else {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
  const tx = new EthereumTransaction(rawTransaction, { common })
  const signedTx = tx.sign(Buffer.from(fromPrivateKey.substring(2), 'hex'))
  return `0x${signedTx.serialize().toString('hex')}`
}
