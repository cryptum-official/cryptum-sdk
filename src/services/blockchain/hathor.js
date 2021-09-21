const bitcoreLib = require('bitcore-lib')
const hathorLib = require('@hathor/wallet-lib')
const walletApi = require('@hathor/wallet-lib/lib/wallet/api/walletApi')
const mineTransaction = require('@hathor/wallet-lib/lib/wallet/mineTransaction')
const { toHTRUnit } = require('./utils')
// const { storageFactory } = require('storage-factory');

// hathorLib.storage.setStore(new hathorLib.MemoryStore())
hathorLib.transaction.updateMaxInputsConstant(256)
hathorLib.transaction.updateMaxOutputsConstant(256)
hathorLib.transaction.updateTransactionWeightConstants(14, 1.6, 100)

module.exports.buildHathorTransferTransaction = async function ({ wallet, outputs }) {
  const network = new hathorLib.Network(wallet.testnet ? 'testnet' : 'mainnet')
  const walletService = new hathorLib.HathorWalletServiceWallet(wallet.mnemonic, network)
  await walletService.start()

  let txData = { outputs: [] }

  for (let j = 0; j < outputs.length; j++) {
    let address = new hathorLib.Address(outputs[j].address)
    let P2PKH = new hathorLib.P2PKH(address)
    let script = P2PKH.createScript()

    txData.outputs[j] = {
      value: outputs[j].amount,
      address: outputs[j].address,
      script: script,
      tokenData: 0,
      token: outputs[j].token,
    }
  }

  const allAddress = await walletService.getAllAddresses()
  const changeAddress = await allAddress.next()
  console.log(allAddress)
  const options = {
    outputs: txData.outputs,
    // inputs: txData.inputs,
    changeAddress: changeAddress.value.address,
  }

  const TransactionService = new hathorLib.SendTransactionWalletService(walletService, options)

  const sign = await TransactionService.run()
  const toHex = sign.toHex()

  console.log('2HEX: ', toHex)

  // const proposal = await walletApi.default.createTxProposal(walletService, toHex);
  // const updateTxProposal = await walletApi.default.updateTxProposal(walletService, "b057c928-fab4-477a-af15-3710b4ded43b", toHex);
  // console.log(updateTxProposal)

  return toHex
}

async function _buildHathorSendTokenTransaction({ inputs, outputs, tokens, inputPrivateKeys, testnet }) {
  const txData = {
    inputs: inputs.map((input) => ({ tx_id: input.txHash, index: input.index })),
    outputs: outputs.map(output => ({ address: output.address, value: toHTRUnit(output.amount).toNumber() })),
    tokens,
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
// _buildHathorSendTokenTransaction({
//   inputs: [
//     {
//       index: 1,
//       txHash: '0000325057cdcaecac0fef1ae5b2d7ecd4bd5d681a4bb6eb9135a994ace5cfe0',
//     },
//   ],
//   outputs: [
//     {
//       address: 'Wj2naTrfbE7ffBLK9pjR1Eb8TwbBcBE5Ya',
//       amount: '0.16',
//     },
//     {
//       address: 'WgzYfVxZiL7bCN37Wj8myVY9HKZ5GCACsh',
//       amount: '39.6',
//     },
//   ],
//   tokens: [],
//   inputPrivateKeys: ['9f60ed4f3cf1fca40c29f182a963e1a763f975e5155c5ffc69d7eb8abb8c20fb'],
//   testnet: true,
// })
//   .then(console.log)
//   .catch(console.error)
