# Chainlink

The Cryptum SDK integrates natively with Chainlink, the leading platform for web3 services. Users can interact with Chainlink products within the SDK with a single line of code.

- [Price Feeds](#price-feeds)
- [Get price by Address](#get-price-by-address)
- [Get prices by Asset](#get-prices-by-asset)

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

[Read more about Chainlink Data Feeds](https://docs.chain.link/data-feeds)


## Get Price By Address

In our SDK, there are enums of contracts for token pairs on Ethereum mainnet and testnet. If you cannot find the pair you desire, check the available [Price Feeds Addresses](https://docs.chain.link/data-feeds/price-feeds/addresses).


```js
const address = sdk.chainlink.feeds.MAINNET.ETHEREUM.ADA_USD

const price = await sdk.chainlink.getPricesByAddres({
    protocol: "ETHEREUM",
    address: address
})
```

## Get Prices By Asset

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