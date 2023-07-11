const { default: BigNumber } = require('bignumber.js')
const bitcore = require('bitcore-lib')
const { toSatoshi } = require('./utils')
const { Protocol } = require('./constants')
const { TransactionType } = require('../../features/transaction/entity')
const { getTransactionControllerInstance } = require('../../features/transaction/controller')
const { BlockchainException } = require('../../errors/blockchainException')
const { getWalletControllerInstance } = require('../../features/wallet/controller')

module.exports.buildBitcoinTransferTransaction = async function ({ wallet, inputs, outputs, fee, data, config }) {
  const tc = getTransactionControllerInstance(config)
  const outputDatas = outputs.map(({ address, amount }) => ({ address, satoshis: toSatoshi(amount).toNumber() }))
  let outputSum = new BigNumber(outputDatas.reduce((prev, cur) => prev + cur.satoshis, 0))
  if (wallet) {
    inputs.sort((a, b) => b.value - a.value)
    const selectedInputs = []
    let inputSum = new BigNumber(0)
    let change = new BigNumber(0)
    for (let i = 0; i < inputs.length; ++i) {
      inputSum = inputSum.plus(inputs[i].value)
      selectedInputs.push({
        txid: inputs[i].txHash,
        address: wallet.address,
        outputIndex: inputs[i].index,
        script: bitcore.Script.buildPublicKeyHashOut(wallet.address).toString(),
        satoshis: inputs[i].value
      })
      if (inputSum.gt(outputSum)) {
        if (fee === undefined) {
          ({ estimateValue: fee } = await tc.getFee({
            type: TransactionType.TRANSFER,
            protocol: Protocol.BITCOIN,
            numInputs: selectedInputs.length,
            numOutputs: outputs.length + change.gt(0) ? 1 : 0
          }))
        }
        change = inputSum.minus(outputSum).minus(fee)
        outputSum = outputSum.plus(fee)
        if (inputSum.gt(outputSum)) {
          break
        }
      }
    }
    if (inputSum.lt(outputSum)) {
      throw new BlockchainException('Not enough balance')
    }

    const tx = new bitcore.Transaction()
    tx.fee(Number(fee))
    tx.from(selectedInputs)
    tx.to(outputDatas)
    if (change.gt(0)) tx.change(wallet.address)
    if (data) tx.addData(data)
    tx.sign(wallet.privateKey)
    return tx.serialize()
  } else {
    const tx = new bitcore.Transaction()
    for (let i = 0; i < inputs.length; ++i) {
      const inputWallet = await getWalletControllerInstance(config).generateWalletFromPrivateKey({
        privateKey: inputs[i].privateKey,
        protocol: Protocol.BITCOIN
      })
      tx.from({
        txid: inputs[i].txHash,
        address: inputWallet.address,
        outputIndex: inputs[i].index,
        script: bitcore.Script.buildPublicKeyHashOut(inputWallet.address).toString(),
        satoshis: toSatoshi(inputs[i].value).toNumber()
      })
    }
    tx.to(outputDatas)
    if (data) tx.addData(data)
    tx.sign(inputs.map(input => input.privateKey))
    return tx.serialize()
  }
}
