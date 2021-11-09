# Prices

List currency price quotations in realtime.

Possible tokens are: XLM, XRP, BTC, ETH, CELO, BNB, MDA, HTR, ADA, AVAX, BRL, USD.

```js
const controller = sdk.getPricesController()
// list for XLM
const prices = await controller.getPrices('XLM')
// Prices {
//   "BRL": 1.811,
//   "USD": 0.3495,
//   "EUR": 0.2967,
//   "BTC": 7.35687406736623e-06,
//   "ETH": 0.00010271074069284932,
//   "XLM": 1,
//   "XRP": 0.29052369077306733,
//   "BNB": 0.0007402151812944764,
//   "MDA": 0.38824705620973116,
//   "CELO": 0.06321215409658167,
//   "HTR": 0.3900669642857143,
//   "ADA": 0.18340652,
//   "AVAX": 0.00475974
// }
```
