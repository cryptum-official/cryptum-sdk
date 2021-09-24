const { getApiMethod, mountHeaders, handleRequestError } = require('../../../services')
const Interface = require('./interface')
const Swap = require('../entity')
const requests = require('./requests.json');
const {
    InvalidTypeException,
} = require('../../../../errors');


class Controller extends Interface {

    /**
     * Async method to retrieve list of all supported currencies to swap from and to. Examples: BTC, ETH, XLM, XRP, BNB, USDT and others.
     */
    async getSupportedCurrencies() {
        try {

            const apiRequest = getApiMethod({ requests, key: 'getSupportedCurrencies', config: this.config })
            const headers = mountHeaders(this.config.apiKey)
            const response = await apiRequest(requests.getSupportedCurrencies.url, {
                headers,
            })

            return new Swap(response.data)
        } catch (error) {
            handleRequestError(error)
        }
    }


    /**
     * Async method to retrieve the minimum amount to swap
     */
    async getMinimumAmount(inputs) {
        const { currencyFrom, currencyTo } = inputs;
        if (!currencyFrom || typeof currencyFrom !== 'string') {
            throw new InvalidTypeException('currencyFrom', 'string');
        }
        if (!currencyTo || typeof currencyTo !== 'string') {
            throw new InvalidTypeException('currencyTo', 'string');
        }

        try {

            const apiRequest = getApiMethod({ requests, key: 'getMinimumAmount', config: this.config })
            const headers = mountHeaders(this.config.apiKey)

            const response = await apiRequest(requests.getMinimumAmount.url, {
                headers,
                params: {
                    'currencyFrom': currencyFrom,
                    'currencyTo': currencyTo
                }
            })

            return new Swap(response.data)
        } catch (error) {
            handleRequestError(error)
        }
    }



    /**
     * Estimate amount to receive from the swap.
     */
    async getEstimateAmount(inputs) {
        const { currencyFrom, currencyTo, amount } = inputs;
        
        if (!currencyFrom || typeof currencyFrom !== 'string') {
            throw new InvalidTypeException('currencyFrom', 'string');
        }
        if (!currencyTo || typeof currencyTo !== 'string') {
            throw new InvalidTypeException('currencyTo', 'string');
        }
        if (!amount || typeof amount !== 'string') {
            throw new InvalidTypeException('amount', 'string');
        }

        try {
            const apiRequest = getApiMethod({ requests, key: 'getEstimateAmount', config: this.config })
            const headers = mountHeaders(this.config.apiKey)
            const response = await apiRequest(requests.getEstimateAmount.url, {
                headers,
                params: {
                    'currencyFrom': currencyFrom,
                    'currencyTo': currencyTo,
                    'amount': amount
                }
            })

            return new Swap(response.data)
        } catch (error) {
            handleRequestError(error)
        }
    }



    /**
     * Get the swap order by its id.
     */
    async getOrder(id) {
        if (!id || typeof id !== 'string') {
            throw new InvalidTypeException('id', 'string');
        }
        try {

            const apiRequest = getApiMethod({ requests, key: 'getOrder', config: this.config })
            const headers = mountHeaders(this.config.apiKey)
            const response = await apiRequest(requests.getOrder.url, {
                headers,
                params: {
                    'id': id
                }
            })

            return new Swap(response.data)
        } catch (error) {
            handleRequestError(error)
        }
    }


    /**
     * Create new swap order.
     */
    async createOrder(inputs) {

        const {
            currencyFrom,
            currencyTo,
            amountFrom,
            addressTo,
            memoTo,
            refundAddress,
            refundMemo,
        } = inputs

        if (!currencyFrom || typeof currencyFrom !== 'string') {
            throw new InvalidTypeException('currencyFrom', 'string');
        }
        if (!currencyTo || typeof currencyTo !== 'string') {
            throw new InvalidTypeException('currencyTo', 'string');
        }     
        if (!amountFrom || typeof amountFrom !== 'string') {
            throw new InvalidTypeException('amountFrom', 'string');
        }
        if (!addressTo || typeof addressTo !== 'string') {
            throw new InvalidTypeException('addressTo', 'string');
        }        
        if (memoTo && typeof memoTo !== 'string') {
            throw new InvalidTypeException('memoTo', 'string');
        }     
        if (refundAddress && typeof refundAddress !== 'string') {
            throw new InvalidTypeException('refundAddress', 'string');
        }
        if (addressTo && typeof addressTo !== 'string') {
            throw new InvalidTypeException('refundMemo', 'string');
        }                

        try {

            const apiRequest = getApiMethod({ requests, key: 'createOrder', config: this.config })
            const headers = mountHeaders(this.config.apiKey)
            const response = await apiRequest(requests.createOrder.url, {
                headers,
                params: {
                    'currencyFrom': currencyFrom,
                    'currencyTo': currencyTo,
                    'amountFrom': amountFrom,
                    'addressTo': addressTo,
                    'memoTo': memoTo,
                    'refundAddress': refundAddress,
                    'refundMemo': refundMemo
                }
            })

            return new Swap(response.data)
        } catch (error) {
            handleRequestError(error)
        }
    }



    /**
     * Get orders
     */
    async getOrders(input) {

        const { limit, offset } = input;

        if (!limit || typeof limit !== 'number') {
            throw new InvalidTypeException('limit', 'number');
        }
        if (!offset || typeof offset !== 'number') {
            throw new InvalidTypeException('offset', 'number');
        }        

        try {

            const apiRequest = getApiMethod({ requests, key: 'getOrders', config: this.config })
            const headers = mountHeaders(this.config.apiKey)
            const response = await apiRequest(`${requests.getOrders.url}?limit=${limit}&offset=${offset}`, {
                headers,
            })

            return new Swap(response.data)
        } catch (error) {
            handleRequestError(error)
        }
    }

}

module.exports = Controller
