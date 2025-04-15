const { TransactionFactory } = require('@ethereumjs/tx')
const { default: Common } = require('@ethereumjs/common')
const {
  BSC_COMMON_CHAIN,
  POLYGON_COMMON_CHAIN,
  Protocol,
  AVAXCCHAIN_COMMON_CHAIN,
  CHLIZ_COMMON_CHAIN,
  STRATUS_COMMON_CHAIN,
  BESU_COMMON_CHAIN,
  CELO_COMMON_CHAIN,
} = require('./constants')
const { GenericException } = require('../../errors')
const { isTestnet } = require('../../services/utils')

const signEthereumTx = (rawTransaction, protocol, fromPrivateKey, network) => {
  network = isTestnet(network) ? 'testnet' : 'mainnet'
  let common
  if (protocol === Protocol.ETHEREUM) {
    common = new Common({ chain: rawTransaction.chainId })
  } else if (protocol === Protocol.STRATUS) {
    common = Common.custom(STRATUS_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.BESU) {
    common = Common.custom(BESU_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.BSC) {
    common = Common.custom(BSC_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.AVAXCCHAIN) {
    common = Common.custom(AVAXCCHAIN_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.CHILIZ) {
    common = Common.custom(CHLIZ_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.POLYGON) {
    common = Common.custom(POLYGON_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.CELO) {
    common = Common.custom(CELO_COMMON_CHAIN[network].chain)
  } else {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }

  if (rawTransaction.gas && rawTransaction.gasLimit === undefined) {
    rawTransaction.gasLimit = rawTransaction.gas
    delete rawTransaction.gas
  }

  const tx = TransactionFactory.fromTxData(rawTransaction, { common })
  const signedTx = tx.sign(Buffer.from(fromPrivateKey.substring(2), 'hex'))
  return `0x${signedTx.serialize().toString('hex')}`
}

exports.signEthereumTx = signEthereumTx
