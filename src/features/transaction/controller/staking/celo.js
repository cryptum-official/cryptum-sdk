const Controller = require('..')
const { CELO_ACCOUNTS_ADDRESS, Protocol } = require('../../../../services/blockchain/constants')
const { toWei } = require('../../../../services/blockchain/utils')
const { validateEthAddress, validatePositiveAmount } = require('../../../../services/validations')

// Steps to stake:
// 1. Register account
// 2. Lock amount
// 3. Wait 1 day
// 4. Vote in election
// 5. Activate votes

// Steps to stop stake:
// 1. Revoke votes
// 2. Unlock amount
// 3. Wait 3 days
// 4. Withdraw
class StakingController extends Controller {
  /**
   * Check if account is registered
   * @param {string} address wallet address
   * @param {boolean} testnet blockchain testnet network
   * @returns {Promise<boolean>}
   */
  async isRegisteredAccount({ address, testnet = true }) {
    validateEthAddress(address)
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'isAccount'
    return await this.callSmartContractMethod({
      contractAddress: CELO_ACCOUNTS_ADDRESS[network],
      contractAbi: this.getMethodAbi('Accounts', method),
      method,
      params: [address],
    })
  }
  /**
   * Register account
   * @param {object} input
   * @param {import('../../../wallet/entity').Wallet} input.wallet wallet address
   * @param {boolean} input.testnet
   * @returns {Promise<import('../../entity').SignedTransaction>}
   */
  async registerAccount({ wallet, testnet = true }) {
    validateEthAddress(wallet.address)
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'createAccount'
    return await this.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_ACCOUNTS_ADDRESS[network],
      contractAbi: this.getMethodAbi('Accounts', method),
      method,
      params: [],
      testnet,
      protocol: Protocol.CELO,
    })
  }
  /**
   * Lock amount
   * @param {object} input
   * @param {import('../../../wallet/entity').Wallet} input.wallet wallet address
   * @param {string} input.amount amount to be locked
   * @param {boolean} input.testnet
   * @returns {Promise<import('../../entity').SignedTransaction>}
   */
  async lock({ wallet, amount, testnet = true }) {
    validateEthAddress(wallet.address)
    validatePositiveAmount(amount)
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'lock'
    return await this.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_ACCOUNTS_ADDRESS[network],
      contractAbi: this.getMethodAbi('LockedGold', method),
      method,
      params: [],
      value: toWei(amount).toString(),
      testnet,
      protocol: Protocol.CELO,
    })
  }

  getMethodAbi(contract, method) {
    const abi = require(`${contract}.json`)
    return abi.find((m) => m.name === method)
  }
}

module.exports = StakingController
