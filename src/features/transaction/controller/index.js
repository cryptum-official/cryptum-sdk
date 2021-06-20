const {
  handleRequestError,
  getApiMethod,
  mountHeaders,
} = require('../../../services')
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
} = require('../../../services/blockchain/transfer')
const TransactionController = require('../../transaction/controller')
const { FeeResponse, TransactionResponse } = require('../entity')
const WalletController = require('../../wallet/controller')

class Controller extends Interface {
  async sendTransaction(transaction) {
    try {
      const apiRequest = getApiMethod({
        requests,
        key: 'sendTransaction',
        config: this.config,
      })
      const headers = mountHeaders(this.config.apiKey)

      const { protocol, blob } = transaction
      const payload = { signedTx: blob }

      const response = await apiRequest(requests.sendTransaction.url, payload, {
        headers,
        params: { protocol },
      })

      return new TransactionResponse(response.data)
    } catch (error) {
      handleRequestError(error)
    }
  }

  async getFee({
    type,
    from = null,
    amount = null,
    destination = null,
    assetSymbol = null,
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
      const qs = new URLSearchParams({
        from: from ? from : '',
        destination: destination ? destination : '',
        contractAddress: contractAddress ? contractAddress : '',
        amount: amount ? amount : '',
        type,
        assetSymbol: assetSymbol ? assetSymbol : '',
        method: method ? method : '',
        params: params ? JSON.stringify(params) : '',
        protocol,
      })
      const response = await apiRequest(
        `${requests.getFee.url}?${qs.toString()}`,
        {
          headers,
        }
      )

      return new FeeResponse(response.data)
    } catch (error) {
      handleRequestError(error)
    }
  }

  async createStellarTrustlineTransaction(input) {
    const { wallet, assetSymbol, issuer, fee, limit, memo, testnet } = input
    const info = await new WalletController(this.config).getWalletInfo({
      address: wallet.publicKey,
      protocol: Protocol.STELLAR,
    })

    return buildStellarTrustlineTransaction({
      fromPublicKey: wallet.publicKey,
      fromPrivateKey: wallet.privateKey,
      assetSymbol,
      issuer,
      limit,
      memo,
      fee,
      sequence: info.sequence,
      testnet: testnet !== undefined ? testnet : wallet.testnet,
    })
  }

  async createRippleTrustlineTransaction(input) {
    const { wallet, assetSymbol, issuer, fee, limit, memo, testnet } = input
    const info = await new WalletController(this.config).getWalletInfo({
      address: wallet.address,
      protocol: Protocol.RIPPLE,
    })

    return buildRippleTrustlineTransaction({
      fromAddress: wallet.address,
      fromPrivateKey: wallet.privateKey,
      assetSymbol,
      issuer,
      limit,
      memo,
      fee,
      sequence: info.account_data.Sequence,
      maxLedgerVersion: info.ledger_current_index + 10,
      testnet: testnet !== undefined ? testnet : wallet.testnet,
    })
  }

  async createStellarTransferTransaction(input) {
    const {
      wallet,
      assetSymbol,
      issuer,
      amount,
      destination,
      memo,
      fee,
      testnet,
      startingBalance,
    } = input
    const info = await new WalletController(this.config).getWalletInfo({
      address: wallet.publicKey,
      protocol: Protocol.STELLAR,
    })
    return buildStellarTransferTransaction({
      fromPublicKey: wallet.publicKey,
      fromPrivateKey: wallet.privateKey,
      assetSymbol,
      issuer,
      amount,
      destination,
      memo,
      fee,
      sequence: info.sequence,
      testnet: testnet !== undefined ? testnet : wallet.testnet,
      startingBalance,
    })
  }

  async createRippleTransferTransaction(input) {
    const {
      wallet,
      assetSymbol,
      issuer,
      amount,
      destination,
      memo,
      fee,
      testnet,
    } = input
    const info = await new WalletController(this.config).getWalletInfo({
      address: wallet.address,
      protocol: Protocol.RIPPLE,
    })
    return await buildRippleTransferTransaction({
      fromAddress: wallet.address,
      fromPrivateKey: wallet.privateKey,
      assetSymbol,
      issuer,
      amount,
      destination,
      memo,
      fee,
      sequence: info.account_data.Sequence,
      maxLedgerVersion: info.ledger_current_index + 10,
      testnet: testnet !== undefined ? testnet : wallet.testnet,
    })
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
    const info = await new WalletController(this.config).getWalletInfo({
      address: wallet.address,
      protocol: Protocol.CELO,
    })

    if (!fee || !fee.gas || !fee.gasPrice) {
      fee = await this.getFee({
        type: 'transfer',
        from: wallet.address,
        destination,
        amount,
        assetSymbol: tokenSymbol,
        contractAddress:
          contractAddress ||
          getTokenAddress(Protocol.CELO, tokenSymbol, testnet),
        protocol: Protocol.CELO,
      })
    }
    return await buildCeloTransferTransaction({
      fromAddress: wallet.address,
      fromPrivateKey: wallet.privateKey,
      tokenSymbol,
      amount,
      destination,
      memo,
      fee,
      nonce: info.nonce,
      testnet: testnet !== undefined ? testnet : wallet.testnet,
      contractAddress,
      feeCurrency,
      feeCurrencyContractAddress,
    })
  }
}

module.exports = Controller
