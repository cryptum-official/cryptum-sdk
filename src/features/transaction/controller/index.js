const { handleRequestError, getApiMethod, mountHeaders } = require('../../../services')
const requests = require('./requests.json')
const Interface = require('./interface')
const { Protocol } = require('../../../services/blockchain/constants')
const { getTokenAddress } = require('../../../services/blockchain/utils')
const {
  buildStellarTrustlineTransaction,
  buildRippleTrustlineTransaction,
} = require('../../../services/blockchain/trustline')
const {
  buildStellarTransferTransaction,
  buildRippleTransferTransaction,
  buildCeloTransferTransaction,
  buildEthereumTransferTransaction,
  buildBscTransferTransaction,
} = require('../../../services/blockchain/transfer')
const { FeeResponse, TransactionResponse, SignedTransaction, UTXO, TransactionType } = require('../entity')
const WalletController = require('../../wallet/controller')
const BigNumber = require('bignumber.js')
const { buildBitcoinTransferTransaction } = require('../../../services/blockchain/bitcoin')
const { validateBitcoinTransferTransactionParams, validateSignedTransaction } = require('../../../services/validation')

class Controller extends Interface {
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
        type: 'transfer',
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
        type: 'transfer',
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
      sequence: info.account_data.Sequence,
      maxLedgerVersion: info.ledger_current_index + 10,
      testnet: testnet !== undefined ? testnet : wallet.testnet,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.CHANGE_TRUST })
  }

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
        type: 'transfer',
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
        type: 'transfer',
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
      sequence: info.account_data.Sequence,
      maxLedgerVersion: info.ledger_current_index + 10,
      testnet: testnet !== undefined ? testnet : wallet.testnet,
    })
    return new SignedTransaction({ signedTx, protocol, type: TransactionType.TRANSFER })
  }

  async createCeloTransferTransaction(input) {
    const {
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
    const method = memo ? 'transferWithComment' : 'transfer'
    const amountWei = new BigNumber(amount).times('1e18').toString()
    const params = memo ? [destination, amountWei, memo] : [destination, amountWei]
    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type: 'transfer',
      destination,
      amount,
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
  async createEthereumTransferTransaction(input) {
    const { wallet, tokenSymbol, amount, destination, fee, testnet, contractAddress } = input
    const protocol = Protocol.ETHEREUM
    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type: 'transfer',
      destination,
      amount,
      contractAddress,
      method: 'transfer',
      params: [destination, new BigNumber(amount).times('1e18').toString()],
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

  async createBscTransferTransaction(input) {
    const { wallet, tokenSymbol, amount, destination, fee, testnet, contractAddress } = input
    const protocol = Protocol.BSC
    const { info, networkFee } = await this._getFeeInfo({
      wallet,
      type: 'transfer',
      destination,
      amount,
      contractAddress,
      method: 'transfer',
      params: [destination, new BigNumber(amount).times('1e18').toString()],
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
      ;({ estimateValue: networkFee } = await this.getFee({
        type: 'transfer',
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

  async _getFeeInfo({
    wallet,
    type,
    destination,
    amount,
    tokenSymbol,
    contractAddress,
    method,
    params,
    testnet,
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
        contractAddress: contractAddress || getTokenAddress(protocol, tokenSymbol, testnet),
        protocol,
      })
    }
    return { info, networkFee }
  }
}

module.exports = Controller
