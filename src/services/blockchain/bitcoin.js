const { default: BigNumber } = require('bignumber.js')
const bitcoin = require('bitcoinjs-lib')
const { toSatoshi } = require('./utils')

module.exports.buildBitcoinTransferTransaction = async function ({
  fromUTXOs,
  fromPrivateKeys,
  outputs,
  fee,
  testnet,
}) {
  const { estimateValue: feePerByte } = fee
  const network = testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
  const tx = new bitcoin.Psbt({ network, maximumFeeRate: feePerByte })
  for (let i = 0; i < fromUTXOs.length; ++i) {
    const utxo = fromUTXOs[i]
    tx.addInput({
      hash: utxo.txHash,
      index: utxo.index,
      nonWitnessUtxo: Buffer.from(utxo.hex, 'hex'),
    })
  }
  tx.addOutputs(outputs)
  for (let i = 0; i < fromUTXOs.length; ++i) {
    tx.signInput(i, bitcoin.ECPair.fromPrivateKey(Buffer.from(fromPrivateKeys[i], 'hex'), { network }))
  }

  return tx.finalizeAllInputs().extractTransaction().toHex()
}
