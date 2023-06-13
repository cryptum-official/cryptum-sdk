const bitcoreLib = require('bitcore-lib')
const hathorLib = require('@hathor/wallet-lib')
const mineTransaction = require('@hathor/wallet-lib/lib/wallet/mineTransaction')
const { toHTRUnit } = require('./utils')
const { HathorException } = require('../../errors')
const { default: BigNumber } = require('bignumber.js')
const { TransactionType } = require('../../features/transaction/entity')

hathorLib.transaction.updateMaxInputsConstant(hathorLib.constants.MAX_INPUTS)
hathorLib.transaction.updateMaxOutputsConstant(hathorLib.constants.MAX_OUTPUTS)
hathorLib.transaction.updateTransactionWeightConstants(
  hathorLib.constants.TX_WEIGHT_CONSTANTS.txMinWeight,
  hathorLib.constants.TX_WEIGHT_CONSTANTS.txWeightCoefficient,
  hathorLib.constants.TX_WEIGHT_CONSTANTS.txMinWeightK
)

function getInputOutputAmountsCheck({ inputs, outputs, tokens }) {
  const tokenAmounts = {}
  for (let token of tokens) {
    const inputSum = inputs
      .filter((input) => input.token === token)
      .reduce((prev, cur) => new BigNumber(prev).plus(cur.value), new BigNumber(0))
    const outputSum = outputs
      .filter((input) => input.token === token)
      .reduce((prev, cur) => new BigNumber(prev).plus(cur.value), new BigNumber(0))
    if (inputSum.gt(outputSum)) {
      tokenAmounts[token] = {
        value: parseInt(inputSum.minus(outputSum).toFixed(0)),
      }
    } else if (inputSum.lt(outputSum)) {
      throw new HathorException(`Inputs and outputs values are different for token ${token === '00' ? 'HTR' : token}`)
    }
  }
  return tokenAmounts
}
function getTokenDataIndex(output, tokens) {
  let tokenIndex = -1
  if (output.token === 'HTR' || output.token === '00' || output.token == null) {
    tokenIndex = 0
  } else {
    const i = tokens.findIndex((t) => t === output.token)
    tokenIndex = tokens[0] === '00' ? i : i + 1
  }
  return tokenIndex
}

module.exports.buildHathorTransferTransaction = async function ({ inputs, outputs, tokens, changeAddress, testnet }) {
  hathorLib.network.setNetwork(testnet ? 'testnet' : 'mainnet');
  let txData = {
    inputs: inputs.map((input) => ({ tx_id: input.txHash, index: input.index })),
    outputs: outputs.map((output) => ({
      address: output.address,
      value: toHTRUnit(output.amount).toNumber(),
      tokenData: getTokenDataIndex(output, tokens),
    })),
    tokens: tokens.map((token) => (token === 'HTR' ? '00' : token)).filter((token) => token !== '00'),
  }
  const tokenAmountsCheck = getInputOutputAmountsCheck({
    inputs,
    outputs: outputs.map((o) => ({ ...o, value: toHTRUnit(o.amount).toNumber() })),
    tokens,
  })
  if (changeAddress) {
    for (let token in tokenAmountsCheck) {
      txData.outputs.push({
        address: changeAddress,
        value: tokenAmountsCheck[token].value,
        tokenData: getTokenDataIndex({ token }, tokens),
      })
    }
  }
  hathorLib.transaction.completeTx(txData)
  const dataToSign = hathorLib.transaction.dataToSign(txData)
  const hashbuf = hathorLib.transaction.getDataToSignHash(dataToSign)
  const networkName = testnet ? 'testnet' : 'mainnet'
  const network = new hathorLib.Network(networkName)
  for (let i = 0; i < inputs.length; ++i) {
    const privateKey = bitcoreLib.PrivateKey(inputs[i].privateKey, networkName)
    const sig = bitcoreLib.crypto.ECDSA.sign(hashbuf, privateKey, 'little').set({
      nhashtype: bitcoreLib.crypto.Signature.SIGHASH_ALL,
    })
    txData.inputs[i]['data'] = hathorLib.transaction.createInputData(sig.toDER(), privateKey.toPublicKey().toBuffer())
  }

  hathorLib.transaction.verifyTxData(txData)
  hathorLib.transaction.setWeightIfNeeded(txData)
  const tx = hathorLib.helpersUtils.createTxFromData(txData, network)
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

module.exports.buildHathorTokenTransaction = async function ({
  inputs,
  tokenName,
  tokenSymbol,
  address,
  changeAddress,
  mintAuthorityAddress,
  meltAuthorityAddress,
  amount,
  inputSum,
  tokenUid,
  type,
  nftData,
  testnet,
}) {
  hathorLib.network.setNetwork(testnet ? 'testnet' : 'mainnet');
  let txData = {
    inputs: inputs.map((input) => ({ tx_id: input.txHash, index: input.index })),
    outputs: []
  }
  const isNFT = !!nftData || [TransactionType.HATHOR_NFT_MELT, TransactionType.HATHOR_NFT_MINT].includes(type)
  let tokenAmount = isNFT ? parseInt(amount) : toHTRUnit(amount).toNumber()
  const _dataToken =
    [TransactionType.HATHOR_TOKEN_MELT, TransactionType.HATHOR_NFT_MELT].includes(type)
      ? txData
      : hathorLib.tokens.createMintData(null, null, address, tokenAmount, txData, {
        changeAddress: changeAddress,
        createAnotherMint: false,
        createMelt: false,
        isNFT,
      })

  if (type === TransactionType.HATHOR_TOKEN_CREATION) {
    _dataToken.version = hathorLib.constants.CREATE_TOKEN_TX_VERSION
    _dataToken.name = tokenName
    _dataToken.symbol = tokenSymbol

    if (isNFT) {
      // After the transaction data is completed
      // if it's an NFT I must add the first output as the data script
      // For NFT data the value is always 0.01 HTR (i.e. 1 integer)
      _dataToken.outputs.unshift({
        type: 'data',
        data: nftData,
        value: 1,
        tokenData: 0
      })
    }

  } else if ([
    TransactionType.HATHOR_NFT_MELT, TransactionType.HATHOR_NFT_MINT, TransactionType.HATHOR_TOKEN_MELT, TransactionType.HATHOR_TOKEN_MINT
  ].includes(type)) {
    _dataToken.version = hathorLib.constants.DEFAULT_TX_VERSION
    _dataToken.tokens = [tokenUid]
  } else {
    throw new HathorException('Invalid transaction type')
  }
  if ([TransactionType.HATHOR_NFT_MELT, TransactionType.HATHOR_TOKEN_MELT].includes(type)) {
    if (inputSum > tokenAmount) {
      _dataToken.outputs.push({
        address: changeAddress,
        value: inputSum - tokenAmount,
        tokenData: 1
      })
    }
    const withdrawAmountHTR = Math.floor(new BigNumber(tokenAmount).times(0.01).toNumber())
    if (withdrawAmountHTR > 0) {
      _dataToken.outputs.push({
        address,
        value: withdrawAmountHTR,
        tokenData: hathorLib.constants.HATHOR_TOKEN_INDEX,
      })
    }
  } else {
    const depositAmountHTR = Math.ceil(new BigNumber(tokenAmount).times(0.01).toNumber())
    if (depositAmountHTR < inputSum) {
      _dataToken.outputs.push({
        address: changeAddress,
        value: inputSum - depositAmountHTR - (isNFT && type === TransactionType.HATHOR_TOKEN_CREATION ? 1 : 0),
        tokenData: hathorLib.constants.HATHOR_TOKEN_INDEX,
      })
    } else {
      throw new HathorException('Insufficient funds')
    }
  }
  if (mintAuthorityAddress) {
    _dataToken.outputs.push({
      address: mintAuthorityAddress,
      value: hathorLib.constants.TOKEN_MINT_MASK,
      tokenData: hathorLib.constants.AUTHORITY_TOKEN_DATA,
    })
  }
  if (meltAuthorityAddress) {
    _dataToken.outputs.push({
      address: meltAuthorityAddress,
      value: hathorLib.constants.TOKEN_MELT_MASK,
      tokenData: hathorLib.constants.AUTHORITY_TOKEN_DATA,
    })
  }

  hathorLib.transaction.completeTx(_dataToken)
  const dataToSign = hathorLib.transaction.dataToSign(_dataToken)
  const hashbuf = hathorLib.transaction.getDataToSignHash(dataToSign)
  const networkName = testnet ? 'testnet' : 'mainnet'
  const network = new hathorLib.Network(networkName)

  for (let i = 0; i < inputs.length; ++i) {
    const privateKey = bitcoreLib.PrivateKey(inputs[i].privateKey, networkName)
    const sig = bitcoreLib.crypto.ECDSA.sign(hashbuf, privateKey, 'little').set({
      nhashtype: bitcoreLib.crypto.Signature.SIGHASH_ALL,
    })
    _dataToken.inputs[i]['data'] = hathorLib.transaction.createInputData(
      sig.toDER(),
      privateKey.toPublicKey().toBuffer()
    )
  }
  hathorLib.transaction.verifyTxData(_dataToken)
  hathorLib.transaction.setWeightIfNeeded(_dataToken)
  const tx = hathorLib.helpersUtils.createTxFromData(_dataToken, network)
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
