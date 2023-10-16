# Chainlink

- [Price Feeds](#price-feeds)
- [Get price](#get-price)
- [Get prices](#get-prices)

Instantiate Cryptum SDK first:
```js
const sdk = new CryptumSdk({
  environment: 'testnet',
  apiKey: 'YOUR-API-KEY'
})
```

## Price Feeds

Smart contracts often act in real-time on data such as prices of assets. This is especially true in DeFi.
For example, Synthetix uses Data Feeds to determine prices on their derivatives platform. Lending and borrowing platforms like AAVE use Data Feeds to ensure the total value of the collateral.
Data Feeds aggregate many data sources and publish them on-chain using a combination of the Decentralized Data Model and Off-Chain Reporting.
[Chainlink Data Feeds](https://docs.chain.link/data-feeds)


## Get Price

In our SDK, there are enums of contracts for token pairs on the Ethereum mainnet and testnet. If you cannot find the pair you desire, you can check at [Price Feeds Addresses](https://docs.chain.link/data-feeds/price-feeds/addresses).


```js
const address = sdk.chainlink.feeds.MAINNET.ETHEREUM.ADA_USD

const price = await sdk.chainlink.getPricesByAddres({
    protocol: "ETHEREUM",
    address: address
})
```

## Get Prices

List currency price quotations

```js
const price = await sdk.chainlink.getPrices({
    protocol: "ETHEREUM",
    asset: 'ETH'
})
// Prices {
//   "USD": 0.3495,
//   "BTC": 7.35687406736623e-06,
//   "ETH": 0.00010271074069284932,
//   "SOL":0.00144091,
// }
```