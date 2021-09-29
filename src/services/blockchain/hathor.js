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


module.exports.buildHathorTokenTransaction = async function ({ inputs, params, inputsSum, mint_address, melt_address, testnet }) {

  let txData = {
    inputs: inputs.map((input) => ({ tx_id: input.txHash, index: input.index })),
  };

  const _dataToken = hathorLib.tokens.createMintData(null, null, params.address, params.amount, txData, {
    changeAddress: params.change_address,
    createAnotherMint: false,
    createMelt: false
  })

  _dataToken.version = hathorLib.constants.CREATE_TOKEN_TX_VERSION;
  _dataToken.name = params.name;
  _dataToken.symbol = params.symbol;

  const DepositAmount = hathorLib.tokensUtils.getDepositAmount(params.amount);

  if (DepositAmount < inputsSum) {
    _dataToken.outputs.push({
      address: params.change_address,
      value: (inputsSum - DepositAmount),
      tokenData: hathorLib.constants.HATHOR_TOKEN_INDEX
    });
  } else if (DepositAmount > inputsSum) {
    throw new GenericException("Insufficient funds")
  }

  if (mint_address) {
    _dataToken.outputs.push({
      'address': mint_address,
      'value': hathorLib.constants.TOKEN_MINT_MASK,
      'tokenData': hathorLib.constants.AUTHORITY_TOKEN_DATA
    });
  }

  if (melt_address) {
    _dataToken.outputs.push({
      'address': melt_address,
      'value': hathorLib.constants.TOKEN_MELT_MASK,
      'tokenData': hathorLib.constants.AUTHORITY_TOKEN_DATA
    });
  }

  hathorLib.transaction.completeTx(_dataToken)

  const dataToSign = hathorLib.transaction.dataToSign(_dataToken)
  const hashbuf = hathorLib.transaction.getDataToSignHash(dataToSign)
  const network = hathorLib.network.getNetwork(testnet ? 'testnet' : 'mainnet')

  for (let i = 0; i < inputs.length; ++i) {
    const privateKey = bitcoreLib.PrivateKey(inputs[i].privateKey, network)
    const sig = bitcoreLib.crypto.ECDSA.sign(hashbuf, privateKey, 'little').set({
      nhashtype: bitcoreLib.crypto.Signature.SIGHASH_ALL,
    })
    _dataToken.inputs[i]['data'] = hathorLib.transaction.createInputData(sig.toDER(), privateKey.toPublicKey().toBuffer());
  }
  console.log(_dataToken);
  hathorLib.transaction.verifyTxData(_dataToken);
  hathorLib.transaction.setWeightIfNeeded(_dataToken);

  const tx = hathorLib.helpersUtils.createTxFromData(_dataToken);
  const mineTx = new mineTransaction.default(tx);

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
