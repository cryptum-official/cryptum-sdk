module.exports.getSwapControllerInstance = (config) => new Controller(config)
const { getApiMethod, mountHeaders, handleRequestError } = require('../../../services')
const Interface = require('./interface')
const requests = require('./requests.json')
const { InvalidTypeException } = require('../../../errors')

class Controller extends Interface {
  /**
   * Async method to retrieve list of all supported currencies to swap from and to. Examples: BTC, ETH, XLM, XRP, BNB, USDT and others.
   * @returns {Promise<string[]>} list of currencies
   */
  async getSupportedCurrencies() {
    try {
      const apiRequest = getApiMethod({ requests, key: 'getSupportedCurrencies', config: this.config })
      const headers = mountHeaders(this.config.apiKey)
      const response = await apiRequest(requests.getSupportedCurrencies.url, {
        headers,
      })

      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  }

  /**
   * Async method to retrieve the minimum amount to swap
   * @param {object} inputs
   * @param {string} inputs.currencyFrom criptocurrency to swap from
   * @param {string} inputs.currencyTo criptocurrency to swap to
   * @returns {Promise<{ currencyFrom:string, currencyTo:string, amount:string }>}
   */
  async getMinimumAmount(inputs = {}) {
    const { currencyFrom, currencyTo } = inputs
    if (!currencyFrom || typeof currencyFrom !== 'string') {
      throw new InvalidTypeException('currencyFrom', 'string')
    }
    if (!currencyTo || typeof currencyTo !== 'string') {
      throw new InvalidTypeException('currencyTo', 'string')
    }

    try {
      const apiRequest = getApiMethod({ requests, key: 'getMinimumAmount', config: this.config })
      const headers = mountHeaders(this.config.apiKey)

      const response = await apiRequest(requests.getMinimumAmount.url, {
        headers,
        params: {
          currencyFrom: currencyFrom,
          currencyTo: currencyTo,
        },
      })

      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  }

  /**
   * Estimate amount to receive from the swap.
   * @param {object} inputs
   * @param {string} inputs.currencyFrom criptocurrency to swap from
   * @param {string} inputs.currencyTo criptocurrency to swap to
   * @param {string} inputs.amount amount to swap
   * @returns {Promise<{ currencyFrom:string, currencyTo:string, amountTo:string }>}
   */
  async getEstimateAmount(inputs) {
    const { currencyFrom, currencyTo, amount } = inputs

    if (!currencyFrom || typeof currencyFrom !== 'string') {
      throw new InvalidTypeException('currencyFrom', 'string')
    }
    if (!currencyTo || typeof currencyTo !== 'string') {
      throw new InvalidTypeException('currencyTo', 'string')
    }
    if (!amount || typeof amount !== 'string') {
      throw new InvalidTypeException('amount', 'string')
    }

    try {
      const apiRequest = getApiMethod({ requests, key: 'getEstimateAmount', config: this.config })
      const headers = mountHeaders(this.config.apiKey)
      const response = await apiRequest(requests.getEstimateAmount.url, {
        headers,
        params: {
          currencyFrom: currencyFrom,
          currencyTo: currencyTo,
          amount: amount,
        },
      })

      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  }

  /**
   * Get the swap order by its id.
   * @param {string} id swap order id
   * @returns {Promise<SwapOrder>}
   */
  async getOrder(id) {
    if (!id || typeof id !== 'string') {
      throw new InvalidTypeException('id', 'string')
    }
    try {
      const apiRequest = getApiMethod({ requests, key: 'getOrder', config: this.config })
      const headers = mountHeaders(this.config.apiKey)
      const response = await apiRequest(requests.getOrder.url, {
        headers,
        params: {
          id: id,
        },
      })

      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  }

  /**
   * Create new swap order.
   * @param {object} input
   * @param {string} input.amountFrom destination address
   * @param {string} input.currencyFrom origin cryptocurrency to swap
   * @param {string} input.addressTo destination address
   * @param {string} input.currencyTo destination cryptocurrency
   * @param {string} input.memoTo memo or extra id string to pass along with the addressTo (only for some currencies like XLM, XRP, etc)
   * @param {string} input.refundAddress address to return funds to the user in case the swapping goes wrong
   * @param {string} input.refundFrom memo or extra id string to pass along with the refundAddress (only for some currencies like XLM, XRP, etc)
   * @returns {Promise<SwapOrder>}
   */
  async createOrder(input) {
    const { currencyFrom, currencyTo, amountFrom, addressTo, memoTo, refundAddress, refundMemo } = input

    if (!currencyFrom || typeof currencyFrom !== 'string') {
      throw new InvalidTypeException('currencyFrom', 'string')
    }
    if (!currencyTo || typeof currencyTo !== 'string') {
      throw new InvalidTypeException('currencyTo', 'string')
    }
    if (!amountFrom || typeof amountFrom !== 'string') {
      throw new InvalidTypeException('amountFrom', 'string')
    }
    if (!addressTo || typeof addressTo !== 'string') {
      throw new InvalidTypeException('addressTo', 'string')
    }
    if (memoTo && typeof memoTo !== 'string') {
      throw new InvalidTypeException('memoTo', 'string')
    }
    if (refundAddress && typeof refundAddress !== 'string') {
      throw new InvalidTypeException('refundAddress', 'string')
    }
    if (addressTo && typeof addressTo !== 'string') {
      throw new InvalidTypeException('refundMemo', 'string')
    }

    try {
      const apiRequest = getApiMethod({ requests, key: 'createOrder', config: this.config })
      const headers = mountHeaders(this.config.apiKey)
      const response = await apiRequest(requests.createOrder.url, {
        headers,
        params: {
          currencyFrom: currencyFrom,
          currencyTo: currencyTo,
          amountFrom: amountFrom,
          addressTo: addressTo,
          memoTo: memoTo,
          refundAddress: refundAddress,
          refundMemo: refundMemo,
        },
      })

      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  }

  /**
   * Get orders
   * @param {object} input
   * @param {number=} input.limit
   * @param {number=} input.offset
   * @param {Promise<SwapOrder[]>}
   */
  async getOrders(input = {}) {
    const { limit, offset } = input

    if (limit !== undefined && typeof limit !== 'number') {
      throw new InvalidTypeException('limit', 'number')
    }
    if (offset !== undefined && typeof offset !== 'number') {
      throw new InvalidTypeException('offset', 'number')
    }

    try {
      const apiRequest = getApiMethod({ requests, key: 'getOrders', config: this.config })
      const headers = mountHeaders(this.config.apiKey)
      const response = await apiRequest(`${requests.getOrders.url}?limit=${limit || 50}&offset=${offset || 0}`, {
        headers,
      })

      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  }
}

module.exports.SwapController = Controller
