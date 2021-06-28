const { default: BigNumber } = require('bignumber.js')
const bitcoin = require('bitcoinjs-lib')
const { GenericException } = require('../../../errors')
const { toSatoshi } = require('./utils')

/**
 * @param numInputs
 * @param numOutputs
 */
function calculateTransactionSize(numInputs, numOutputs) {
  return numInputs * 148 + numOutputs * 34 + 10
}

module.exports.buildBitcoinTransferTransaction = async function ({
  wallet,
  fromUTXOs,
  fromPrivateKeys,
  outputs,
  fee,
  testnet,
}) {
  const feePerByte = fee
  const outputDatas = outputs.map(({ address, amount }) => ({ address, value: toSatoshi(amount).toNumber() }))
  const amountSatoshi = outputDatas
    .map((output) => output.value)
    .reduce((prev, cur) => new BigNumber(prev).plus(cur), new BigNumber(0))

  const network = testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
  const tx = new bitcoin.Psbt({ network })
  tx.setMaximumFeeRate(new BigNumber(feePerByte).toNumber())
  let availableSatoshi = new BigNumber(0)
  let calcFee = new BigNumber(0)
  for (let i = 0; i < fromUTXOs.length; ++i) {
    const utxo = fromUTXOs[i]
    if (utxo.height === 0) {
      throw new GenericException(`UTXO transaction ${utxo.txHash} is still pending`, 'InvalidTypeException')
    }
    tx.addInput({
      hash: utxo.txHash,
      index: utxo.index,
      nonWitnessUtxo: Buffer.from(utxo.hex, 'hex'),
    })
    const transactionSize = calculateTransactionSize(tx.inputCount, outputs.length)
    calcFee = new BigNumber(feePerByte).times(transactionSize)
    if (wallet) {
      availableSatoshi = availableSatoshi.plus(utxo.value)
      if (availableSatoshi.gte(amountSatoshi.plus(calcFee))) {
        break
      }
    }
  }
  tx.addOutputs(outputDatas)
  for (let i = 0; i < fromUTXOs.length; ++i) {
    tx.signInput(i, bitcoin.ECPair.fromPrivateKey(Buffer.from(fromPrivateKeys[i], 'hex'), { network }))
    if (!tx.validateSignaturesOfInput(i)) {
      throw new GenericException('Signature validation failed of input', 'InvalidTypeException')
    }
  }

  return tx.finalizeAllInputs().extractTransaction().toHex()
}
