const {
  handleRequestError,
  getApiMethod,
  mountHeaders,
} = require('../../../services')
const requests = require('./requests.json')
const Interface = require('./interface')
const { FeeResponse, TransactionResponse } = require('../entity')

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
      const response = await apiRequest(
        [
          `${requests.getFee.url}?`,
          `from=${from ? from : ''}&`,
          `destination=${destination ? destination : ''}&`,
          `contractAddress=${contractAddress ? contractAddress : ''}&`,
          `amount=${amount ? amount : ''}&`,
          `type=${type}&`,
          `asset=${assetSymbol ? assetSymbol : ''}&`,
          `method=${method ? method : ''}&`,
          `params=${params ? JSON.stringify(params) : ''}&`,
          `protocol=${protocol}`,
        ].join(''),
        {
          headers,
        }
      )

      return new FeeResponse(response.data)
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports = Controller
