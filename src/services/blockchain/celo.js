const { LocalWallet } = require('@celo/wallet-local')
const BigNumber = require('bignumber.js')
const Web3 = require('web3')
const {
  CUSD_CONTRACT_ADDRESS,
  CEUR_CONTRACT_ADDRESS,
  CELO_CONTRACT_ADDRESS,
} = require('./constants')
const { compileContract } = require('../../services/blockchain/contract')
const { TRANSFER_METHOD_ABI, TRANSFER_COMMENT_METHOD_ABI } = require('./contract/abis')
const { toWei } = require('./utils')

module.exports.buildCeloTransferTransaction = async function ({
  fromPrivateKey,
  nonce,
  tokenSymbol,
  contractAddress,
  amount,
  destination,
  fee,
  feeCurrency = null,
  memo = null,
  testnet = true,
  decimals
}) {
  const network = testnet ? 'testnet' : 'mainnet'
  const { gas, gasPrice, chainId } = fee
  const celoWallet = new LocalWallet()
  celoWallet.addAccount(fromPrivateKey)
  const rawTransaction = {
    from: celoWallet.getAccounts()[0],
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: feeCurrency ? Web3.utils.toHex(new BigNumber(gasPrice).plus(200000000)) : Web3.utils.toHex(gasPrice),
    to: '',
    value: undefined,
    data: undefined,
    gas: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
    feeCurrency
  }
  const value = toWei(amount, decimals)
  if (tokenSymbol === 'CELO' && !memo) {
    rawTransaction.to = destination
    rawTransaction.value = Web3.utils.toHex(value)
  } else {
    if (tokenSymbol === 'CELO') {
      rawTransaction.to = CELO_CONTRACT_ADDRESS[network]
    } else if (tokenSymbol === 'cUSD') {
      rawTransaction.to = CUSD_CONTRACT_ADDRESS[network]
    } else if (tokenSymbol === 'cEUR') {
      rawTransaction.to = CEUR_CONTRACT_ADDRESS[network]
    } else {
      rawTransaction.to = contractAddress
    }

    const web3 = new Web3()
    const token = new web3.eth.Contract(memo ? TRANSFER_COMMENT_METHOD_ABI : TRANSFER_METHOD_ABI, rawTransaction.to)
    rawTransaction.data = memo
      ? token.methods.transferWithComment(destination, value, memo).encodeABI()
      : token.methods.transfer(destination, value).encodeABI()
  }

  return await this.signCeloTx(rawTransaction, fromPrivateKey)
}

module.exports.buildCeloSmartContractTransaction = async ({
  fromPrivateKey,
  nonce,
  contractAddress,
  contractAbi,
  method,
  params,
  value,
  fee,
  feeCurrency,
  testnet,
}) => {
  const network = testnet ? 'testnet' : 'mainnet'
  const celoWallet = new LocalWallet()
  celoWallet.addAccount(fromPrivateKey)
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    from: celoWallet.getAccounts()[0],
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: contractAddress,
    value: Web3.utils.toHex(value || 0),
    data: undefined,
    gas: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
    feeCurrency:
      feeCurrency === 'cUSD'
        ? CUSD_CONTRACT_ADDRESS[network]
        : feeCurrency === 'cEUR'
          ? CEUR_CONTRACT_ADDRESS[network]
          : feeCurrency,
  }
  const web3 = new Web3()
  const contract = new web3.eth.Contract(contractAbi, contractAddress)
  rawTransaction.data = contract.methods[method](...params).encodeABI()

  return await this.signCeloTx(rawTransaction, fromPrivateKey)
}

module.exports.buildCeloSmartContractDeployTransaction = async ({
  fromPrivateKey,
  contractName,
  source,
  nonce,
  fee,
  feeCurrency,
  testnet,
  config,
  tokenType,
  params,
}) => {
  const { bytecode } = await compileContract({
    source, contractName, config, tokenType, protocol: 'CELO', params,
  });
  const celoWallet = new LocalWallet()
  celoWallet.addAccount(fromPrivateKey)
  const network = testnet ? 'testnet' : 'mainnet'
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    from: celoWallet.getAccounts()[0],
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: null,
    value: null,
    data: bytecode,
    gas: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
    feeCurrency:
      feeCurrency === 'cUSD'
        ? CUSD_CONTRACT_ADDRESS[network]
        : feeCurrency === 'cEUR'
          ? CEUR_CONTRACT_ADDRESS[network]
          : feeCurrency,
  }

  return await this.signCeloTx(rawTransaction, fromPrivateKey)
}

module.exports.signCeloTx = async (rawTransaction, fromPrivateKey) => {
  const celoWallet = new LocalWallet()
  celoWallet.addAccount(fromPrivateKey)
  const signedTx = await celoWallet.signTransaction(rawTransaction)

  return signedTx.raw
}