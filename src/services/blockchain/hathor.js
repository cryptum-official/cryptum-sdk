const bitcoreLib = require('bitcore-lib')
const hathorLib = require('@hathor/wallet-lib')
const mineTransaction = require('@hathor/wallet-lib/lib/wallet/mineTransaction')
const { toHTRUnit } = require('./utils')
const { GenericException } = require('../../../errors')

hathorLib.transaction.updateMaxInputsConstant(256)
hathorLib.transaction.updateMaxOutputsConstant(256)
hathorLib.transaction.updateTransactionWeightConstants(14, 1.6, 100)

module.exports.buildHathorTransferTransaction = async function ({ inputs, outputs, inputPrivateKeys, tokens, inputsSum, changeAddress, testnet }) {

  const txData = {
    inputs: inputs.map((input) => ({ tx_id: input.txHash, index: input.index })),
    outputs: outputs.map(output => ({ address: output.address, value: toHTRUnit(output.amount).toNumber() })),
    tokens,
  }

  const outputsSum = hathorLib.transaction.getOutputsSum(txData.outputs)

  if (outputsSum < inputsSum) {
    txData.outputs.push({
      address: changeAddress,
      value: (inputsSum - outputsSum)
    });

  } else if (outputsSum > inputsSum) {
    throw new GenericException("Insufficient funds")
  }
  
  hathorLib.transaction.completeTx(txData)

  const dataToSign = hathorLib.transaction.dataToSign(txData)

  const hashbuf = hathorLib.transaction.getDataToSignHash(dataToSign)
  const network = hathorLib.network.getNetwork(testnet ? 'testnet' : 'mainnet')
  for (let i = 0; i < inputs.length; ++i) {
    const privateKey = bitcoreLib.PrivateKey(inputPrivateKeys[i], network)
    const sig = bitcoreLib.crypto.ECDSA.sign(hashbuf, privateKey, 'little').set({
      nhashtype: bitcoreLib.crypto.Signature.SIGHASH_ALL,
    })
    txData.inputs[i]['data'] = hathorLib.transaction.createInputData(sig.toDER(), privateKey.toPublicKey().toBuffer())
  }

  hathorLib.transaction.verifyTxData(txData)
  hathorLib.transaction.setWeightIfNeeded(txData)


  const tx = hathorLib.helpersUtils.createTxFromData(txData)
  const mineTx = new mineTransaction.default(tx)

  return new Promise((resolve, reject) => {
    mineTx.on('error', (message) => {
      reject(new Error(message))
    })
    mineTx.on('unexpected-error', (message) => {
      reject(new Error(message))
    })
    mineTx.on('success', (data) => {
      tx.parents = data.parents
      tx.timestamp = data.timestamp
      tx.nonce = data.nonce
      tx.weight = data.weight
      resolve(tx.toHex())
    })
    mineTx.start()
  })

}

module.exports.buildHathorTokenTransferTransaction = async function ({ inputs, outputs, inputPrivateKeys, tokens, inputsSum, changeAddress, testnet }) {

  const txData = {
    inputs: inputs.map((input) => ({ tx_id: input.txHash, index: input.index })),
    outputs: outputs.map(output => ({ address: output.address, value: toHTRUnit(output.amount).toNumber() })),
    tokens,
  }

  const outputsSum = hathorLib.transaction.getOutputsSum(txData.outputs)

  if (outputsSum < inputsSum) {
    txData.outputs.push({
      address: changeAddress,
      value: (inputsSum - outputsSum)
    });

  } else if (outputsSum > inputsSum) {
    throw new GenericException("Insufficient funds")
  }

  // console.debug("txData", txData);

  hathorLib.transaction.completeTx(txData)
  
  const dataToSign = hathorLib.transaction.dataToSign(txData)
  const hashbuf = hathorLib.transaction.getDataToSignHash(dataToSign)
  const network = hathorLib.network.getNetwork(testnet ? 'testnet' : 'mainnet')
  
  for (let i = 0; i < inputs.length; ++i) {
    const privateKey = bitcoreLib.PrivateKey(inputPrivateKeys[i], network)
    const sig = bitcoreLib.crypto.ECDSA.sign(hashbuf, privateKey, 'little').set({
      nhashtype: bitcoreLib.crypto.Signature.SIGHASH_ALL,
    })
    txData.inputs[i]['data'] = hathorLib.transaction.createInputData(sig.toDER(), privateKey.toPublicKey().toBuffer())
  }

  hathorLib.transaction.verifyTxData(txData)
  hathorLib.transaction.setWeightIfNeeded(txData)

  const tx = hathorLib.helpersUtils.createTxFromData(txData)
  const mineTx = new mineTransaction.default(tx)

  return new Promise((resolve, reject) => {
    mineTx.on('error', (message) => {
      reject(new Error(message))
    })
    mineTx.on('unexpected-error', (message) => {
      reject(new Error(message))
    })
    mineTx.on('success', (data) => {
      tx.parents = data.parents
      tx.timestamp = data.timestamp
      tx.nonce = data.nonce
      tx.weight = data.weight
      resolve(tx.toHex())
    })
    mineTx.start()
  })

}
