module.exports.getTokenControllerInstance = (config) => new Controller(config)
const InvalidException = require('../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { Protocol } = require('../../../services/blockchain/constants')
const { ERC20_MINT_METHOD_ABI, ERC20_BURN_METHOD_ABI, ERC20_APPROVE_METHOD_ABI } = require('../../../services/blockchain/contract/abis')
const { toWei, toLamports } = require('../../../services/blockchain/utils')
const { validateEvmTokenMint, validateEvmTokenBurn } = require('../../../services/validations/evm')
const { validateTransferTransactionParams } = require("../../../services/validations")
const { getContractControllerInstance } = require('../../contract/controller')
const { getTransactionControllerInstance } = require('../../transaction/controller')
const { TransactionType, TransactionResponse, SignedTransaction } = require('../../transaction/entity')
const Interface = require('./interface')
const { signEthereumTx } = require('../../../services/blockchain/ethereum')
const { signCeloTx } = require('../../../services/blockchain/celo')

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
    const { protocol, token, wallet, destination, amount, destinations, issuer, memo, createAccount, feeCurrency, fee } = input
    validateTransferTransactionParams(input)
    const tc = getTransactionControllerInstance(this.config)
    let tx, builtTx;
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
      case Protocol.CELO:
        builtTx = await makeRequest(
          {
            method: 'post',
            url: `/tx/build/transfer-token?protocol=${protocol}`,
            body: { tokenSymbol: token, from: wallet.address, destination, amount, fee, contractAddress: token, feeCurrency, memo }, config: this.config
          })
        tx = new SignedTransaction({
          signedTx: await signCeloTx(builtTx, wallet.privateKey),
          protocol,
          type: TransactionType.TRANSFER
        })
        break;
      case Protocol.ETHEREUM:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
        builtTx = await makeRequest(
          {
            method: 'post',
            url: `/tx/build/transfer-token?protocol=${protocol}`,
            body: { tokenSymbol: token, from: wallet.address, destination, amount, fee, contractAddress: token }, config: this.config
          })
        tx = new SignedTransaction({
          signedTx: signEthereumTx(builtTx, protocol, wallet.privateKey, this.config.environment),
          protocol,
          type: TransactionType.TRANSFER
        })
        break;
      case Protocol.BITCOIN:
        tx = await tc.createBitcoinTransferTransaction({ wallet, outputs: destination ? [{ address: destination, amount }] : destinations, fee })
        break
      case Protocol.CARDANO:
        tx = await tc.createCardanoTransferTransactionFromWallet({ wallet, outputs: destinations })
        break
      case Protocol.STELLAR:
        tx = await tc.createStellarTransferTransaction({ wallet, assetSymbol: token, issuer, amount, destination, createAccount, memo })
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
    let tx, mint;
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
        ({ transaction: tx, mint } = await tc.createSolanaTokenDeployTransaction({
          wallet,
          amount,
          name,
          symbol,
          fixedSupply,
          decimals
        }))
        await tc.sendTransaction(tx)
        return new TransactionResponse({ hash: mint })
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
  /**
   * Invoke "approve" method from ERC20-compatible smart contracts
   * @param {import('../entity').TokenApproveInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async approve(input) {
    const { protocol, token, wallet, spender, amount, feeCurrency } = input
    switch (protocol) {
      case Protocol.ETHEREUM:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN: {
        const { decimals } = await this.getInfo({ protocol, tokenAddress: token })
        return await getContractControllerInstance(this.config).callMethodTransaction({
          wallet,
          protocol,
          contractAddress: token,
          method: 'approve',
          contractAbi: ERC20_APPROVE_METHOD_ABI,
          params: [spender, toWei(amount, decimals).toString()],
          feeCurrency
        })
      }
      default:
        throw new InvalidException('Unsupported protocol')
    }
  }
}
module.exports.TokenController = Controller
