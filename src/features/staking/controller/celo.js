const Interface = require('./interface')
const TransactionController = require('../../transaction/controller')
const {
  CELO_ACCOUNTS_ADDRESS,
  Protocol,
  CELO_ELECTION_ADDRESS,
  CELO_LOCKEDGOLD_ADDRESS,
} = require('../../../services/blockchain/constants')
const { toWei, fromWei } = require('../../../services/blockchain/utils')
const { validateEthAddress, validatePositiveAmount, validatePositive } = require('../../../services/validations')
const { GenericException } = require('../../../../errors')
const { default: BigNumber } = require('bignumber.js')

// Steps to stake:
// 1. Register account
// 2. Lock amount -> nonvoting
// 3. Wait 1 day
// 4. Vote in election -> pending
// 5. Activate votes -> active

// Steps to stop stake:
// 1. Revoke active or pending votes -> nonvoting
// 2. Unlock amount -> pending withdrawals
// (optional) relock pending withdrawal -> nonvoting
// 3. Wait 3 days
// 4. Withdraw
class CeloStakingController extends Interface {
  /**
   * Check if account is registered
   * @param {object} input
   * @param {string} input.address wallet object
   * @returns {Promise<import('../../transaction/entity').SmartContractCallResponse>}
   */
  async isRegisteredAccount({ address }) {
    validateEthAddress(address)
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'isAccount'
    return await new TransactionController(this.config).callSmartContractMethod({
      contractAddress: CELO_ACCOUNTS_ADDRESS[network],
      contractAbi: this._getMethodAbi('Accounts', method),
      method,
      params: [address],
      protocol: Protocol.CELO,
    })
  }
  /**
   * Register account
   * @param {object} input
   * @param {import('../../wallet/entity').Wallet} input.wallet
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async registerAccount({ wallet }) {
    validateEthAddress(wallet.address)
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'createAccount'
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_ACCOUNTS_ADDRESS[network],
      contractAbi: this._getMethodAbi('Accounts', method),
      method,
      params: [],
      value: '0',
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Lock amount
   * @param {object} input
   * @param {import('../../wallet/entity').Wallet} input.wallet wallet object
   * @param {string} input.amount amount to be locked
   *
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async lock({ wallet, amount }) {
    validateEthAddress(wallet.address)
    validatePositiveAmount(amount)
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'lock'
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
      contractAbi: this._getMethodAbi('LockedGold', method),
      method,
      params: [],
      value: toWei(amount).toString(),
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Vote for validator
   * @param {object} input
   * @param {import('../../wallet/entity').Wallet} input.wallet wallet object
   * @param {string} input.amount amount to vote with
   * @param {string} input.validator validator group address
   *
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async vote({ wallet, amount, validator }) {
    validateEthAddress(wallet.address)
    validateEthAddress(validator)
    validatePositiveAmount(amount)
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'vote'
    const txController = new TransactionController(this.config)

    const { lesser, greater } = await this._findLesserGreater({ amount, validator, network })

    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_ELECTION_ADDRESS[network],
      contractAbi: this._getMethodAbi('Election', method),
      method,
      params: [validator, toWei(amount).toString(), lesser, greater],
      value: '0',
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Activate all votes
   * @param {object} input
   * @param {import('../../wallet/entity').Wallet} input.wallet wallet object
   *
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async activate({ wallet, validator }) {
    validateEthAddress(wallet.address)
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'activate'
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_ELECTION_ADDRESS[network],
      contractAbi: this._getMethodAbi('Election', method),
      method,
      params: [validator],
      value: '0',
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Revoke active votes
   * @param {object} input
   * @param {import('../../wallet/entity').Wallet} input.wallet wallet object
   * @param {string} input.amount amount of votes to revoke
   * @param {string} input.validator validator group address
   *
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async revokeActive({ wallet, amount, validator }) {
    validateEthAddress(wallet.address)
    validateEthAddress(validator)
    validatePositiveAmount(amount)
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const { lesser, greater } = await this._findLesserGreater({ amount, validator, network })
    const { result: groups } = await this.getGroupsVotedForByAccount({ address: wallet.address, testnet })
    const index = groups.findIndex((group) => group.toLowerCase() === validator.toLowerCase())
    const txController = new TransactionController(this.config)
    const method = 'revokeActive'
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_ELECTION_ADDRESS[network],
      contractAbi: this._getMethodAbi('Election', method),
      method,
      params: [validator, toWei(amount).toString(), lesser, greater, index],
      value: '0',
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Revoke pending votes
   * @param {object} input
   * @param {import('../../wallet/entity').Wallet} input.wallet wallet object
   * @param {string} input.amount amount of votes to revoke
   * @param {string} input.validator validator group address
   *
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async revokePending({ wallet, amount, validator }) {
    validateEthAddress(wallet.address)
    validateEthAddress(validator)
    validatePositiveAmount(amount)
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const { lesser, greater } = await this._findLesserGreater({ amount, validator, network })
    const txController = new TransactionController(this.config)
    const { result: groups } = await this.getGroupsVotedForByAccount({ address: wallet.address, testnet })
    const index = groups.findIndex((group) => group.toLowerCase() === validator.toLowerCase())
    const method = 'revokePending'
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_ELECTION_ADDRESS[network],
      contractAbi: this._getMethodAbi('Election', method),
      method,
      params: [validator, toWei(amount).toString(), lesser, greater, index],
      value: '0',
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Unlock amount
   * @param {object} input
   * @param {import('../../wallet/entity').Wallet} input.wallet wallet object
   * @param {boolean} input.amount amount to unlock
   *
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async unlock({ wallet, amount }) {
    validateEthAddress(wallet.address)
    validatePositiveAmount(amount)
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'unlock'
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
      contractAbi: this._getMethodAbi('LockedGold', method),
      method,
      params: [toWei(amount).toString()],
      value: '0',
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Relock amount that was unlocked
   * @param {object} input
   * @param {import('../../wallet/entity').Wallet} input.wallet wallet object
   * @param {string} input.amount amount to relock from pending withdrawal
   * @param {number} input.index index of pending withdrawal
   *
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async relock({ wallet, amount, index }) {
    validateEthAddress(wallet.address)
    validatePositiveAmount(amount)
    validatePositive(index)
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'relock'
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
      contractAbi: this._getMethodAbi('LockedGold', method),
      method,
      params: [index, toWei(amount).toString()],
      value: '0',
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Withdraw amount
   * @param {object} input
   * @param {import('../../wallet/entity').Wallet} input.wallet wallet object
   * @param {number} input.index index of pending withdrawal
   *
   * @returns {Promise<import('../../transaction/entity').TransactionResponse>}
   */
  async withdraw({ wallet, index }) {
    validateEthAddress(wallet.address)
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'withdraw'
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
      contractAbi: this._getMethodAbi('LockedGold', method),
      method,
      params: [index],
      value: '0',
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Get Total Pending Withdrawals
   * @param {object} input
   * @param {string} input.address wallet address
   *
   * @returns {Promise<import('../../transaction/entity').SmartContractCallResponse>}
   */
  async getTotalPendingWithdrawals({ address }) {
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'getTotalPendingWithdrawals'
    const txController = new TransactionController(this.config)
    return await txController.callSmartContractMethod({
      contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
      contractAbi: this._getMethodAbi('LockedGold', method),
      method,
      params: [address],
      testnet,
      protocol: Protocol.CELO,
    })
  }
  /**
   * Get Pending Withdrawals
   * @param {object} input
   * @param {string} input.address wallet address
   *
   * @returns {Promise<{amount, timestamp}[]>}
   */
  async getPendingWithdrawals({ address }) {
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'getPendingWithdrawals'
    const txController = new TransactionController(this.config)
    const { result } = await txController.callSmartContractMethod({
      contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
      contractAbi: this._getMethodAbi('LockedGold', method),
      method,
      params: [address],
      testnet,
      protocol: Protocol.CELO,
    })
    const pendingWithdrawals = []
    for (let i = 0; i < result[0].length; ++i) {
      pendingWithdrawals.push({
        amount: fromWei(result[0][i]).toString(),
        timestamp: result[1][i],
      })
    }
    return pendingWithdrawals
  }
  /**
   * Get groups voted for by account
   * @param {object} input
   * @param {string} input.address wallet address
   *
   * @returns {Promise<import('../../transaction/entity').SmartContractCallResponse>}
   */
  async getGroupsVotedForByAccount({ address }) {
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'getGroupsVotedForByAccount'
    const txController = new TransactionController(this.config)
    return await txController.callSmartContractMethod({
      contractAddress: CELO_ELECTION_ADDRESS[network],
      contractAbi: this._getMethodAbi('Election', method),
      method,
      params: [address],
      testnet,
      protocol: Protocol.CELO,
    })
  }
  /**
   * Get votes for group by account
   * @param {object} input
   * @param {string} input.address wallet address
   * @param {string} input.group validator group address
   *
   * @returns {Promise<{pending, active}>}
   */
  async getVotesForGroupByAccount({ address, group }) {
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const txController = new TransactionController(this.config)
    const [pending, active] = await Promise.all([
      txController.callSmartContractMethod({
        contractAddress: CELO_ELECTION_ADDRESS[network],
        contractAbi: this._getMethodAbi('Election', 'getPendingVotesForGroupByAccount'),
        method: 'getPendingVotesForGroupByAccount',
        params: [group, address],
        testnet,
        protocol: Protocol.CELO,
      }),
      txController.callSmartContractMethod({
        contractAddress: CELO_ELECTION_ADDRESS[network],
        contractAbi: this._getMethodAbi('Election', 'getActiveVotesForGroupByAccount'),
        method: 'getActiveVotesForGroupByAccount',
        params: [group, address],
        testnet,
        protocol: Protocol.CELO,
      }),
    ])
    return {
      pending: fromWei(pending.result).toString(),
      active: fromWei(active.result).toString(),
    }
  }
  /**
   * Get account summary
   * @param {object} input
   * @param {string} input.address wallet object
   *
   * @returns {Promise<{total: string, nonvoting: string, pendingWithdrawals: string, votes: any[]}>}
   */
  async getAccountSummary({ address }) {
    validateEthAddress(address)
    const testnet = this.config.environment === 'development'
    const network = testnet ? 'testnet' : 'mainnet'
    const txController = new TransactionController(this.config)

    const [nonvoting, total, pendingWithdrawals, groups] = await Promise.all([
      txController.callSmartContractMethod({
        contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
        contractAbi: this._getMethodAbi('LockedGold', 'getAccountNonvotingLockedGold'),
        method: 'getAccountNonvotingLockedGold',
        params: [address],
        testnet,
        protocol: Protocol.CELO,
      }),
      txController.callSmartContractMethod({
        contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
        contractAbi: this._getMethodAbi('LockedGold', 'getAccountTotalLockedGold'),
        method: 'getAccountTotalLockedGold',
        params: [address],
        testnet,
        protocol: Protocol.CELO,
      }),
      this.getPendingWithdrawals({ address, testnet }),
      this.getGroupsVotedForByAccount({ address, testnet }),
    ])

    const votes = []
    for (let group of groups.result) {
      const { pending, active } = await this.getVotesForGroupByAccount({ address, group, testnet })
      votes.push({
        group,
        pending,
        active,
      })
    }
    return {
      total: fromWei(total.result).toString(),
      nonvoting: fromWei(nonvoting.result).toString(),
      pendingWithdrawals,
      votes,
    }
  }

  _getMethodAbi(contract, method) {
    const abi = require(`../abis/${contract}.json`)
    return [abi.find((m) => m.name === method)]
  }
  async _findLesserGreater({ amount, validator, network }) {
    const txController = new TransactionController(this.config)
    /** @type {{ result:{ groups, values }}} */
    const { result: currentVotes } = await txController.callSmartContractMethod({
      contractAddress: CELO_ELECTION_ADDRESS[network],
      contractAbi: this._getMethodAbi('Election', 'getTotalVotesForEligibleValidatorGroups'),
      method: 'getTotalVotesForEligibleValidatorGroups',
      params: [],
      protocol: Protocol.CELO,
    })

    if (!currentVotes) {
      throw new GenericException('Service is unavailable, try again later')
    }
    const amountWei = toWei(amount)
    const selectedValidatorIndex = currentVotes.groups.findIndex((group) => group === validator)
    const voteTotal =
      selectedValidatorIndex > -1
        ? new BigNumber(currentVotes.values[selectedValidatorIndex]).plus(amountWei)
        : amountWei
    let lesser = '0x0000000000000000000000000000000000000000',
      greater = '0x0000000000000000000000000000000000000000'
    for (let i = 0; i < currentVotes.groups.length; i++) {
      const group = currentVotes.groups[i]
      const votes = new BigNumber(currentVotes.values[i])
      if (group !== validator) {
        if (votes.isLessThanOrEqualTo(voteTotal)) {
          lesser = group
          break
        }
        greater = group
      }
    }
    return { lesser, greater }
  }
}

module.exports = CeloStakingController
