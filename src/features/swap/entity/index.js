/**
 * @typedef {object} SwapOrder
 * @property {string} createdAt timestamp
 * @property {string} id order id
 * @property {string} status order status "WAITING_PAYMENT", "WAITING_CONFIRMATIONS", "EXCHANGING", "FAILED", "COMPLETED", "REFUNDED", "EXPIRED"
 * @property {string} addressFrom origin address
 * @property {string} amountFrom destination address
 * @property {string} currencyFrom origin cryptocurrency to swap
 * @property {string} addressTo destination address
 * @property {string} amountTo destination cryptocurrency amount
 * @property {string} currencyTo destination cryptocurrency
 * @property {string} memoFrom memo or extra id string to pass along with the addressFrom (only for some currencies like XLM, XRP, etc)
 * @property {string} memoTo memo or extra id string to pass along with the addressTo (only for some currencies like XLM, XRP, etc)
 */
