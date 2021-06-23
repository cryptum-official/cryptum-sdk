# Prices

List currency price quotations in realtime.

Possible tokens are: XLM, XRP, BTC, ETH, CELO, BNB

```js
const controller = sdk.getPricesController()
// list for XLM
const prices = await controller.getPrices('XLM')
// Prices {
//   "BRL": 1.318,
//   "USD": 0.2625,
//   "JPY": 29.08,
//   "EUR": 0.2196,
//   "GBP": 0.1878,
//   "AUD": 0.3466,
//   "CAD": 0.3232,
//   "CHF": 0.2412,
//   "CNH": 0.01154,
//   "SEK": 2.588,
//   "NZD": 0.3721,
//   "ETH": 0.00013122178731572712,
//   "XLM": 1
// }
```
