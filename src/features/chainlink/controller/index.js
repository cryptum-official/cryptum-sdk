module.exports.getChainlinkController = (config) => new Controller(config)
const PriceFeeds = require("../../../services/blockchain/chainlink/priceFeeds")
const Interface = require('./interface')
const { makeRequest } = require('../../../services')
const { Prices } = require("../entity")
const { signEthereumTx } = require("../../../services/blockchain/ethereum")
const { SignedTransaction, TransactionType } = require("../../transaction/entity")
const { getTransactionControllerInstance } = require("../../transaction/controller")

class Controller extends Interface {
    feeds = PriceFeeds.priceFeeds


    /**
     * Get prices by Asset
     * @param {import('../entity').PriceInput} input
     */
    async getPrices(input) {
        const { protocol, asset } = input;
        const response = await makeRequest({ method: 'get', url: `/chainlink/prices/${asset}?protocol=${protocol}`, config: this.config })
        return new Prices(response)
    }

    /**
     * Get latest price 
     * @param {import('../entity').PriceFeedInput} input
     * @returns {Promise<import('../entity').PriceFeedResponse>}
     */
    async getPricesByAddress(input) {
        const { protocol, address } = input;
        return makeRequest({ method: 'get', url: `/chainlink/pricefeed/${address}?protocol=${protocol}`, config: this.config })
    }

    /**
     * Create subscription VRF
     * @param {import('../entity').CreateVRFInput} input
     * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
     */
    async createVRF(input) {
        const { protocol, wallet, updateIntervalUpkeep } = input;
        const tc = getTransactionControllerInstance(this.config)
        const builtSubscription = await makeRequest({
            method: 'post',
            url: `/chainlink/subscription/build?protocol=${protocol}`,
            body: { from: wallet.address, updateIntervalUpkeep },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtSubscription, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.DEPLOY_CONTRACT,
        })
        return await tc.sendTransaction(tx)
    }

    /**
     * Cancel subscription VRF
     * @param {import('../entity').CancelVRFInput} input
     * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
     */
    async cancelVRF(input) {
        const { protocol, wallet, address } = input;
        const tc = getTransactionControllerInstance(this.config)
        const builtSubscription = await makeRequest({
            method: 'post',
            url: `/chainlink/subscription/${address}/cancel?protocol=${protocol}`,
            body: { from: wallet.address },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtSubscription, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.CALL_CONTRACT_METHOD,
        })
        return await tc.sendTransaction(tx)
    }

    /**
     * topUp subscription VRF
     * @param {import('../entity').TopUpSubscriptionInput} input
     * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
     */
    async topUpVRF(input) {
        const { protocol, wallet, amount, address } = input;
        const tc = getTransactionControllerInstance(this.config)
        const builtSubscriptionTopUp = await makeRequest({
            method: 'post',
            url: `/chainlink/subscription/${address}/topUp?protocol=${protocol}`,
            body: { from: wallet.address, amount },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtSubscriptionTopUp, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.TRANSFER,
        })
        return await tc.sendTransaction(tx)
    }

    /**
     * Request random words subscription VRF
     * @param {import('../entity').RequestRandomWordsSubscriptionInput} input
     * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
     */
    async requestRandomWordsVRF(input) {
        const { protocol, wallet, numWords, address } = input;
        const tc = getTransactionControllerInstance(this.config)
        const builtRandomWords = await makeRequest({
            method: 'post',
            url: `/chainlink/subscription/${address}/randomWords?protocol=${protocol}`,
            body: { from: wallet.address, numWords },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtRandomWords, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.CALL_CONTRACT_METHOD,
        })
        return await tc.sendTransaction(tx)
    }

    /**
    * Get subscription
    * @param {import('../entity').PriceFeedInput} input
    * @returns {Promise<import('../entity').ResponseSubscription>}
    */
    async getSubscriptionVRF(input) {
        const { protocol, address } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/subscription/${address}?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
    * Get subscription by Id
    * @param {import('../entity').SubscriptionByIdInput} input
    * @returns {Promise<import('../entity').ResponseSubscription>}
    */
    async getSubscriptionByIdVRF(input) {
        const { protocol, id } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/subscriptionById/${id}?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
    * List requests Random Words Subscription VRF
    * @param {import('../entity').PriceFeedInput} input
    * @returns {Promise<import('../entity').ResponseListRequests>}
    */
    async requestsVRF(input) {
        const { protocol, address } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/subscription/${address}/listRequests?protocol=${protocol}`,
            config: this.config
        })
    }
    /**
    * Latest request Random Words Subscription VRF
    * @param {import('../entity').PriceFeedInput} input
    * @returns {Promise<import('../entity').ResponseListRequests>}
    */
    async latestRequestVRF(input) {
        const { protocol, address } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/subscription/${address}/lastestRequest?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
    * Get random words by requestId
    * @param {import('../entity').GetRandomWordsInput} input
    * @returns {Promise<import('../entity').RandomWordsResponse>}
    */
    async getRandomWordsVRF(input) {
        const { protocol, address, requestId } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/subscription/${address}/randomWords/${requestId}?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
    * Create automation
    * @param {import('../entity').PriceFeedInput} input
    * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
    */
    async createAutomation(input) {
        const { protocol, wallet } = input;
        const tc = getTransactionControllerInstance(this.config)
        const builtAutomation = await makeRequest({
            method: 'post',
            url: `/chainlink/automation/build?protocol=${protocol}`,
            body: { from: wallet.address },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtAutomation, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.DEPLOY_CONTRACT,
        })
        return await tc.sendTransaction(tx)
    }

    /**
    * List Upkeeps
    * @param {import('../entity').PriceFeedInput} input
    * @returns {Promise<import('../entity').ResponseListUpkeeps>}
    */
    async listUpkeeps(input) {
        const { protocol, address } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/automation/${address}/list?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
    * Upkeep info
    * @param {import('../entity').UpkeepInfoInput} input
    * @returns {Promise<import('../entity').ResponseUpkeepInfo>}
    */
    async getUpkeep(input) {
        const { protocol, upkeepID } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/automation/${upkeepID}?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
    * Balance Upkeep
    * @param {import('../entity').UpkeepBalanceInput} input
    * @returns {Promise<import('../entity').ResponseUpkeepBalance>}
    */
    async getBalanceUpkeep(input) {
        const { protocol, address, upkeepID } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/automation/${address}/${upkeepID}/balance?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
    * Register Upkeep
    * @param {import('../entity').RegisterUpkeepInput} input
    * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
    */
    async registerUpkeep(input) {
        const { protocol, address, wallet, ...params } = input;
        const tc = getTransactionControllerInstance(this.config)
        const builtRegisterUpkeep = await makeRequest({
            method: 'post',
            url: `/chainlink/automation/${address}/registerUpkeep?protocol=${protocol}`,
            body: { from: wallet.address, ...params },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtRegisterUpkeep, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.CALL_CONTRACT_METHOD,
        })
        return await tc.sendTransaction(tx)
    }

    async #callActionUpkeep(input) {
        const { protocol, wallet, upkeepID, action, amount } = input
        const tc = getTransactionControllerInstance(this.config)
        const builtRegisterUpkeep = await makeRequest({
            method: 'post',
            url: `/chainlink/automation/${upkeepID}/${action}?protocol=${protocol}`,
            body: { from: wallet.address, amount },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtRegisterUpkeep, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.CALL_CONTRACT_METHOD,
        })
        return await tc.sendTransaction(tx)
    }

    /**
    * Pause Upkeep
    * @param {import('../entity').RegisterUpkeepInput} input
    * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
    */
    async pauseUpkeep(input) {
        return this.#callActionUpkeep({ ...input, action: 'pause' })
    }

    /**
    * Unpause Upkeep
    * @param {import('../entity').RegisterUpkeepInput} input
    * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
    */
    async unpauseUpkeep(input) {
        return this.#callActionUpkeep({ ...input, action: 'unpause' })
    }

    /**
    * Cancel Upkeep
    * @param {import('../entity').RegisterUpkeepInput} input
    * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
    */
    async cancelUpkeep(input) {
        return this.#callActionUpkeep({ ...input, action: 'cancel' })
    }

    /**
    * Withdraw Upkeep
    * @param {import('../entity').RegisterUpkeepInput} input
    * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
    */
    async withdrawUpkeep(input) {
        return this.#callActionUpkeep({ ...input, action: 'withdraw' })
    }

    /**
    * Withdraw Upkeep
    * @param {import('../entity').EditGasLimitInput} input
    * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
    */
    async editGasLimitUpkeep(input) {
        const { protocol, wallet, upkeepID, gasLimit } = input
        const tc = getTransactionControllerInstance(this.config)
        const builtRegisterUpkeep = await makeRequest({
            method: 'post',
            url: `/chainlink/automation/${upkeepID}/editGas?protocol=${protocol}`,
            body: { from: wallet.address, gasLimit },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtRegisterUpkeep, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.CALL_CONTRACT_METHOD,
        })
        return await tc.sendTransaction(tx)
    }

    /**
    * Add Funds Upkeep
    * @param {import('../entity').UpkeepActionInput} input
    * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
    */
    async addFundsUpkeep(input) {
        const { protocol, wallet, upkeepID, amount } = input
        const tc = getTransactionControllerInstance(this.config)
        const builtRegisterUpkeep = await makeRequest({
            method: 'post',
            url: `/chainlink/automation/${upkeepID}/addFunds?protocol=${protocol}`,
            body: { from: wallet.address, amount },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtRegisterUpkeep, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.CALL_CONTRACT_METHOD,
        })
        return await tc.sendTransaction(tx)
    }

    /**
    * Get status CCIP
    * @param {import('../entity').StatusCCIPInput} input
    * @returns {Promise<import('../entity').ResponseStatusCCIP>}
    */
    async getStatusCCIP(input) {
        const { protocol, messageId, destinationProtocol } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/ccip?protocol=${protocol}&messageId=${messageId}&destinationProtocol=${destinationProtocol}`,
            config: this.config
        })
    }

    /**
    * Get status CCIP By Hash
    * @param {object} input
    * @param {string} input.hash
    */
    async getStatusCCIPByHash(input) {
        const { hash } = input;

        const { transactionHash } = await makeRequest({
            method: 'get',
            url: `https://ccip.chain.link/api/h/atlas/search?msgIdOrTxnHash=${hash}`,
            config: this.config
        })
        return transactionHash
    }

    /**
    * Send token CCIP EOA (Externally Owned Account)
    * @param {import('../entity').TransferTokenCCIPInput} input
    * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
    */
    async sendTokenCCIPEoa(input) {

        const { protocol, wallet, to, amount, tokenAddress, destinationProtocol, feeTokenAddress } = input
        const tc = getTransactionControllerInstance(this.config)

        const builtSendToken = await makeRequest({
            method: 'post',
            url: `/chainlink/ccip/sendTokenEOA?protocol=${protocol}`,
            body: { from: wallet.address, to, amount, tokenAddress, destinationProtocol, feeTokenAddress },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })

        let hash
        for (let rawTransaction of builtSendToken) {
            const signedTx = signEthereumTx(rawTransaction, protocol, wallet.privateKey, this.config.environment)
            const tx = new SignedTransaction({
                signedTx,
                protocol,
                type: TransactionType.CALL_CONTRACT_METHOD,
            })
            hash = await tc.sendTransaction(tx)
        }

        return hash
    }

    /**
     * @param {import('../entity').CreateCCIP} input
     * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
     */
    async createCCIP(input) {
        const { protocol, wallet } = input
        const tc = getTransactionControllerInstance(this.config)
        const builtCCIP = await makeRequest({
            method: 'post',
            url: `/chainlink/ccip/build?protocol=${protocol}`,
            body: { from: wallet.address },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtCCIP, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.DEPLOY_CONTRACT,
        })
        return await tc.sendTransaction(tx)
    }

    /**
     * Get last received message
     * @param {import('../entity').GetCCIP} input
     * @returns {Promise<import('../entity').ResponseLastReceivedMessageCCIP>}
     */
    async getLastReceivedMessageDetailsCCIP(input) {
        const { address, protocol } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/ccip/lastReceivedMessage/${address}?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
     * Get last sended message
     * @param {import('../entity').GetCCIP} input
     * @returns {Promise<import('../entity').ResponseLastReceivedMessageCCIP>}
     */
    async getLastSendMessageDetailsCCIP(input) {
        const { address, protocol } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/ccip/lastsendMessage/${address}?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
     * Get Received Messages Id
     * @param {import('../entity').GetCCIP} input
     * @returns {Promise<import('../entity').ResponseMessagesIdCCIP>}
     */
    async getReceivedMessagesIdCCIP(input) {
        const { address, protocol } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/ccip/receiveMessagesId/${address}?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
     * Get sended Messages Id
     * @param {import('../entity').GetCCIP} input
     * @returns {Promise<import('../entity').ResponseMessagesIdCCIP>}
     */
    async getSendMessagesIdCCIP(input) {
        const { address, protocol } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/ccip/sendMessagesId/${address}?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
     * Allow listed sender
     * @param {import('../entity').AllowlistedSendersCCIP} input
     * @returns {Promise<boolean>}
     */
    async allowlistedSendersCCIP(input) {
        const { address, protocol, senderAddress } = input;
        return await makeRequest({
            method: 'get',
            url: `/chainlink/ccip/allowSenders/${address}/${senderAddress}?protocol=${protocol}`,
            config: this.config
        })
    }

    /**
     * Allow sender
     * @param {import('../entity').AllowSenderCCIP} input
     * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
     */
    async allowSenderCCIP(input){
        const { protocol, wallet, address, senderAddress, allowed } = input
        const tc = getTransactionControllerInstance(this.config)
        const builtCCIP = await makeRequest({
            method: 'post',
            url: `/chainlink/ccip/buildAllowSender?protocol=${protocol}`,
            body: { from: wallet.address, address, senderAddress, allowed },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtCCIP, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.CALL_CONTRACT_METHOD,
        })
        return await tc.sendTransaction(tx)
    }


    /**
     * Send Message
     * @param {import('../entity').SendMessageCCIP} input
     * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
     */
    async sendMessageCCIP(input){
        const { protocol, wallet, contractAddress, destinationProtocol, text, tokenAddress, amount, to, payLink } = input
        const tc = getTransactionControllerInstance(this.config)
        const builtCCIP = await makeRequest({
            method: 'post',
            url: `/chainlink/ccip/buildSendMessage?protocol=${protocol}`,
            body: { from: wallet.address, contractAddress, destinationProtocol, text, tokenAddress, amount, to, payLink },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtCCIP, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.CALL_CONTRACT_METHOD,
        })
        return await tc.sendTransaction(tx)
    }


    /**
     * Withdraw contract
     * @param {import('../entity').WithdrawCCIP} input
     * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
     */
    async withdrawCCIP(input){
        const { protocol, wallet, contractAddress, tokenAddress, to } = input
        const tc = getTransactionControllerInstance(this.config)
        const builtCCIP = await makeRequest({
            method: 'post',
            url: `/chainlink/ccip/buildWithdraw?protocol=${protocol}`,
            body: { from: wallet.address, contractAddress,  tokenAddress, to },
            headers: {
                'Content-Type': 'application/json'
            },
            config: this.config
        })
        const signedTx = signEthereumTx(builtCCIP, protocol, wallet.privateKey, this.config.environment)
        const tx = new SignedTransaction({
            signedTx,
            protocol,
            type: TransactionType.CALL_CONTRACT_METHOD,
        })
        return await tc.sendTransaction(tx)
    }
}