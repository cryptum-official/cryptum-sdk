module.exports.getTransactionControllerInstance = (config) => new Controller(config)
const BigNumber = require('bignumber.js')
const { handleRequestError, getApiMethod, mountHeaders, makeRequest } = require('../../../services')
const requests = require('./requests.json')
const Interface = require('./interface')
const { Protocol } = require('../../../services/blockchain/constants')
const { toHTRUnit } = require('../../../services/blockchain/utils')
const { FeeResponse, TransactionResponse, SignedTransaction, UTXO, TransactionType, Input } = require('../entity')
const { buildStellarTransferTransaction, buildStellarTrustlineTransaction } = require('../../../services/blockchain/stellar')
const { buildRippleTransferTransaction, buildRippleTrustlineTransaction } = require('../../../services/blockchain/ripple')

const {
  buildSolanaTransferTransaction,
  deploySolanaToken,
  deploySolanaNFT,
  mintEdition,
  buildSolanaTokenBurnTransaction,
  updateMetaplexMetadata,
  buildSolanaCustomProgramInteraction,
  mintSolanaToken,
  updateAuctionAuthority,
  updateVaultAuthority,
  validateAuction,
  whitelistCreators,
  deploySolanaCollection,
} = require('../../../services/blockchain/solana')
const { buildBitcoinTransferTransaction } = require('../../../services/blockchain/bitcoin')
const { getWalletControllerInstance } = require('../../wallet/controller')
const { GenericException, HathorException } = require('../../../errors')
const {
  validateCeloTransferTransactionParams,
  validateBitcoinTransferTransactionParams,
  validateSignedTransaction,
  validateRippleTransferTransactionParams,
  validateStellarTransferTransactionParams,
  validateStellarTrustlineTransactionParams,
  validateRippleTrustlineTransactionParams,
  validateEthereumTransferTransactionParams,
  validateHathorTokenTransactionFromUTXO,
  validateHathorTokenTransactionFromWallet,
  validateHathorTransferTransactionFromWallet,
  validateHathorTransferTransactionFromUTXO
} = require('../../../services/validations')
const { buildHathorTransferTransaction, buildHathorTokenTransaction } = require('../../../services/blockchain/hathor')
const { buildOperation, buildOperationFromInputs } = require('../../../services/blockchain/cardano')
const CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs')
const { isTestnet } = require('../../../services/utils')
const { getTokenControllerInstance } = require('../../token/controller')
const {
  validateSolanaCollectionInput,
  validateSolanaNFTInput,
  validateSolanaTransferTransaction,
  validateSolanaDeployTransaction,
  validateSolanaDeployNFT,
  validateSolanaCustomProgramInput
} = require('../../../services/validations/solana')


class Controller extends Interface {
  /**
   * Method to send an transaction to Cryptum
   *
   * @param {SignedTransaction} transaction object with all transaction data
   * @returns {Promise<TransactionResponse>}
   */
  async sendTransaction(transaction) {
    try {
      validateSignedTransaction(transaction)
      const { protocol, signedTx, type } = transaction
      const response = await makeRequest({ method: 'post', url: `/tx?protocol=${protocol}`, body: { signedTx, type }, config: this.config })
      return new TransactionResponse(response)
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Method to get fee info
   *
   * @param {object} input
   * @param {string} input.type
   * @param {string=} input.from
   * @param {string=} input.destination
   * @param {string=} input.assetSymbol
   * @param {string=} input.contractAddress
   * @param {string=} input.method
   * @param {Array=} input.params
   * @param {Protocol} input.protocol
   * @param {string} input.amount
   * @param {string=} input.contractName
   * @param {string=} input.source
   * @param {string=} input.feeCurrency
   */
  async getFee({
    type = null,
    from = null,
    amount = null,
    destination = null,
    contractAddress = null,
    contractAbi = null,
    method = null,
    params = null,
    protocol,
    contractName = null,
    source = null,
    feeCurrency = null,
    tokenType = null,
    numInputs = null,
    numOutputs = null
  }) {
    try {
      const data = {}
      if (type) data.type = type
      if (from) data.from = from
      if (destination) data.destination = destination
      if (amount) data.amount = amount
      if (contractAddress) data.contractAddress = contractAddress
      if (contractAbi) data.contractAbi = contractAbi
      if (method) data.method = method
      if (params) data.params = params
      if (contractName) data.contractName = contractName
      if (source) data.source = source
      if (feeCurrency) data.feeCurrency = feeCurrency
      if (tokenType) data.tokenType = tokenType
      if (numInputs) data.numInputs = numInputs
      if (numOutputs) data.numOutputs = numOutputs
      const response = await makeRequest({ method: 'post', url: `/fee?protocol=${protocol}`, body: data, config: this.config })
      return new FeeResponse(response)
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Get UTXOs from address
   *
   * @param {object} input
   * @param {string} input.address
   * @param {Protocol} input.protocol
   * @returns {Promise<Array<import('../entity').UTXOResponse>>}
   */
  async getUTXOs({ address, protocol }) {
    try {
      const apiRequest = getApiMethod({
        requests,
        key: 'getUTXOs',
        config: this.config,
      })
      const headers = mountHeaders(this.config.apiKey)
      const response = await apiRequest(`${requests.getUTXOs.url}/${address}?protocol=${protocol}`, {
        headers,
      })
      return Array.isArray(response.data) && response.data.map((utxo) => new UTXO(utxo))
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Get transaction by hash (tx id)
   *
   * @param {object} input
   * @param {string} input.hash transaction hash
   * @param {Protocol} input.protocol blockchain protocol
   */
  async getTransactionByHash({ hash, protocol }) {
    try {
      const apiRequest = getApiMethod({
        requests,
        key: 'getTransactionByHash',
        config: this.config,
      })
      const headers = mountHeaders(this.config.apiKey)
      const response = await apiRequest(`${requests.getTransactionByHash.url}/${hash}?protocol=${protocol}`, {
        headers,
      })
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Get transaction receipt by hash (tx id)
   *
   * @param {object} input
   * @param {string} input.hash transaction hash
   * @param {Protocol} input.protocol blockchain protocol
   */
  async getTransactionReceiptByHash({ hash, protocol }) {
    try {
      return await makeRequest({ method: 'get', url: `/transaction/${hash}/receipt?protocol=${protocol}`, config: this.config })
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
 * Get proxy address by hash (tx id)
 *
 * @param {object} input
 * @param {string} input.hash transaction hash
 * @param {Protocol} input.protocol blockchain protocol
 * @returns {Promise<{ address:string }>}
 */
  async getProxyAddressByHash({ hash, protocol }) {
    try {
      return await makeRequest({ method: 'get', url: `/transaction/${hash}/proxy?protocol=${protocol}`, config: this.config })
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Get block info
   *
   * @param {object} input
   * @param {string} input.block block number or hash
   * @param {Protocol} input.protocol blockchain protocol
   */
  async getBlock({ block, protocol }) {
    try {
      return await makeRequest({ url: `/block/${block}?protocol=${protocol}`, config: this.config })
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Create stellar trustline transaction
   *
   * @param {import('../entity').StellarTrustlineTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createStellarTrustlineTransaction(input) {
    validateStellarTrustlineTransactionParams(input)
    const { wallet, assetSymbol, issuer, fee, limit, memo } = input
    const protocol = Protocol.STELLAR
    const info = await getWalletControllerInstance(this.config).getWalletInfo({
      address: wallet.publicKey,
      protocol,
    })
    let networkFee = fee
    if (!networkFee) {
      const { estimateValue } = await this.getFee({
        type: TransactionType.CHANGE_TRUST,
        protocol,
      })
      networkFee = estimateValue
    }
    const signedTx = await buildStellarTrustlineTransaction({
      fromPublicKey: wallet.publicKey,
      fromPrivateKey: wallet.privateKey,
      assetSymbol,
      issuer,
      limit,
      memo,
      fee: networkFee,
      sequence: info.sequence,
      testnet: isTestnet(this.config.environment),
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.CHANGE_TRUST })
  }
  /**
   * Create ripple trustline transaction
   *
   * @param {import('../entity').RippleTrustlineTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createRippleTrustlineTransaction(input) {
    validateRippleTrustlineTransactionParams(input)
    const { wallet, assetSymbol, issuer, fee, limit, memo } = input
    const protocol = Protocol.RIPPLE
    const info = await getWalletControllerInstance(this.config).getWalletInfo({
      address: wallet.address,
      protocol,
    })
    let networkFee = fee
    if (!networkFee) {
      const { estimateValue } = await this.getFee({
        type: TransactionType.CHANGE_TRUST,
        protocol,
      })
      networkFee = estimateValue
    }
    const signedTx = await buildRippleTrustlineTransaction({
      fromAddress: wallet.address,
      fromPrivateKey: wallet.privateKey,
      assetSymbol,
      issuer,
      limit,
      memo,
      fee: networkFee,
      sequence: info.sequence,
      maxLedgerVersion: info.ledgerCurrentIndex + 10,
      testnet: isTestnet(this.config.environment),
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.CHANGE_TRUST })
  }
  /**
   * Create stellar transfer transaction
   *
   * @param {import('../entity').StellarTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createStellarTransferTransaction(input) {
    validateStellarTransferTransactionParams(input)
    const { wallet, assetSymbol, issuer, amount, destination, memo, fee, createAccount } = input
    const protocol = Protocol.STELLAR
    const info = await getWalletControllerInstance(this.config).getWalletInfo({
      address: wallet.publicKey,
      protocol,
    })
    let networkFee = fee
    if (!networkFee) {
      const { estimateValue } = await this.getFee({
        type: TransactionType.TRANSFER,
        protocol,
      })
      networkFee = estimateValue
    }
    const signedTx = await buildStellarTransferTransaction({
      fromPublicKey: wallet.publicKey,
      fromPrivateKey: wallet.privateKey,
      assetSymbol,
      issuer,
      amount,
      destination,
      memo,
      fee: networkFee,
      sequence: info.sequence,
      testnet: isTestnet(this.config.environment),
      createAccount,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create ripple transfer transaction
   *
   * @param {import('../entity').RippleTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createRippleTransferTransaction(input) {
    validateRippleTransferTransactionParams(input)
    const { wallet, assetSymbol, issuer, amount, destination, memo, fee } = input
    const protocol = Protocol.RIPPLE
    const info = await getWalletControllerInstance(this.config).getWalletInfo({
      address: wallet.address,
      protocol,
    })
    let networkFee = fee
    if (!networkFee) {
      const { estimateValue } = await this.getFee({
        type: TransactionType.TRANSFER,
        protocol,
      })
      networkFee = estimateValue
    }
    const signedTx = await buildRippleTransferTransaction({
      fromAddress: wallet.address,
      fromPrivateKey: wallet.privateKey,
      assetSymbol,
      issuer,
      amount,
      destination,
      memo,
      fee: networkFee,
      sequence: info.sequence,
      maxLedgerVersion: info.ledgerCurrentIndex + 10,
      testnet: isTestnet(this.config.environment),
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create celo transfer transaction
   *
   * @param {import('../entity').CeloTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createCeloTransferTransaction(input) {
    validateCeloTransferTransactionParams(input)
    const { amount, contractAddress, destination, fee, feeCurrency, memo, tokenSymbol, wallet } = input;
    const tc = getTokenControllerInstance(this.config)
    return await tc.transfer({ amount, protocol: "CELO", token: contractAddress ? contractAddress : tokenSymbol, wallet, destination, fee, memo, feeCurrency })

  }
  /**
   * Create ethereum transfer transaction
   *
   * @param {import('../entity').EthereumTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createEthereumTransferTransaction(input) {
    validateEthereumTransferTransactionParams(input)
    const { amount, contractAddress, destination, fee, tokenSymbol, wallet } = input;
    const tc = getTokenControllerInstance(this.config)
    return await tc.transfer({ amount, protocol: "ETHEREUM", token: contractAddress ? contractAddress : tokenSymbol, wallet, destination, fee })
  }
  /**
   * Create bsc transfer transaction
   *
   * @param {EthereumTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createBscTransferTransaction(input) {
    validateEthereumTransferTransactionParams(input)
    const { amount, contractAddress, destination, fee, tokenSymbol, wallet } = input;
    const tc = getTokenControllerInstance(this.config)
    return await tc.transfer({ amount, protocol: "BSC", token: contractAddress ? contractAddress : tokenSymbol, wallet, destination, fee })
  }
  /**
   * Create polygon transfer transaction
   *
   * @param {EthereumTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createPolygonTransferTransaction(input) {
    validateEthereumTransferTransactionParams(input)
    const { amount, contractAddress, destination, fee, tokenSymbol, wallet } = input;
    const tc = getTokenControllerInstance(this.config)
    return await tc.transfer({ amount, protocol: "POLYGON", token: contractAddress ? contractAddress : tokenSymbol, wallet, destination, fee })
  }
  /**
  * Create avalanche transfer transaction
  *
  * @param {EthereumTransferTransactionInput} input
  * @returns {Promise<SignedTransaction>} signed transaction data
  */
  async createAvaxCChainTransferTransaction(input) {
    validateEthereumTransferTransactionParams(input)
    const { amount, contractAddress, destination, fee, tokenSymbol, wallet } = input;
    const tc = getTokenControllerInstance(this.config)
    return await tc.transfer({ amount, protocol: "AVAXCCHAIN", token: contractAddress ? contractAddress : tokenSymbol, wallet, destination, fee })
  }
  /**
   * Create bitcoin transfer transaction
   *
   * @param {import('../entity').BitcoinTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createBitcoinTransferTransaction(input) {
    validateBitcoinTransferTransactionParams(input)
    let { wallet, inputs, outputs, fee } = input
    const protocol = Protocol.BITCOIN
    if (wallet) {
      const utxos = await this.getUTXOs({ address: wallet.address, protocol })
      inputs = []
      for (let i = 0; i < utxos.length; ++i) {
        inputs[i] = new Input({ ...utxos[i], privateKey: wallet.privateKey })
      }
    } else if (inputs) {
      for (let i = 0; i < inputs.length; ++i) {
        const tx = await this.getTransactionByHash({ hash: inputs[i].txHash, protocol })
        if (!tx.vout[inputs[i].index]) {
          throw new GenericException(`Invalid UTXO hash ${inputs[i].txHash}`, 'InvalidParams')
        }
        inputs[i].value = tx.vout[inputs[i].index].value
        inputs[i].hex = tx.hex
        inputs[i].blockhash = tx.blockhash
      }
    }

    const signedTx = await buildBitcoinTransferTransaction({
      wallet,
      inputs,
      outputs,
      fee,
      testnet: isTestnet(this.config.environment),
      config: this.config
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }

  async _getFeeInfo({
    wallet,
    type,
    destination,
    amount,
    contractAddress,
    contractAbi,
    method,
    params,
    fee,
    feeCurrency,
    protocol,
    contractName,
    source,
    tokenType,
  }) {
    const [info, networkFee] = await Promise.all([
      getWalletControllerInstance(this.config).getWalletInfo({
        address: wallet.address,
        protocol,
      }),
      this.getFee({
        type,
        from: wallet.address,
        destination,
        amount,
        method,
        params,
        contractAddress,
        contractAbi,
        protocol,
        contractName,
        source,
        tokenType,
        feeCurrency,
      }),
    ])
    if (fee && fee.gas) networkFee.gas = fee && fee.gas
    if (fee && fee.gasPrice) networkFee.gasPrice = fee && fee.gasPrice
    return { info, networkFee }
  }
  /**
   * Create transfer tokens transaction in Hathor blockchain
   * @param {import('../entity').HathorTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>}
   */
  async createHathorTransferTransactionFromWallet(input) {
    validateHathorTransferTransactionFromWallet(input)
    let { wallet, outputs } = input
    const protocol = Protocol.HATHOR
    const utxos = await this.getUTXOs({ address: wallet.address, protocol })
    if (utxos.length === 0) {
      throw new GenericException('No available UTXOs')
    }
    const tokenSet = new Set()
    for (let i = 0; i < outputs.length; ++i) {
      if (outputs[i].token === 'HTR' || outputs[i].token == null) {
        outputs[i].token = '00'
      }
      tokenSet.add(outputs[i].token)
    }
    const tokens = Array.from(tokenSet).filter((i) => i)
    const inputs = []
    for (let i = 0; i < utxos.length; ++i) {
      if (tokens.includes(utxos[i].token)) {
        const tx = await this.getTransactionByHash({ hash: utxos[i].txHash, protocol })
        if (
          utxos[i].token === '00' ||
          (utxos[i].token !== '00' && ![0, 129].includes(tx.tx.outputs[utxos[i].index].token_data))
        ) {
          inputs.push({
            ...utxos[i],
            privateKey: wallet.privateKey,
          })
        }
      }
    }
    const signedTx = await buildHathorTransferTransaction({
      inputs,
      outputs,
      tokens,
      changeAddress: wallet.address,
      testnet: isTestnet(this.config.environment),
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create transfer tokens transaction in Hathor blockchain
   * @param {import('../entity').HathorTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>}
   */
  async createHathorTransferTransactionFromUTXO(input) {
    validateHathorTransferTransactionFromUTXO(input)
    let { inputs, outputs } = input

    const protocol = Protocol.HATHOR
    const tokenSet = new Set()
    for (let i = 0; i < outputs.length; ++i) {
      if (outputs[i].token === 'HTR' || outputs[i].token == null) {
        outputs[i].token = '00'
      }
      tokenSet.add(outputs[i].token)
    }
    const tokens = Array.from(tokenSet).filter((i) => i)
    for (let i = 0; i < inputs.length; ++i) {
      const tx = await this.getTransactionByHash({ hash: inputs[i].txHash, protocol })
      const utxo = tx.tx.outputs[inputs[i].index]
      inputs[i].value = utxo.value
      inputs[i].token = utxo.token_data === 0 ? '00' : tx.tx.tokens[utxo.token_data - 1].uid
    }

    const signedTx = await buildHathorTransferTransaction({
      inputs,
      outputs,
      tokens,
      testnet: isTestnet(this.config.environment),
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create Hathor token transaction using wallet
   * @param {import('../entity').HathorTokenTransactionFromWalletInput} input
   * @returns {Promise<SignedTransaction>}
   */
  async createHathorTokenTransactionFromWallet(input) {
    validateHathorTokenTransactionFromWallet(input)
    let {
      wallet,
      tokenName,
      tokenSymbol,
      type,
      tokenUid,
      mintAuthorityAddress,
      meltAuthorityAddress,
      amount,
      address,
      changeAddress,
      nftData,
    } = input
    const protocol = Protocol.HATHOR
    let inputSum = 0
    let amountHTRUnit;
    if (nftData && type === TransactionType.HATHOR_TOKEN_CREATION) {
      amountHTRUnit = Math.ceil(new BigNumber(amount).times(0.0001).plus(0.01).times(100).toNumber())
    } else if (type === TransactionType.HATHOR_NFT_MINT || type === TransactionType.HATHOR_NFT_MELT) {
      amountHTRUnit = Math.ceil(new BigNumber(amount).times(0.0001).times(100).toNumber())
    } else {
      amountHTRUnit = toHTRUnit(amount).toNumber()
    }
    let utxos = await this.getUTXOs({ address: wallet.address, protocol })
    if (type === TransactionType.HATHOR_TOKEN_MELT || type === TransactionType.HATHOR_NFT_MELT) {
      utxos = utxos.filter((utxo) => utxo.token === tokenUid)
    } else {
      utxos = utxos.filter((utxo) => utxo.token === '00' || utxo.token === tokenUid)
    }
    if (utxos.length === 0) {
      throw new HathorException('No available UTXOs')
    }
    const inputs = []
    for (let i = 0; i < utxos.length; ++i) {
      const tx = await this.getTransactionByHash({ hash: utxos[i].txHash, protocol })
      const output = tx.tx.outputs[utxos[i].index]
      if (type === TransactionType.HATHOR_TOKEN_MELT || type === TransactionType.HATHOR_NFT_MELT) {
        if (![0, 129].includes(output.token_data)) {
          if (inputSum < amountHTRUnit) {
            inputSum += output.value
            inputs.push({ txHash: utxos[i].txHash, index: utxos[i].index, privateKey: wallet.privateKey })
          }
        } else if (output.token_data === 129 && output.value === 2) {
          inputs.push({ txHash: utxos[i].txHash, index: utxos[i].index, privateKey: wallet.privateKey })
        }
      } else {
        if (output.token_data === 0) {
          if (inputSum < amountHTRUnit) {
            inputSum += output.value
            inputs.push({ txHash: utxos[i].txHash, index: utxos[i].index, privateKey: wallet.privateKey })
          }
        } else if (output.token_data === 129 && output.value === 1) {
          inputs.push({ txHash: utxos[i].txHash, index: utxos[i].index, privateKey: wallet.privateKey })
        }
      }
    }
    const signedTx = await buildHathorTokenTransaction({
      type,
      inputs,
      tokenUid,
      tokenName,
      tokenSymbol,
      address: address || wallet.address,
      changeAddress: changeAddress || wallet.address,
      mintAuthorityAddress,
      meltAuthorityAddress,
      nftData,
      amount,
      testnet: isTestnet(this.config.environment),
      inputSum,
    })
    return new SignedTransaction({ signedTx, protocol, type })
  }
  /**
   * Create Hathor token transaction using UTXO
   * @param {import('../entity').HathorTokenTransactionFromUTXOInput} input
   * @returns {Promise<SignedTransaction>}
   */
  async createHathorTokenTransactionFromUTXO(input) {
    validateHathorTokenTransactionFromUTXO(input)
    let {
      inputs,
      tokenName,
      tokenSymbol,
      address,
      changeAddress,
      mintAuthorityAddress,
      meltAuthorityAddress,
      amount,
      tokenUid,
      type,
    } = input
    let inputSum = 0
    const protocol = Protocol.HATHOR
    for (let i = 0; i < inputs.length; ++i) {
      const tx = await this.getTransactionByHash({ hash: inputs[i].txHash, protocol })
      if (type === TransactionType.HATHOR_TOKEN_MELT && ![0, 129].includes(tx.tx.outputs[inputs[i].index].token_data)) {
        inputSum += tx.tx.outputs[inputs[i].index].value
      } else {
        if (tx.tx.outputs[inputs[i].index].token_data === 0) {
          inputSum += tx.tx.outputs[inputs[i].index].value
        }
      }
    }
    const signedTx = await buildHathorTokenTransaction({
      inputs,
      tokenName,
      tokenSymbol,
      address,
      changeAddress,
      mintAuthorityAddress,
      meltAuthorityAddress,
      amount,
      tokenUid,
      testnet: isTestnet(this.config.environment),
      type,
      inputSum,
    })
    return new SignedTransaction({ signedTx, protocol, type })
  }

  /**
   * Create transfer tokens transaction in Cardano blockchain
   * @param {import('../entity').CardanoTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>}
   */
  async createCardanoTransferTransactionFromWallet(input) {
    try {
      let { wallet, outputs } = input
      const protocol = Protocol.CARDANO
      const keyAddressMapper = {}
      keyAddressMapper[wallet.address] = {
        secretKey: wallet.privateKey.spendingPrivateKey.slice(0, 128),
        publicKey: wallet.privateKey.spendingPrivateKey.slice(128, 192),
      }

      const privateKey = CardanoWasm.Bip32PrivateKey.from_128_xprv(
        new Uint8Array(wallet.privateKey.spendingPrivateKey.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))
      )
      const headers = mountHeaders(this.config.apiKey)
      const utxo = await this.getUTXOs({ address: wallet.address, protocol })
      let feelessUtxo = JSON.parse(JSON.stringify(utxo))
      const feelessTx = buildOperation(feelessUtxo, wallet.address, outputs)
      const apiRequest = getApiMethod({
        requests,
        key: 'preprocess',
        config: this.config,
      })
      const options = await apiRequest(
        `${requests.preprocess.url}?protocol=${protocol}`,
        {
          operations: feelessTx.operations,
          metadata: { relative_ttl: 1000 },
        },
        {
          headers,
        }
      )
      const metadata = await apiRequest(`${requests.getMetadata.url}?protocol=${protocol}`, {
        ...options.data,
      })
      const builtTx = buildOperation(utxo, wallet.address, outputs, metadata.data.suggested_fee[0].value)
      const payload = await apiRequest(`${requests.getPayload.url}?protocol=${protocol}`, {
        operations: builtTx.operations,
        metadata: metadata.data.metadata,
      })
      const signatures = payload.data.payloads.map((signing_payload) => {
        const {
          account_identifier: { address },
        } = signing_payload
        return {
          signing_payload,
          public_key: {
            hex_bytes: keyAddressMapper[address].publicKey,
            curve_type: 'edwards25519',
          },
          signature_type: 'ed25519',
          hex_bytes: Buffer.from(
            CardanoWasm.make_vkey_witness(
              CardanoWasm.TransactionHash.from_bytes(Buffer.from(signing_payload.hex_bytes, 'hex')),
              privateKey.to_raw_key()
            )
              .signature()
              .to_bytes()
          ).toString('hex'),
        }
      })
      const combine = await apiRequest(`${requests.combineSignatures.url}?protocol=${protocol}`, {
        unsigned_transaction: payload.data.unsigned_transaction,
        signatures,
      })
      const signedTx = combine.data.signed_transaction
      return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
    } catch (error) {
      handleRequestError(error)
    }
  }

  /**
   * Create transfer tokens transaction in Cardano blockchain
   * @param {import('../entity').CardanoTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>}
   */
  async createCardanoTransferTransactionFromUTXO(input) {
    try {
      let { outputs, inputs } = input
      const headers = mountHeaders(this.config.apiKey)
      const protocol = Protocol.CARDANO
      const keyAddressMapper = {}
      const inputList = []

      await Promise.all(
        inputs.map(async (i) => {
          keyAddressMapper[i.address] = {
            secretKey: CardanoWasm.Bip32PrivateKey.from_128_xprv(
              new Uint8Array(i.privateKey.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))
            ),
            publicKey: i.privateKey.slice(128, 192),
          }
          let utxo = await this.getUTXOs({ address: i.address, protocol })
          utxo.map((u) => {
            if (u.txHash === i.txHash && u.index.toString() === i.index) {
              inputList.push({ ...u, address: i.address })
            }
          })
        })
      )
      if (inputList.length !== inputs.length) throw new Error('One or more inputs are invalid')
      const apiRequest = getApiMethod({
        requests,
        key: 'preprocess',
        config: this.config,
      })
      const builtTx = buildOperationFromInputs(inputList, outputs)
      const options = await apiRequest(
        `${requests.preprocess.url}?protocol=${protocol}`,
        {
          operations: builtTx.operations,
          metadata: { relative_ttl: 1000 },
        },
        {
          headers,
        }
      )
      const metadata = await apiRequest(`${requests.getMetadata.url}?protocol=${protocol}`, {
        ...options.data,
      })
      const payload = await apiRequest(`${requests.getPayload.url}?protocol=${protocol}`, {
        operations: builtTx.operations,
        metadata: metadata.data.metadata,
      })
      const signatures = payload.data.payloads.map((signing_payload) => {
        const {
          account_identifier: { address },
        } = signing_payload
        return {
          signing_payload,
          public_key: {
            hex_bytes: keyAddressMapper[address].publicKey,
            curve_type: 'edwards25519',
          },
          signature_type: 'ed25519',
          hex_bytes: Buffer.from(
            CardanoWasm.make_vkey_witness(
              CardanoWasm.TransactionHash.from_bytes(Buffer.from(signing_payload.hex_bytes, 'hex')),
              keyAddressMapper[address].secretKey.to_raw_key()
            )
              .signature()
              .to_bytes()
          ).toString('hex'),
        }
      })
      const combine = await apiRequest(`${requests.combineSignatures.url}?protocol=${protocol}`, {
        unsigned_transaction: payload.data.unsigned_transaction,
        signatures,
      })
      const signedTx = combine.data.signed_transaction
      return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Create Solana transfer transaction
   * @param {import('../entity').SolanaTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createSolanaTransferTransaction(input) {
    validateSolanaTransferTransaction(input)
    const { wallet, destination, token, amount, isNFT } = input
    const protocol = Protocol.SOLANA
    let decimals = null
    if (isNFT) {
      decimals = 0
    } else if (token !== 'SOL') {
      ({ decimals } = await getTokenControllerInstance(this.config).getInfo({ tokenAddress: token, protocol }))
    }
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const signedTx = await buildSolanaTransferTransaction({
      from: wallet, to: destination, token, amount: Number(amount), latestBlock: blockhash, decimals, config: this.config
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create Solana token burn transaction
   * @param {import('../entity').SolanaTokenBurnTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createSolanaTokenBurnTransaction(input) {
    validateSolanaTransferTransaction(input)
    const { wallet, token, amount } = input
    const protocol = Protocol.SOLANA
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const signedTx = await buildSolanaTokenBurnTransaction({
      from: wallet, token, amount: Number(amount), latestBlock: blockhash, config: this.config
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.SOLANA_TOKEN_BURN })
  }
  /**
   * Create Solana token mint transaction
   * @param {import('../entity').SolanaTokenMintTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createSolanaTokenMintTransaction(input) {
    validateSolanaTransferTransaction(input)
    const { wallet, destination, token, amount } = input
    const protocol = Protocol.SOLANA
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const signedTx = await mintSolanaToken({
      from: wallet, token, to: destination, amount, latestBlock: blockhash, config: this.config
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.SOLANA_TOKEN_MINT })
  }
  /**
     * Create Solana token deploy transaction
     * @param {import('../entity').SolanaTokenDeployInput} input
     */
  async createSolanaTokenDeployTransaction(input) {
    validateSolanaDeployTransaction(input)
    const protocol = Protocol.SOLANA
    const { wallet, fixedSupply, name, symbol, decimals, amount } = input
    const response = await deploySolanaToken({
      from: wallet,
      fixedSupply,
      name,
      symbol,
      decimals,
      amount,
      config: this.config
    })
    return {
      mint: response.mint,
      metadata: response.metadata,
      transaction: new SignedTransaction({ signedTx: response.rawTransaction, protocol, type: TransactionType.SOLANA_TOKEN_CREATION })
    }
  }
  /**
     * Create Solana Collection
     * @param {import('../entity').SolanaNFTCollectionInput} input
     */
  async createSolanaCollectionTransaction(input) {
    validateSolanaCollectionInput(input)
    const { wallet, name, symbol, uri } = input
    const protocol = Protocol.SOLANA
    // const mintRent = (await this.getFee({ protocol, type: TransactionType.SOLANA_NFT_MINT })).mintRentExemption
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const response = await deploySolanaCollection({
      name, symbol, uri, from: wallet, latestBlock: blockhash, config: this.config
    })
    return {
      collection: response.collection,
      transaction: new SignedTransaction({ signedTx: response.rawTransaction, protocol, type: TransactionType.SOLANA_COLLECTION_MINT })
    }
  }
  /**
     * Create Solana NFT transaction
     * @param {import('../entity').SolanaNFTTransactionInput} input
     */
  async createSolanaNFTTransaction(input) {
    validateSolanaNFTInput(input)
    const { wallet, maxSupply, uri, name, symbol, creators, royaltiesFee, collection } = input
    const protocol = Protocol.SOLANA
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const response = await deploySolanaNFT({
      from: wallet,
      maxSupply,
      uri,
      name,
      symbol,
      creators,
      royaltiesFee,
      collection,
      latestBlock: blockhash,
      config: this.config
    })
    return {
      mint: response.mint,
      metadata: response.metadata,
      transaction: new SignedTransaction({ signedTx: response.rawTransaction, protocol, type: TransactionType.SOLANA_NFT_MINT })
    }
  }
  /**
   * Create Solana NFT Edition
   *
   * @param {import('../entity').SolanaNFTEditionInput} input
   * @returns {Promise<TransactionResponse>} edition signature
   */
  async createSolanaNFTEditionTransaction(input) {
    validateSolanaDeployNFT(input)
    const { wallet, masterEdition } = input
    const protocol = Protocol.SOLANA
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const response = await mintEdition({ masterEdition, from: wallet, latestBlock: blockhash, config: this.config })
    return {
      mint: response.mint,
      transaction: new SignedTransaction({ signedTx: response.rawTransaction, protocol, type: TransactionType.SOLANA_NFT_MINT })
    }
  }
  /**
   * Update Solana NFT Metadata
   *
   * @param {import('../entity').SolanaUpdateMetadataInput} input
   * @returns {Promise<TransactionResponse>} token signature
   */
  async updateSolanaNFTMetadata(input) {
    validateSolanaDeployNFT(input)
    const { wallet, maxSupply, uri, isMutable, name, symbol, creators, royaltiesFee, collection, token } = input
    const protocol = Protocol.SOLANA
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const response = await updateMetaplexMetadata({
      from: wallet,
      token,
      isMutable,
      maxSupply,
      uri,
      name,
      symbol,
      creators,
      royaltiesFee,
      collection,
      latestBlock: blockhash,
      config: this.config
    })
    return new SignedTransaction({ signedTx: response, protocol, type: TransactionType.SOLANA_UPDATE_METADATA })
  }
  /**
   * Create a Custom Solana Program Interaction
   *
   * @param {import('../entity').SolanaCustomProgramInput} input
   * @returns {Promise<SignedTransaction>} signed transaction
   */
  async createSolanaCustomProgramInteraction(input) {
    validateSolanaCustomProgramInput(input)
    const { from, keys, programId, data } = input
    const protocol = Protocol.SOLANA
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const signedTx = await buildSolanaCustomProgramInteraction({ from, keys, programId, data, latestBlock: blockhash })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.CALL_CONTRACT_METHOD })
  }
  /**
   * Create Solana update auction authority transaction
   *
   * @param {import('../entity').TransferTransactionInput} input
   * @returns {Promise<TransactionResponse>} signed transaction data
   */
  async solanaUpdateAuctionAuthorityTransaction(input) {
    // validateSolanaTransferTransaction(input)
    const { from, auctionManager, auction } = input
    const protocol = Protocol.SOLANA
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const txHash = await updateAuctionAuthority({
      from, auctionManager, auction, config: this.config, latestBlock: blockhash
    })
    return new TransactionResponse({ hash: txHash })
  }
  /**
   * Create Solana update token vault authority transaction
   *
   * @param {import('../entity').TransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async solanaUpdateVaultAuthorityTransaction(input) {
    const { from, auctionManager, vault } = input
    const protocol = Protocol.SOLANA
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const txHash = await updateVaultAuthority({
      from, auctionManager, vault, config: this.config, latestBlock: blockhash
    })
    return new TransactionResponse({ hash: txHash })
  }
  /**
   * Create Solana validate auction transaction
   *
   * @param {import('../entity').TransferTransactionInput} input
   * @returns {Promise<TransactionResponse>}
   */
  async validateSolanaSafetyDepositBoxes(input) {
    const { from, vault, nft, store, metadata, tokenStore, tokenTracker } = input
    const protocol = Protocol.SOLANA
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const txHash = await validateAuction({
      config: this.config, from, vault, nft, store, metadata, tokenStore, tokenTracker, latestBlock: blockhash
    })
    return new TransactionResponse({ hash: txHash })
  }
  /**
   * Create Solana whitelist creators transaction
   *
   * @param {import('../entity').TransferTransactionInput} input
   * @returns {Promise<TransactionResponse>}
   */
  async whitelistCreatorsTransaction(input) {
    const protocol = Protocol.SOLANA
    const { blockhash } = await this.getBlock({ block: 'latest', protocol })
    const txHash = await whitelistCreators({ ...input, latestBlock: blockhash, config: this.config })
    return new TransactionResponse({ hash: txHash })
  }
}
module.exports.TransactionController = Controller
