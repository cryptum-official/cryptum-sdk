module.exports.getTokenControllerInstance = (config) => new Controller(config)
const InvalidException = require('../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { Protocol } = require('../../../services/blockchain/constants')
const { getTransactionControllerInstance } = require('../../transaction/controller')
const Interface = require('./interface')

class Controller extends Interface {
  /**
   * Get fungible token info
   * @param {import('../entity').TokenInfoInput} input
   * @returns {Promise<import('../entity').TokenInfo>}
   */
  async getInfo(input) {
    const { protocol, tokenUid, tokenAddress } = input
    switch (protocol) {
      case Protocol.HATHOR:
        return makeRequest({ method: 'get', url: `/token/${tokenUid}/info?protocol=${protocol}`, config: this.config })
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.SOLANA:
        return makeRequest({ method: 'get', url: `/token/${tokenAddress}/info?protocol=${protocol}`, config: this.config })
      default:
        throw new InvalidException('Unsupported protocol')
    }
  }
  /**
   * Get token balance
   * @param {import('../entity').NftBalanceInfoInput} input
   * @returns {Promise<import('../entity').NftBalanceInfo>}
   */
  async getBalance(input) {
    const { protocol, tokenUid, tokenAddress, address } = input
    switch (protocol) {
      case Protocol.HATHOR:
        return makeRequest({ method: 'get', url: `/token/${tokenUid}/balance/${address}?protocol=${protocol}`, config: this.config })
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.SOLANA:
        return makeRequest({
          method: 'get',
          url: `/token/${tokenAddress}/balance/${address}?protocol=${protocol}`, config: this.config
        })
      default:
        throw new InvalidException('Unsupported protocol')
    }
  }
  /**
   * Transfer tokens from wallet to destination address
   * @param {import('../entity').TokenTransferInput} input
   * @returns {Promise<HashResponse>}
   */
  async transfer(input) {
    const { protocol, token, wallet, destination, amount, destinations, issuer, memo, feeCurrency } = input
    const tc = getTransactionControllerInstance(this.config)
    let tx;
    switch (protocol) {
      case Protocol.HATHOR:
        tx = await tc.createHathorTransferTransactionFromWallet({
          wallet,
          outputs: destination ? [{
            address: destination, amount, token
          }] : destinations
        })
        break
      case Protocol.SOLANA:
        tx = await tc.createSolanaTransferTransaction({ wallet, destination, token, amount })
        break
      case Protocol.ETHEREUM:
        tx = await tc.createEthereumTransferTransaction({ wallet, tokenSymbol: token, contractAddress: token, destination, amount })
        break
      case Protocol.CELO:
        tx = await tc.createCeloTransferTransaction({ wallet, tokenSymbol: token, contractAddress: token, destination, amount, memo, feeCurrency })
        break
      case Protocol.BSC:
        tx = await tc.createBscTransferTransaction({ wallet, tokenSymbol: token, contractAddress: token, destination, amount })
        break
      case Protocol.POLYGON:
        tx = await tc.createPolygonTransferTransaction({ wallet, tokenSymbol: token, contractAddress: token, destination, amount })
        break
      case Protocol.AVAXCCHAIN:
        tx = await tc.createAvaxCChainTransferTransaction({ wallet, tokenSymbol: token, contractAddress: token, destination, amount })
        break
      case Protocol.BITCOIN:
        tx = await tc.createBitcoinTransferTransaction({ wallet, outputs: destinations })
        break
      case Protocol.CARDANO:
        tx = await tc.createCardanoTransferTransactionFromWallet({ wallet, outputs: destinations })
        break
      case Protocol.STELLAR:
        tx = await tc.createStellarTransferTransaction({ wallet, assetSymbol: token, issuer, amount, destination, memo })
        break
      case Protocol.RIPPLE:
        tx = await tc.createRippleTransferTransaction({ wallet, assetSymbol: token, issuer, amount, destination, memo })
        break
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(tx)
  }

  async mint(input) { }

  async burn(input) { }

}
module.exports.TokenController = Controller
