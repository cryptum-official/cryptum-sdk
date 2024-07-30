const { Transaction: EthereumTransaction } = require('@ethereumjs/tx')
const { default: EthereumCommon } = require('@ethereumjs/common')
const {
  BSC_COMMON_CHAIN,
  POLYGON_COMMON_CHAIN,
  Protocol,
  AVAXCCHAIN_COMMON_CHAIN,
  CHLIZ_COMMON_CHAIN,
  STRATUS_COMMON_CHAIN,
  BESU_COMMON_CHAIN,
} = require('./constants')
const { GenericException } = require('../../errors')
const { isTestnet } = require('../../services/utils')

const signEthereumTx = (rawTransaction, protocol, fromPrivateKey, network) => {
  network = isTestnet(network) ? 'testnet' : 'mainnet'
  let common
  if (protocol === Protocol.ETHEREUM) {
    common = new EthereumCommon({ chain: rawTransaction.chainId })
  } else if (protocol === Protocol.STRATUS) {
    common = EthereumCommon.forCustomChain(STRATUS_COMMON_CHAIN[network].base, STRATUS_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.BESU) {
    common = EthereumCommon.forCustomChain(BESU_COMMON_CHAIN[network].base, BESU_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.BSC) {
    common = EthereumCommon.forCustomChain(BSC_COMMON_CHAIN[network].base, BSC_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.AVAXCCHAIN) {
    common = EthereumCommon.forCustomChain(
      AVAXCCHAIN_COMMON_CHAIN[network].base,
      AVAXCCHAIN_COMMON_CHAIN[network].chain
    )
  } else if (protocol === Protocol.CHILIZ) {
    common = EthereumCommon.forCustomChain(CHLIZ_COMMON_CHAIN[network].base, CHLIZ_COMMON_CHAIN[network].chain)
  } else if (protocol === Protocol.POLYGON) {
    common = EthereumCommon.forCustomChain(POLYGON_COMMON_CHAIN[network].base, POLYGON_COMMON_CHAIN[network].chain)
  } else {
    throw new GenericException('Invalid protocol', 'InvalidTypeException')
  }
  const tx = new EthereumTransaction(rawTransaction, { common })
  const signedTx = tx.sign(Buffer.from(fromPrivateKey.substring(2), 'hex'))
  return `0x${signedTx.serialize().toString('hex')}`
}

exports.signEthereumTx = signEthereumTx
