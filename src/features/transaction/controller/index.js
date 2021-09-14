const { handleRequestError, getApiMethod, mountHeaders } = require('../../../services')
const requests = require('./requests.json')
const Interface = require('./interface')
const { Protocol, TRANSFER_METHOD_ABI, TRANSFER_COMMENT_METHOD_ABI } = require('../../../services/blockchain/constants')
const { getTokenAddress, toWei } = require('../../../services/blockchain/utils')
const {
  FeeResponse,
  TransactionResponse,
  SignedTransaction,
  UTXO,
  TransactionType,
  SmartContractCallResponse,
  Input,
} = require('../entity')
const {
  buildStellarTransferTransaction,
  buildStellarTrustlineTransaction,
} = require('../../../services/blockchain/stellar')
const {
  buildRippleTransferTransaction,
  buildRippleTrustlineTransaction,
} = require('../../../services/blockchain/ripple')
const {
  buildBscTransferTransaction,
  buildEthereumTransferTransaction,
  buildEthereumSmartContractTransaction,
  buildEthereumSmartContractDeployTransaction,
} = require('../../../services/blockchain/ethereum')
const { buildBitcoinTransferTransaction } = require('../../../services/blockchain/bitcoin')
const WalletController = require('../../wallet/controller')
const { GenericException } = require('../../../../errors')
const {
  buildCeloSmartContractTransaction,
  buildCeloTransferTransaction,
  buildCeloSmartContractDeployTransaction,
} = require('../../../services/blockchain/celo')
const {
  validateCeloTransferTransactionParams,
  validateBitcoinTransferTransactionParams,
  validateSignedTransaction,
  validateSmartContractTransactionParams,
  validateSmartContractCallParams,
  validateSmartContractDeployTransactionParams,
  validateTokenDeployTransactionParams,
  validateRippleTransferTransactionParams,
  validateStellarTransferTransactionParams,
  validateStellarTrustlineTransactionParams,
  validateRippleTrustlineTransactionParams,
  validateEthereumTransferTransactionParams,
} = require('../../../services/validations')

class Controller extends Interface {
  /**
   * Method to send an transaction to Cryptum
   *
   * @param {SignedTransaction} transaction object with all transaction data
   * @param {Protocol} transaction.protocol
   * @returns {Promise<TransactionResponse>}
   */
  async sendTransaction(transaction) {
    try {
      validateSignedTransaction(transaction)
      const apiRequest = getApiMethod({
        requests,
        key: 'sendTransaction',
        config: this.config,
      })
      const headers = mountHeaders(this.config.apiKey)
      const { protocol, signedTx, type } = transaction
      const response = await apiRequest(
        requests.sendTransaction.url,
        { signedTx, type },
        {
          headers,
          params: { protocol },
        }
      )
      return new TransactionResponse(response.data)
    } catch (error) {
      handleRequestError(error)
    }
  }
  /**
   * Method to get fee info
   *
   * @param {object} input
   * @param {string} input.type
   * @param {string?} input.from
   * @param {string?} input.destination
   * @param {string?} input.assetSymbol
   * @param {string?} input.contractAddress
   * @param {string?} input.method
   * @param {Array?} input.params
   * @param {Protocol} input.protocol
   * @param input.amount
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
    tokenType = null,
  }) {
    try {
      const apiRequest = getApiMethod({
        requests,
        key: 'getFee',
        config: this.config,
      })
      const headers = mountHeaders(this.config.apiKey)
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
      if (tokenType) data.tokenType = tokenType
      const response = await apiRequest(`${requests.getFee.url}?protocol=${protocol}`, data, {
        headers,
      })
      return new FeeResponse(response.data)
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
   * Get block info
   *
   * @param {object} input
   * @param {string} input.block block number or hash
   * @param {Protocol} input.protocol blockchain protocol
   */
  async getBlock({ block, protocol }) {
    try {
      const apiRequest = getApiMethod({
        requests,
        key: 'getBlock',
        config: this.config,
      })
      const headers = mountHeaders(this.config.apiKey)
      const response = await apiRequest(`${requests.getBlock.url}/${block}?protocol=${protocol}`, {
        headers,
      })
      return response.data
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
    const { wallet, assetSymbol, issuer, fee, limit, memo, timeout, testnet } = input
    const protocol = Protocol.STELLAR
    const info = await new WalletController(this.config).getWalletInfo({
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
      testnet: testnet !== undefined ? testnet : this.config.environment === 'development',
      timeout,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.CHANGE_TRUST })
  }
  /**
   * Create ripple trustline transaction
   *
   * @param {import('../entity').RippleTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createRippleTrustlineTransaction(input) {
    validateRippleTrustlineTransactionParams(input)
    const { wallet, assetSymbol, issuer, fee, limit, memo, testnet } = input
    const protocol = Protocol.RIPPLE
    const info = await new WalletController(this.config).getWalletInfo({
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
      testnet: testnet !== undefined ? testnet : this.config.environment === 'development',
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
    const { wallet, assetSymbol, issuer, amount, destination, memo, fee, testnet, createAccount, timeout } = input
    const protocol = Protocol.STELLAR
    const info = await new WalletController(this.config).getWalletInfo({
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
      testnet: testnet !== undefined ? testnet : this.config.environment === 'development',
      createAccount,
      timeout,
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
    const { wallet, assetSymbol, issuer, amount, destination, memo, fee, testnet } = input
    const protocol = Protocol.RIPPLE
    const info = await new WalletController(this.config).getWalletInfo({
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
      testnet: testnet !== undefined ? testnet : this.config.environment === 'development',
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
    let { wallet, tokenSymbol, amount, destination, memo, fee, testnet, contractAddress, feeCurrency } = input
    const protocol = Protocol.CELO
    let type, method, params, value, contractAbi
    const amountWei = toWei(amount).toString()
    if (tokenSymbol === 'CELO') {
      type = memo ? TransactionType.CALL_CONTRACT_METHOD : TransactionType.TRANSFER
      method = memo ? 'transferWithComment' : null
      params = memo ? [destination, amountWei, memo] : null
      value = memo ? null : amount
      contractAddress = memo ? getTokenAddress(Protocol.CELO, tokenSymbol, testnet) : null
      contractAbi = memo ? TRANSFER_COMMENT_METHOD_ABI : null
    } else {
      type = TransactionType.CALL_CONTRACT_METHOD
      method = memo ? 'transferWithComment' : 'transfer'
      params = memo ? [destination, amountWei, memo] : [destination, amountWei]
      contractAbi = memo ? TRANSFER_COMMENT_METHOD_ABI : TRANSFER_METHOD_ABI

      if (['cUSD', 'cEUR'].includes(tokenSymbol)) {
        contractAddress = getTokenAddress(Protocol.CELO, tokenSymbol, testnet)
      }
    }
    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type,
      destination,
      amount: value,
      contractAddress,
      contractAbi,
      method,
      params,
      testnet,
      fee,
      protocol,
    })
    const signedTx = await buildCeloTransferTransaction({
      fromPrivateKey: wallet.privateKey,
      tokenSymbol,
      amount,
      destination,
      memo,
      fee: networkFee,
      nonce: info.nonce,
      testnet: testnet !== undefined ? testnet : this.config.environment === 'development',
      contractAddress,
      feeCurrency,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create ethereum transfer transaction
   *
   * @param {EthereumTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createEthereumTransferTransaction(input) {
    validateEthereumTransferTransactionParams(input)
    const { wallet, tokenSymbol, amount, destination, fee, testnet, contractAddress } = input
    const protocol = Protocol.ETHEREUM
    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type: tokenSymbol === 'ETH' ? TransactionType.TRANSFER : TransactionType.CALL_CONTRACT_METHOD,
      destination,
      amount: tokenSymbol === 'ETH' ? amount : null,
      contractAddress,
      contractAbi: tokenSymbol === 'ETH' ? null : TRANSFER_METHOD_ABI,
      method: tokenSymbol === 'ETH' ? null : 'transfer',
      params: tokenSymbol === 'ETH' ? null : [destination, toWei(amount).toString()],
      fee,
      protocol,
    })
    const signedTx = await buildEthereumTransferTransaction({
      fromPrivateKey: wallet.privateKey,
      tokenSymbol,
      amount,
      destination,
      fee: networkFee,
      nonce: info.nonce,
      testnet: testnet !== undefined ? testnet : this.config.environment === 'development',
      contractAddress,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create bsc transfer transaction
   *
   * @param {EthereumTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createBscTransferTransaction(input) {
    validateEthereumTransferTransactionParams(input)
    const { wallet, tokenSymbol, amount, destination, fee, testnet, contractAddress } = input
    const protocol = Protocol.BSC
    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type: tokenSymbol === 'BNB' ? TransactionType.TRANSFER : TransactionType.CALL_CONTRACT_METHOD,
      destination,
      amount: tokenSymbol === 'BNB' ? amount : null,
      contractAddress,
      contractAbi: tokenSymbol === 'BNB' ? null : TRANSFER_METHOD_ABI,
      method: tokenSymbol === 'BNB' ? null : 'transfer',
      params: tokenSymbol === 'BNB' ? null : [destination, toWei(amount).toString()],
      testnet,
      fee,
      protocol,
    })
    const signedTx = await buildBscTransferTransaction({
      fromPrivateKey: wallet.privateKey,
      tokenSymbol,
      amount,
      destination,
      fee: networkFee,
      nonce: info.nonce,
      testnet: testnet !== undefined ? testnet : this.config.environment === 'development',
      contractAddress,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create bitcoin transfer transaction
   *
   * @param {import('../entity').BitcoinTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createBitcoinTransferTransaction(input) {
    validateBitcoinTransferTransactionParams(input)
    let { wallet, inputs, outputs, fee, testnet } = input
    const protocol = Protocol.BITCOIN
    if (wallet) {
      const utxos = await this.getUTXOs({ address: wallet.address, protocol })
      inputs = []
      for (let i = 0; i < utxos.length; ++i) {
        const tx = await this.getTransactionByHash({ hash: utxos[i].txHash, protocol })
        inputs[i] = new Input({ ...utxos[i], privateKey: wallet.privateKey, hex: tx.hex, blockhash: tx.blockhash })
      }
    } else if (inputs) {
      for (let i = 0; i < inputs.length; ++i) {
        const tx = await this.getTransactionByHash({ hash: inputs[i].txHash, protocol })
        if (!tx.vout[inputs[i].index]) {
          throw new GenericException(`Invalid UTXO hash ${inputs[i].txHash}`, 'InvalidParams')
        }
        inputs[i].hex = tx.hex
        inputs[i].blockhash = tx.blockhash
      }
    }
    let networkFee = fee
    if (!networkFee) {
      ;({ estimateValue: networkFee } = await this.getFee({
        type: TransactionType.TRANSFER,
        protocol,
      }))
    }

    const signedTx = await buildBitcoinTransferTransaction({
      wallet,
      inputs,
      outputs,
      fee: networkFee,
      testnet: testnet !== undefined ? testnet : this.config.environment === 'development',
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create call transaction to smart contract
   *
   * @param {import('../entity').SmartContractCallTransactionInput} input
   * @returns {Promise<SignedTransaction>}
   */
  async createSmartContractTransaction(input) {
    validateSmartContractTransactionParams(input)
    const { wallet, fee, testnet, value, contractAddress, contractAbi, method, params, protocol, feeCurrency } = input
    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type: TransactionType.CALL_CONTRACT_METHOD,
      contractAddress,
      contractAbi,
      method,
      params,
      testnet,
      fee,
      protocol,
    })
    let signedTx
    const transactionOptions = {
      fromPrivateKey: wallet.privateKey,
      nonce: info.nonce,
      value,
      contractAddress,
      contractAbi,
      method,
      params,
      fee: networkFee,
      feeCurrency,

      testnet: testnet !== undefined ? testnet : this.config.environment === 'development',
    }
    if (protocol === Protocol.CELO) {
      signedTx = await buildCeloSmartContractTransaction(transactionOptions)
    } else if ([Protocol.ETHEREUM, Protocol.BSC].includes(protocol)) {
      signedTx = await buildEthereumSmartContractTransaction({ ...transactionOptions, protocol })
    } else {
      throw new GenericException('Invalid protocol', 'InvalidTypeException')
    }
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.CALL_CONTRACT_METHOD })
  }

  /**
   * Call a smart contract method
   * @param {import('../entity').SmartContractCallTransactionInput} input
   * @returns {Promise<SmartContractCallResponse>}
   */
  async callSmartContractMethod(input) {
    validateSmartContractCallParams(input)
    const { contractAddress, contractAbi, method, params, protocol } = input
    try {
      const apiRequest = getApiMethod({
        requests,
        key: 'callSmartContractMethod',
        config: this.config,
      })
      const headers = mountHeaders(this.config.apiKey)
      const response = await apiRequest(
        requests.callSmartContractMethod.url,
        { contractAddress, contractAbi, method, params },
        {
          headers,
          params: { protocol },
        }
      )
      return new SmartContractCallResponse(response.data)
    } catch (error) {
      handleRequestError(error)
    }
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
    protocol,
    contractName,
    source,
    tokenType,
  }) {
    const [info, networkFee] = await Promise.all([
      new WalletController(this.config).getWalletInfo({
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
      }),
    ])
    if (fee && fee.gas) networkFee.gas = fee && fee.gas
    if (fee && fee.gasPrice) networkFee.gasPrice = fee && fee.gasPrice
    return { info, networkFee }
  }

  /**
   * Create call transaction to smart contract deploy
   *
   * @param {import('../entity').SmartContractDeployTransactionInput} input
   * @returns {Promise<SignedTransaction>}
   */
  async createSmartContractDeployTransaction(input) {
    validateSmartContractDeployTransactionParams(input)
    const { wallet, fee, testnet, params, protocol, feeCurrency, source, contractName } = input

    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type: TransactionType.DEPLOY_CONTRACT,
      params,
      testnet,
      fee,
      protocol,
      source,
      contractName,
    })

    let signedTx

    const transactionOptions = {
      source,
      contractName,
      fromPrivateKey: wallet.privateKey,
      nonce: info.nonce,
      params,
      fee: networkFee,
      feeCurrency,

      testnet: testnet !== undefined ? testnet : this.config.environment === 'development',
      config: this.config,
    }

    if (protocol === Protocol.CELO) {
      signedTx = await buildCeloSmartContractDeployTransaction(transactionOptions)
    } else if ([Protocol.ETHEREUM, Protocol.BSC].includes(protocol)) {
      signedTx = await buildEthereumSmartContractDeployTransaction({ ...transactionOptions, protocol })
    } else {
      throw new GenericException('Invalid protocol', 'InvalidTypeException')
    }

    return new SignedTransaction({ signedTx, protocol, type: TransactionType.DEPLOY_CONTRACT })
  }
  /**
   * Create call transaction to token/asset issue
   *
   * @param {import('../entity').TokenDeployTransactionInput} input
   * @returns {Promise<SignedTransaction>}
   */
  async createTokenDeployTransaction(input) {
    validateTokenDeployTransactionParams(input)
    const { wallet, fee, testnet, params, protocol, feeCurrency, tokenType } = input

    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type: `DEPLOY_${tokenType}`,
      params,
      testnet,
      fee,
      protocol,
      tokenType,
    })

    let signedTx

    const transactionOptions = {
      fromPrivateKey: wallet.privateKey,
      nonce: info.nonce,
      params,
      fee: networkFee,
      feeCurrency,

      testnet: testnet !== undefined ? testnet : this.config.environment === 'development',
      config: this.config,
      tokenType,
    }

    if (protocol === Protocol.CELO) {
      signedTx = await buildCeloSmartContractDeployTransaction(transactionOptions)
    } else if ([Protocol.ETHEREUM, Protocol.BSC].includes(protocol)) {
      signedTx = await buildEthereumSmartContractDeployTransaction({ ...transactionOptions, protocol })
    } else {
      throw new GenericException('Invalid protocol', 'InvalidTypeException')
    }

    return new SignedTransaction({ signedTx, protocol, type: TransactionType.DEPLOY_CONTRACT })
  }
}

module.exports = Controller
