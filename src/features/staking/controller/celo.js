const Interface = require('./interface')
const TransactionController = require('../../transaction/controller')
const {
  CELO_ACCOUNTS_ADDRESS,
  Protocol,
  CELO_ELECTION_ADDRESS,
  CELO_LOCKEDGOLD_ADDRESS,
} = require('../../../services/blockchain/constants')
const { toWei } = require('../../../services/blockchain/utils')
const { validateEthAddress, validatePositiveAmount } = require('../../../services/validations')
const { GenericException } = require('../../../../errors')
const { default: BigNumber } = require('bignumber.js')

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
class CeloStakingController extends Interface {
  /**
   * Check if account is registered
   * @param {object} input
   * @param {string} input.address wallet address
   * @param {boolean} input.testnet blockchain testnet network
   * @returns {Promise<boolean>}
   */
  async isRegisteredAccount({ address, testnet = true }) {
    validateEthAddress(address)
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'isAccount'
    return await new TransactionController(this.config).callSmartContractMethod({
      contractAddress: CELO_ACCOUNTS_ADDRESS[network],
      contractAbi: this.getMethodAbi('Accounts', method),
      method,
      params: [address],
      protocol: Protocol.CELO,
    })
  }
  /**
   * Register account
   * @param {StakingInput} input
   * @returns {Promise<import('../../entity').SignedTransaction>}
   */
  async registerAccount({ wallet, testnet = true }) {
    validateEthAddress(wallet.address)
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'createAccount'
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_ACCOUNTS_ADDRESS[network],
      contractAbi: this.getMethodAbi('Accounts', method),
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
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
      contractAbi: this.getMethodAbi('LockedGold', method),
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
   * @param {import('../../../wallet/entity').Wallet} input.wallet wallet address
   * @param {string} input.amount amount to vote with
   * @param {string} input.validator validator group address
   * @param {boolean} input.testnet
   * @returns {Promise<import('../../entity').SignedTransaction>}
   */
  async vote({ wallet, amount, validator, testnet = true }) {
    validateEthAddress(wallet.address)
    validateEthAddress(validator)
    validatePositiveAmount(amount)
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'vote'
    const txController = new TransactionController(this.config)
    /** @type {{ result:{ groups, values }}} */
    const { result: currentVotes } = await txController.callSmartContractMethod({
      contractAddress: CELO_ELECTION_ADDRESS[network],
      contractAbi: this.getMethodAbi('Election', 'getTotalVotesForEligibleValidatorGroups'),
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

    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_ELECTION_ADDRESS[network],
      contractAbi: this.getMethodAbi('Election', method),
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
   * @param {import('../../../wallet/entity').Wallet} input.wallet wallet address
   * @param {boolean} input.testnet
   * @returns {Promise<import('../../entity').SignedTransaction>}
   */
  async activate({ wallet, validator, testnet = true }) {
    validateEthAddress(wallet.address)
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'activate'
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_ELECTION_ADDRESS[network],
      contractAbi: this.getMethodAbi('Election', method),
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
   * @param {import('../../../wallet/entity').Wallet} input.wallet wallet address
   * @param {boolean} input.amount amount of votes to revoke
   * @param {boolean} input.validator validator group address
   * @param {boolean} input.testnet
   * @returns {Promise<import('../../entity').SignedTransaction>}
   */
  async revokeActive({ wallet, amount, validator, testnet = true }) {
    validateEthAddress(wallet.address)
    validateEthAddress(validator)
    validatePositiveAmount(amount)
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'revokeActive'
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_ELECTION_ADDRESS[network],
      contractAbi: this.getMethodAbi('Election', method),
      method,
      params: [wallet.address, validator, toWei(amount).toString()],
      value: '0',
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Unlock amount
   * @param {object} input
   * @param {import('../../../wallet/entity').Wallet} input.wallet wallet address
   * @param {boolean} input.amount amount to unlock
   * @param {boolean} input.testnet
   * @returns {Promise<import('../../entity').SignedTransaction>}
   */
  async unlock({ wallet, amount, testnet = true }) {
    validateEthAddress(wallet.address)
    validatePositiveAmount(amount)
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'unlock'
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
      contractAbi: this.getMethodAbi('LockedGold', method),
      method,
      params: [toWei(amount).toString()],
      value: '0',
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Withdraw amount
   * @param {object} input
   * @param {import('../../../wallet/entity').Wallet} input.wallet wallet address
   * @param {number} input.index pending withdraw index
   * @param {boolean} input.testnet
   * @returns {Promise<import('../../entity').SignedTransaction>}
   */
  async withdraw({ wallet, index, testnet = true }) {
    validateEthAddress(wallet.address)
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'withdraw'
    const txController = new TransactionController(this.config)
    const tx = await txController.createSmartContractTransaction({
      wallet,
      contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
      contractAbi: this.getMethodAbi('LockedGold', method),
      method,
      params: [index],
      value: '0',
      testnet,
      protocol: Protocol.CELO,
    })
    return await txController.sendTransaction(tx)
  }
  /**
   * Withdraw amount
   * @param {object} input
   * @param {string} input.address wallet address
   * @param {boolean} input.testnet
   * @returns {Promise<import('../../entity').SignedTransaction>}
   */
  async getPendingWithdrawals({ address, testnet = true }) {
    const network = testnet ? 'testnet' : 'mainnet'
    const method = 'getPendingWithdrawals'
    const txController = new TransactionController(this.config)
    return await txController.callSmartContractMethod({
      contractAddress: CELO_LOCKEDGOLD_ADDRESS[network],
      contractAbi: this.getMethodAbi('LockedGold', method),
      method,
      params: [address],
      testnet,
      protocol: Protocol.CELO,
    })
  }

  getMethodAbi(contract, method) {
    const abi = require(`../abis/${contract}.json`)
    return [abi.find((m) => m.name === method)]
  }
}

module.exports = CeloStakingController
