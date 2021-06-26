const { CeloWallet, serializeCeloTransaction } = require('@celo-tools/celo-ethers-wrapper')
const { Transaction: EthereumTransaction } = require('@ethereumjs/tx')
const { default: EthereumCommon } = require('@ethereumjs/common')
const BigNumber = require('bignumber.js')
const Web3 = require('web3')
const {
  CUSD_CONTRACT_ADDRESS,
  CEUR_CONTRACT_ADDRESS,
  TRANSFER_METHOD_ABI,
  TRANSFER_COMMENT_METHOD_ABI,
  BSC_COMMON_CHAIN,
} = require('./constants')

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

    const token = new new Web3().eth.Contract(TRANSFER_METHOD_ABI, rawTransaction.to)
    rawTransaction.data = token.methods.transfer(destination, value).encodeABI()
  }
  const tx = new EthereumTransaction(rawTransaction, {
    common: new EthereumCommon({ chain: chainId }),
  })
  const signedTx = tx.sign(Buffer.from(fromPrivateKey, 'hex'))
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

    const token = new new Web3().eth.Contract(TRANSFER_METHOD_ABI, rawTransaction.to)
    rawTransaction.data = token.methods.transfer(destination, value).encodeABI()
  }
  const network = testnet ? 'testnet' : 'mainnet'
  const tx = new EthereumTransaction(rawTransaction, {
    common: EthereumCommon.forCustomChain(BSC_COMMON_CHAIN[network].base, BSC_COMMON_CHAIN[network].chain),
  })

  const signedTx = tx.sign(Buffer.from(fromPrivateKey, 'hex'))
  return `0x${signedTx.serialize().toString('hex')}`
}

module.exports.buildCeloTransferTransaction = async function ({
  fromPrivateKey,
  nonce,
  tokenSymbol,
  contractAddress,
  amount,
  destination,
  fee,
  feeCurrency = null,
  feeCurrencyContractAddress = null,
  memo = null,
  testnet = true,
}) {
  const network = testnet ? 'testnet' : 'mainnet'
  const { gas, gasPrice, chainId } = fee
  const rawTransaction = {
    chainId,
    nonce: Web3.utils.toHex(nonce),
    gasPrice: Web3.utils.toHex(gasPrice),
    to: '',
    value: undefined,
    data: undefined,
    gasLimit: Web3.utils.toHex(new BigNumber(gas).plus(100000)),
    feeCurrency:
      feeCurrency === 'cUSD'
        ? CUSD_CONTRACT_ADDRESS[network]
        : feeCurrency === 'cEUR'
        ? CEUR_CONTRACT_ADDRESS[network]
        : feeCurrencyContractAddress,
  }
  const value = Web3.utils.toWei(amount, 'ether')
  if (tokenSymbol === 'CELO') {
    rawTransaction.to = destination
    rawTransaction.value = Web3.utils.toHex(value)
  } else {
    if (tokenSymbol === 'cUSD') {
      rawTransaction.to = CUSD_CONTRACT_ADDRESS[network]
    } else if (tokenSymbol === 'cEUR') {
      rawTransaction.to = CEUR_CONTRACT_ADDRESS[network]
    } else {
      rawTransaction.to = contractAddress
    }

    const token = new new Web3().eth.Contract(
      memo ? TRANSFER_COMMENT_METHOD_ABI : TRANSFER_METHOD_ABI,
      rawTransaction.to
    )
    rawTransaction.data = memo
      ? token.methods.transferWithComment(destination, value, memo).encodeABI()
      : token.methods.transfer(destination, value).encodeABI()
  }

  const celoWallet = new CeloWallet(fromPrivateKey)
  const signature = celoWallet._signingKey().signDigest(Web3.utils.sha3(serializeCeloTransaction(rawTransaction)))
  return serializeCeloTransaction(rawTransaction, signature)
}

module.exports.buildSmartContractTransaction = async ({
  fromPrivateKey,
  nonce,
  contractAddress,
  method,
  params,
  fee,
  testnet
}) => {
  return ''
}