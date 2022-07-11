module.exports.getTokenControllerInstance = (config) => new Controller(config)
const InvalidException = require('../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { Protocol } = require('../../../services/blockchain/constants')
const { ERC20_MINT_METHOD_ABI, ERC20_BURN_METHOD_ABI } = require('../../../services/blockchain/contract/abis')
const { toWei, toLamports } = require('../../../services/blockchain/utils')
const { validateEvmTokenMint, validateEvmTokenBurn } = require('../../../services/validations/evm')
const { getContractControllerInstance } = require('../../contract/controller')
const { getTransactionControllerInstance } = require('../../transaction/controller')
const { TransactionType } = require('../../transaction/entity')
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
   * @param {import('../entity').TokenBalanceInfoInput} input
   * @returns {Promise<import('../entity').TokenBalanceInfo>}
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
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
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
  /**
   * Create tokens
   * @param {import('../entity').TokenCreationInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async create(input) {
    const {
      protocol, wallet, symbol, name, amount, mintAuthorityAddress, meltAuthorityAddress, fixedSupply, decimals, feeCurrency
    } = input
    const tc = getTransactionControllerInstance(this.config)
    let tx;
    switch (protocol) {
      case Protocol.HATHOR:
        tx = await tc.createHathorTokenTransactionFromWallet({
          wallet,
          type: TransactionType.HATHOR_TOKEN_CREATION,
          tokenSymbol: symbol,
          tokenName: name,
          amount,
          mintAuthorityAddress,
          meltAuthorityAddress,
        })
        break
      case Protocol.SOLANA:
        return await tc.createSolanaTokenDeployTransaction({
          wallet,
          destination: wallet.address,
          amount,
          fixedSupply,
          decimals
        })
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN: {
        const decimalPlaces = !isNaN(decimals) ? Number(decimals) : 18
        return await getContractControllerInstance(this.config).deployToken({
          wallet,
          protocol,
          tokenType: 'ERC20',
          params: [name, symbol, decimalPlaces, amount],
          feeCurrency
        })
      }
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(tx)
  }
  /**
   * Set trustline for stellar and ripple assets
   * @param {import('../entity').SetTrustlineInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async setTrustline(input) {
    const { protocol, wallet, symbol, issuer, limit } = input
    const tc = getTransactionControllerInstance(this.config)
    let tx;
    switch (protocol) {
      case Protocol.STELLAR:
        tx = await tc.createStellarTrustlineTransaction({
          wallet,
          assetSymbol: symbol,
          issuer,
          limit
        })
        break
      case Protocol.RIPPLE:
        tx = await tc.createRippleTrustlineTransaction({
          wallet,
          assetSymbol: symbol,
          issuer,
          limit
        })
        break
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(tx)
  }
  /**
   * Mint tokens
   * @param {import('../entity').TokenMintInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async mint(input) {
    const { protocol, token, wallet, destination, amount, mintAuthorityAddress, feeCurrency } = input
    const tc = getTransactionControllerInstance(this.config)
    let tx;
    switch (protocol) {
      case Protocol.HATHOR:
        tx = await tc.createHathorTokenTransactionFromWallet({
          type: TransactionType.HATHOR_TOKEN_MINT,
          wallet,
          tokenUid: token,
          amount,
          address: destination,
          changeAddress: wallet.address,
          mintAuthorityAddress
        })
        break
      case Protocol.SOLANA: {
        const { decimals } = await this.getInfo({ protocol, tokenAddress: token })
        tx = await tc.createSolanaTokenMintTransaction({ wallet, destination, token, amount: toLamports(amount, decimals).toNumber() })
        break
      }
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN: {
        validateEvmTokenMint(input)
        const { decimals } = await this.getInfo({ protocol, tokenAddress: token })
        return await getContractControllerInstance(this.config).callMethodTransaction({
          wallet,
          protocol,
          contractAddress: token,
          method: 'mint',
          contractAbi: ERC20_MINT_METHOD_ABI,
          params: [destination, toWei(amount, decimals).toString()],
          feeCurrency
        })
      }
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(tx)
  }
  /**
   * Burn tokens
   * @param {import('../entity').TokenBurnInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async burn(input) {
    const { protocol, token, wallet, amount, meltAuthorityAddress, feeCurrency } = input
    const tc = getTransactionControllerInstance(this.config)
    let tx;
    switch (protocol) {
      case Protocol.HATHOR:
        tx = await tc.createHathorTokenTransactionFromWallet({
          type: TransactionType.HATHOR_TOKEN_MELT,
          wallet,
          tokenUid: token,
          amount,
          address: wallet.address,
          changeAddress: wallet.address,
          meltAuthorityAddress,
        })
        break
      case Protocol.SOLANA: {
        const { decimals } = await this.getInfo({ protocol, tokenAddress: token })
        tx = await tc.createSolanaTokenBurnTransaction({
          wallet, destination: wallet.address, token, amount: toLamports(amount, decimals).toString()
        })
        break
      }
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN: {
        validateEvmTokenBurn(input)
        const { decimals } = await this.getInfo({ protocol, tokenAddress: token })
        return await getContractControllerInstance(this.config).callMethodTransaction({
          wallet,
          protocol,
          contractAddress: token,
          method: 'burn',
          contractAbi: ERC20_BURN_METHOD_ABI,
          params: [toWei(amount, decimals).toString()],
          feeCurrency
        })
      }
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(tx)
  }
}
module.exports.TokenController = Controller
