/* eslint-disable no-unused-vars */
const { handleRequestError, getApiMethod, mountHeaders } = require('../../../services')
const requests = require('./requests.json')
const Interface = require('./interface')
const { Protocol } = require('../../../services/blockchain/constants')
const { getTokenAddress, toWei } = require('../../../services/blockchain/utils')
const {
  FeeResponse,
  TransactionResponse,
  SignedTransaction,
  UTXO,
  TransactionType,
  StellarTrustlineTransactionInput,
  RippleTransferTransactionInput,
  StellarTransferTransactionInput,
  CeloTransferTransactionInput,
  EthereumTransferTransactionInput,
  BitcoinTransferTransactionInput,
  UTXOResponse,
  SmartContractCallTransactionInput,
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
  buildCeloTransferTransaction,
  buildEthereumTransferTransaction,
  buildSmartContractTransaction,
} = require('../../../services/blockchain/ethereum')
const { buildBitcoinTransferTransaction } = require('../../../services/blockchain/bitcoin')
const WalletController = require('../../wallet/controller')
const { validateBitcoinTransferTransactionParams, validateSignedTransaction } = require('../../../services/validation')

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
    method = null,
    params = null,
    protocol,
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
      if (method) data.method = method
      if (params) data.params = params
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
   * @returns {Array<UTXOResponse>}
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
   * Create stellar trustline transaction
   *
   * @param {StellarTrustlineTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createStellarTrustlineTransaction(input) {
    const { wallet, assetSymbol, issuer, fee, limit, memo, testnet } = input
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
      testnet: testnet !== undefined ? testnet : wallet.testnet,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.CHANGE_TRUST })
  }
  /**
   * Create ripple trustline transaction
   *
   * @param {RippleTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createRippleTrustlineTransaction(input) {
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
      testnet: testnet !== undefined ? testnet : wallet.testnet,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.CHANGE_TRUST })
  }
  /**
   * Create stellar transfer transaction
   *
   * @param {StellarTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createStellarTransferTransaction(input) {
    const { wallet, assetSymbol, issuer, amount, destination, memo, fee, testnet, startingBalance } = input
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
      testnet: testnet !== undefined ? testnet : wallet.testnet,
      startingBalance,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create ripple transfer transaction
   *
   * @param {RippleTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createRippleTransferTransaction(input) {
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
      testnet: testnet !== undefined ? testnet : wallet.testnet,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create celo transfer transaction
   *
   * @param {CeloTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createCeloTransferTransaction(input) {
    let {
      wallet,
      tokenSymbol,
      amount,
      destination,
      memo,
      fee,
      testnet,
      contractAddress,
      feeCurrency,
      feeCurrencyContractAddress,
    } = input
    const protocol = Protocol.CELO
    let type, method, params, value
    const amountWei = toWei(amount).toString()
    if (tokenSymbol === 'CELO') {
      type = memo ? TransactionType.CALL_CONTRACT_METHOD : TransactionType.TRANSFER
      method = memo ? 'transferWithComment' : null
      params = memo ? [destination, amountWei, memo] : null
      value = memo ? null : amount
      contractAddress = memo ? getTokenAddress(Protocol.CELO, tokenSymbol, testnet) : null
    } else {
      type = TransactionType.CALL_CONTRACT_METHOD
      method = memo ? 'transferWithComment' : 'transfer'
      params = memo ? [destination, amountWei, memo] : [destination, amountWei]

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
      testnet: testnet !== undefined ? testnet : wallet.testnet,
      contractAddress,
      feeCurrency,
      feeCurrencyContractAddress,
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
    const { wallet, tokenSymbol, amount, destination, fee, testnet, contractAddress } = input
    const protocol = Protocol.ETHEREUM
    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type: tokenSymbol === 'ETH' ? TransactionType.TRANSFER : TransactionType.CALL_CONTRACT_METHOD,
      destination,
      amount: tokenSymbol === 'ETH' ? amount : null,
      contractAddress,
      method: tokenSymbol === 'ETH' ? null : 'transfer',
      params: tokenSymbol === 'ETH' ? null : [destination, toWei(amount).toString()],
      testnet,
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
      testnet: testnet !== undefined ? testnet : wallet.testnet,
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
    const { wallet, tokenSymbol, amount, destination, fee, testnet, contractAddress } = input
    const protocol = Protocol.BSC
    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type: tokenSymbol === 'BNB' ? TransactionType.TRANSFER : TransactionType.CALL_CONTRACT_METHOD,
      destination,
      amount: tokenSymbol === 'BNB' ? amount : null,
      contractAddress,
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
      testnet: testnet !== undefined ? testnet : wallet.testnet,
      contractAddress,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create bitcoin transfer transaction
   *
   * @param {BitcoinTransferTransactionInput} input
   * @returns {Promise<SignedTransaction>} signed transaction data
   */
  async createBitcoinTransferTransaction(input) {
    let { wallet, fromUTXOs, fromPrivateKeys, outputs, fee, testnet } = input
    validateBitcoinTransferTransactionParams(input)
    const protocol = Protocol.BITCOIN
    if (wallet) {
      fromUTXOs = await this.getUTXOs({ address: wallet.address, protocol })
      fromPrivateKeys = fromUTXOs.map(() => wallet.privateKey)
    }
    let networkFee = fee
    if (!networkFee) {
      ({ estimateValue: networkFee } = await this.getFee({
        type: TransactionType.TRANSFER,
        protocol,
      }))
    }
    const utxos = []
    for (const utxo of fromUTXOs) {
      const tx = await this.getTransactionByHash({ hash: utxo.txHash, protocol })
      utxos.push({
        ...utxo,
        hex: tx.hex,
      })
    }
    const signedTx = await buildBitcoinTransferTransaction({
      wallet,
      fromUTXOs: utxos,
      fromPrivateKeys,
      outputs,
      fee: networkFee,
      testnet,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }
  /**
   * Create call transaction to smart contract
   *
   * @param {SmartContractCallTransactionInput} input
   * @returns {Promise<SmartContractCallResponse | TransactionResponse>}
   */
  async createSmartContractTransaction(input) {
    const { wallet, fee, testnet, contractAddress, method, params, protocol } = input
    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type: TransactionType.CALL_CONTRACT_METHOD,
      contractAddress,
      method,
      params,
      testnet,
      fee,
      protocol,
    })
    const signedTx = await buildSmartContractTransaction({
      fromPrivateKey: wallet.privateKey,
      nonce: info.nonce,
      contractAddress,
      method,
      params,
      fee: networkFee,
      testnet: testnet !== undefined ? testnet : wallet.testnet,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.CALL_CONTRACT_METHOD })
  }

  async _getFeeInfo({
    wallet,
    type,
    destination,
    amount,
    contractAddress,
    method,
    params,
    fee,
    protocol,
  }) {
    const info = await new WalletController(this.config).getWalletInfo({
      address: wallet.address,
      protocol,
    })
    let networkFee = { gas: 0, gasPrice: '0', chainId: '' }
    if (!fee || !fee.gas || !fee.gasPrice) {
      networkFee = await this.getFee({
        type,
        from: wallet.address,
        destination,
        amount,
        method,
        params,
        contractAddress,
        protocol,
      })
    }
    return { info, networkFee }
  }
}

module.exports = Controller
