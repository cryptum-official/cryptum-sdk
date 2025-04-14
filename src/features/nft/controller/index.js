module.exports.getNftControllerInstance = (config) => new Controller(config)

const InvalidException = require('../../../errors/InvalidException')
const { makeRequest } = require('../../../services')
const { Protocol } = require('../../../services/blockchain/constants')
const Interface = require('./interface')
const { getTransactionControllerInstance } = require('../../transaction/controller')
const {
  ERC721_APPROVE_METHOD_ABI,
  ERC1155_SETAPPROVALLFORALL_METHOD_ABI,
} = require('../../../services/blockchain/contract/abis')
const {
  validateEvmNftTransfer,
  validateEvmTokenCreation,
  validateEvmNftMint,
  validateEvmNftBurn,
} = require('../../../services/validations/evm')
const { getContractControllerInstance } = require('../../contract/controller')
const { TransactionType, TransactionResponse, SignedTransaction } = require('../../transaction/entity')
const { signEthereumTx } = require('../../../services/blockchain/ethereum')

class Controller extends Interface {
  /**
   * Get token info
   * @param {import('../entity').NftInfoInput} input
   * @returns {Promise<import('../entity').NftInfo>}
   */
  async getInfo(input) {
    const { protocol, tokenUid, tokenAddress } = input
    switch (protocol) {
      case Protocol.HATHOR:
        return makeRequest({ method: 'get', url: `/nft/${tokenUid}/info?protocol=${protocol}`, config: this.config })
      case Protocol.ETHEREUM:
      case Protocol.STRATUS:
      case Protocol.BESU:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ:
      case Protocol.SOLANA:
        return makeRequest({
          method: 'get',
          url: `/nft/${tokenAddress}/info?protocol=${protocol}`,
          config: this.config,
        })
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
    const { protocol, tokenUid, tokenAddress, tokenId, address } = input
    switch (protocol) {
      case Protocol.HATHOR:
        return makeRequest({
          method: 'get',
          url: `/nft/${tokenUid}/balance/${address}?protocol=${protocol}`,
          config: this.config,
        })
      case Protocol.ETHEREUM:
      case Protocol.STRATUS:
      case Protocol.BESU:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ:
      case Protocol.SOLANA:
        return makeRequest({
          method: 'get',
          url: `/nft/${tokenAddress}/balance/${address}?protocol=${protocol}&${tokenId ? `tokenId=${tokenId}` : ''}`,
          config: this.config,
        })
      default:
        throw new InvalidException('Unsupported protocol')
    }
  }
  /**
   * Get metadata of nft
   * @param {import('../entity').NftMetadataInput} input
   * @returns {Promise<import('../entity').NftMetadata>}
   */
  async getMetadata(input) {
    const { protocol, tokenUid, tokenAddress, tokenId } = input
    switch (protocol) {
      case Protocol.HATHOR:
        return makeRequest({
          method: 'get',
          url: `/nft/${tokenUid}/metadata?protocol=${protocol}`,
          config: this.config,
        })
      case Protocol.ETHEREUM:
      case Protocol.STRATUS:
      case Protocol.BESU:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ:
      case Protocol.SOLANA:
        return makeRequest({
          method: 'get',
          url: `/nft/${tokenAddress}/metadata?protocol=${protocol}&tokenId=${tokenId}`,
          config: this.config,
        })
      default:
        throw new InvalidException('Unsupported protocol')
    }
  }
  /**
   * Create NFTs
   * @param {import('../entity').NftCreationInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async create(input) {
    const {
      protocol,
      wallet,
      symbol,
      name,
      amount,
      uri,
      mintAuthorityAddress,
      meltAuthorityAddress,
      creators,
      royaltiesFee,
      collection,
      maxSupply,
      feeCurrency,
      type,
      fee,
    } = input
    const tc = getTransactionControllerInstance(this.config)
    let tx, mint
    switch (protocol) {
      case Protocol.HATHOR:
        tx = await tc.createHathorTokenTransactionFromWallet({
          wallet,
          type: TransactionType.HATHOR_TOKEN_CREATION,
          tokenSymbol: symbol,
          tokenName: name,
          amount,
          nftData: uri,
          mintAuthorityAddress,
          meltAuthorityAddress,
        })
        break
      case Protocol.SOLANA: {
        ;({ transaction: tx, mint } = await tc.createSolanaNFTTransaction({
          wallet,
          maxSupply: maxSupply !== undefined ? Number(maxSupply) : 0,
          amount: Number(amount),
          uri,
          name,
          symbol,
          creators,
          royaltiesFee,
          collection,
        }))
        await tc.sendTransaction(tx)
        return new TransactionResponse({ hash: mint })
      }
      case Protocol.ETHEREUM:
      case Protocol.STRATUS:
      case Protocol.BESU:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ: {
        validateEvmTokenCreation(input)
        const builtTx = await makeRequest({
          method: 'post',
          url: `/tx/build/deploy-token?protocol=${protocol}`,
          body: { protocol, from: wallet.address, symbol, name, type, feeCurrency, uri, fee },
          config: this.config,
        })
        let signedTx = signEthereumTx(builtTx, protocol, wallet.privateKey, this.config.environment)

        tx = new SignedTransaction({
          signedTx,
          protocol,
          type: TransactionType.DEPLOY_CONTRACT,
        })
        break
      }
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(tx)
  }
  /**
   * Transfer NFT
   * @param {import('../entity').NftTransferInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async transfer(input) {
    const { protocol, token, wallet, destination, tokenId, amount, destinations, feeCurrency, fee } = input
    const tc = getTransactionControllerInstance(this.config)
    let tx
    switch (protocol) {
      case Protocol.HATHOR:
        tx = await tc.createHathorTransferTransactionFromWallet({
          wallet,
          outputs: destination
            ? [
                {
                  address: destination,
                  amount,
                  token,
                },
              ]
            : destinations,
        })
        break
      case Protocol.SOLANA:
        tx = await tc.createSolanaTransferTransaction({ wallet, destination, token, amount, isNFT: true })
        break
      case Protocol.ETHEREUM:
      case Protocol.STRATUS:
      case Protocol.BESU:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ: {
        validateEvmNftTransfer(input)
        const builtTx = await makeRequest({
          method: 'post',
          url: `/tx/build/transfer-nft?protocol=${protocol}`,
          body: { token, from: wallet.address, destination, tokenId, amount, feeCurrency, fee },
          config: this.config,
        })
        let signedTx = signEthereumTx(builtTx, protocol, wallet.privateKey, this.config.environment)

        tx = new SignedTransaction({
          signedTx,
          protocol,
          type: TransactionType.DEPLOY_CONTRACT,
        })
        break
      }
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(tx)
  }
  /**
   * Mint NFTs
   * @param {import('../entity').NftMintInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async mint(input) {
    const { protocol, token, wallet, destination, amount, tokenId, uri, mintAuthorityAddress, feeCurrency, fee } = input
    const tc = getTransactionControllerInstance(this.config)
    let tx
    switch (protocol) {
      case Protocol.HATHOR:
        tx = await tc.createHathorTokenTransactionFromWallet({
          type: TransactionType.HATHOR_NFT_MINT,
          wallet,
          tokenUid: token,
          amount,
          address: destination,
          changeAddress: wallet.address,
          mintAuthorityAddress,
        })
        break
      case Protocol.SOLANA: {
        if (amount !== undefined || Number(amount) > 1) {
          tx = await tc.createSolanaTokenMintTransaction({ wallet, destination, token, amount })
        } else {
          return await tc.createSolanaNFTEdition({ wallet, masterEdition: token })
        }
        break
      }
      case Protocol.ETHEREUM:
      case Protocol.STRATUS:
      case Protocol.BESU:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ: {
        validateEvmNftMint(input)
        const builtTx = await makeRequest({
          method: 'post',
          url: `/tx/build/mint-nft?protocol=${protocol}`,
          body: { protocol, from: wallet.address, amount, feeCurrency, uri, tokenId, destination, token, fee },
          config: this.config,
        })
        let signedTx = signEthereumTx(builtTx, protocol, wallet.privateKey, this.config.environment)

        tx = new SignedTransaction({
          signedTx,
          protocol,
          type: TransactionType.DEPLOY_CONTRACT,
        })
        break
      }
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(tx)
  }
  /**
   * Burn NFTs
   * @param {import('../entity').NftBurnInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async burn(input) {
    const { protocol, token, wallet, amount, tokenId, feeCurrency, meltAuthorityAddress, fee } = input
    const tc = getTransactionControllerInstance(this.config)
    let tx
    switch (protocol) {
      case Protocol.HATHOR:
        tx = await tc.createHathorTokenTransactionFromWallet({
          type: TransactionType.HATHOR_NFT_MELT,
          wallet,
          tokenUid: token,
          amount,
          address: wallet.address,
          changeAddress: wallet.address,
          meltAuthorityAddress,
        })
        break
      case Protocol.SOLANA:
        tx = await tc.createSolanaTokenBurnTransaction({ wallet, token, amount })
        break
      case Protocol.ETHEREUM:
      case Protocol.STRATUS:
      case Protocol.BESU:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ: {
        validateEvmNftBurn(input)
        const builtTx = await makeRequest({
          method: 'post',
          url: `/tx/build/burn-nft?protocol=${protocol}`,
          body: { protocol, from: wallet.address, amount, feeCurrency, tokenId, token, fee },
          config: this.config,
        })
        let signedTx = signEthereumTx(builtTx, protocol, wallet.privateKey, this.config.environment)

        tx = new SignedTransaction({
          signedTx,
          protocol,
          type: TransactionType.DEPLOY_CONTRACT,
        })
        break
      }
      default:
        throw new InvalidException('Unsupported protocol')
    }
    return await tc.sendTransaction(tx)
  }
  /**
   * Invoke "approve" method from ERC721-compatible smart contracts
   * @param {import('../entity').NftApproveInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async approve(input) {
    const { protocol, token, wallet, tokenId, feeCurrency, operator, fee } = input
    switch (protocol) {
      case Protocol.ETHEREUM:
      case Protocol.STRATUS:
      case Protocol.BESU:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ: {
        return await getContractControllerInstance(this.config).callMethodTransaction({
          wallet,
          protocol,
          contractAddress: token,
          method: 'approve',
          contractAbi: ERC721_APPROVE_METHOD_ABI,
          params: [operator, tokenId],
          feeCurrency,
          fee,
        })
      }
      default:
        throw new InvalidException('Unsupported protocol')
    }
  }
  /**
   * Invoke "setApprovalForAll" method from ERC721/ERC1155-compatible smart contracts
   * @param {import('../entity').NftSetApprovalForAllInput} input
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async setApprovalForAll(input) {
    const { protocol, token, wallet, isApproved, feeCurrency, operator, fee } = input
    switch (protocol) {
      case Protocol.ETHEREUM:
      case Protocol.STRATUS:
      case Protocol.BESU:
      case Protocol.CELO:
      case Protocol.BSC:
      case Protocol.POLYGON:
      case Protocol.AVAXCCHAIN:
      case Protocol.CHILIZ: {
        return await getContractControllerInstance(this.config).callMethodTransaction({
          wallet,
          protocol,
          contractAddress: token,
          method: 'setApprovalForAll',
          contractAbi: ERC1155_SETAPPROVALLFORALL_METHOD_ABI,
          params: [operator, isApproved],
          feeCurrency,
          fee,
        })
      }
      default:
        throw new InvalidException('Unsupported protocol')
    }
  }
}

module.exports.NftController = Controller
