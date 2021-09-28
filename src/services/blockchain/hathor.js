const bitcoreLib = require('bitcore-lib')
const hathorLib = require('@hathor/wallet-lib')
const mineTransaction = require('@hathor/wallet-lib/lib/wallet/mineTransaction')
const { toHTRUnit } = require('./utils')
const { GenericException } = require('../../../errors')

hathorLib.transaction.updateMaxInputsConstant(256)
hathorLib.transaction.updateMaxOutputsConstant(256)
hathorLib.transaction.updateTransactionWeightConstants(14, 1.6, 100)


module.exports.buildHathorTransferTransaction = async function ({ inputs, outputs, tokens, testnet }) {
  let txData = {
    inputs: inputs.map((input) => ({ tx_id: input.txHash, index: input.index })),
    outputs: outputs.map(output => ({ address: output.address, value: toHTRUnit(output.amount).toNumber(), tokenData: output.tokenData })),
    tokens,
  }
  
  hathorLib.transaction.completeTx(txData)

  const dataToSign = hathorLib.transaction.dataToSign(txData)
  const hashbuf = hathorLib.transaction.getDataToSignHash(dataToSign)
  const network = hathorLib.network.getNetwork(testnet ? 'testnet' : 'mainnet')
  for (let i = 0; i < inputs.length; ++i) {
    const privateKey = bitcoreLib.PrivateKey(inputs[i].privateKey, network)
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


module.exports.buildHathorTokenTransaction = async function ({ inputs, params, inputsSum, testnet }) {

  const txData = {
    inputs: inputs.map((input) => ({ tx_id: input.txHash, index: input.index })),
    outputs: [],
    tokens: []
  }

  const DepositAmount = hathorLib.tokensUtils.getDepositAmount(params.amount);
  // const outputsSum = hathorLib.transaction.getOutputsSum(txData.outputs)

  if (DepositAmount < inputsSum) {
    txData.outputs.push({
      address: params.change_address,
      value: (inputsSum - DepositAmount),
      // tokenData: '0090bf2b797d0305a9092c7452036ac13dbb1eac044da2005631275a7a9cd2b2'
    });

  } else if (DepositAmount > inputsSum) {
    throw new GenericException("Insufficient funds")
  }
  hathorLib.transaction.completeTx(txData)

  const dataToSign = hathorLib.transaction.dataToSign(txData)

  const hashbuf = hathorLib.transaction.getDataToSignHash(dataToSign)
  const network = hathorLib.network.getNetwork(testnet ? 'testnet' : 'mainnet')

  for (let i = 0; i < inputs.length; ++i) {
    const privateKey = bitcoreLib.PrivateKey(inputs[i].privateKey, network)
    const sig = bitcoreLib.crypto.ECDSA.sign(hashbuf, privateKey, 'little').set({
      nhashtype: bitcoreLib.crypto.Signature.SIGHASH_ALL,
    })
    txData.inputs[i]['data'] = hathorLib.transaction.createInputData(sig.toDER(), privateKey.toPublicKey().toBuffer())
  }

  hathorLib.transaction.verifyTxData(txData)
  hathorLib.transaction.setWeightIfNeeded(txData)

  const token = new hathorLib.CreateTokenTransaction(params.name, params.symbol, txData.inputs, txData.outputs);
  const tx = hathorLib.helpersUtils.createTxFromData(token)


  console.log(tx);

  const mineTx = new mineTransaction.default(tx, {
    maxTxMiningRetries: 100
  })

  mineTx.start()
  await mineTx.promise
  console.log("mineTx", mineTx);

}
