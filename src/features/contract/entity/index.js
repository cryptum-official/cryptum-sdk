
class SmartContractCallResponse {
  constructor({ result }) {
    this.result = result
  }
}

class SmartContractCallTransactionInput {
  /**
   * Creates an instance of SmartContractCallTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.contractAddress
   * @param {Array<any>} args.contractAbi
   * @param {string} args.method
   * @param {any[]} args.params
   * @param {string} args.protocol
   * @param {Fee=} args.fee
   * @param {string=} args.feeCurrency
   * @param {boolean=} args.testnet
   */
  constructor({ wallet, contractAddress, contractAbi, method, params, protocol, fee, feeCurrency }) {
    this.wallet = wallet
    this.contractAddress = contractAddress
    this.contractAbi = contractAbi
    this.method = method
    this.params = params
    this.protocol = protocol
    this.fee = fee
    this.feeCurrency = feeCurrency
  }
}
class SmartContractCallMethodInput {
  /**
   * Creates an instance of SmartContractCallMethodInput.
   *
   * @param {object} args
   * @param {string} args.from
   * @param {string} args.contractAddress
   * @param {Array<any>} args.contractAbi
   * @param {string} args.method
   * @param {any[]} args.params
   * @param {string} args.protocol
   * @param {boolean=} args.testnet
   */
  constructor({ from, contractAddress, contractAbi, method, params, protocol }) {
    this.from = from
    this.contractAddress = contractAddress
    this.contractAbi = contractAbi
    this.method = method
    this.params = params
    this.protocol = protocol
  }
}

class SmartContractDeployTransactionInput {
  /**
   * Creates an instance of SmartContractDeployTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {string} args.contractName
   * @param {any[]} args.params
   * @param {string} args.source
   * @param {string} args.protocol
   * @param {Fee=} args.fee
   * @param {string=} args.feeCurrency
   * @param {boolean=} args.testnet
   */
  constructor({ wallet, contractName, params, source, fee, feeCurrency, protocol }) {
    this.wallet = wallet
    this.contractName = contractName
    this.params = params
    this.source = source
    this.protocol = protocol
    this.fee = fee
    this.feeCurrency = feeCurrency
  }
}

class SolanaTokenDeployInput {
  /**
   * Creates an instance of SolanaTokenDeployInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.from
   * @param {string} args.to
   * @param {string} args.fixedSupply
   * @param {number} args.decimals
   * @param {string} args.amount
   * @param {string} args.network
   */
  constructor({ from, to, fixedSupply, decimals, amount, network }) {
    this.from = from
    this.to = to
    this.fixedSupply = fixedSupply
    this.decimals = decimals
    this.amount = amount
    this.network = network
  }
}

class TokenDeployTransactionInput {
  /**
   * Creates an instance of TokenDeployTransactionInput.
   *
   * @param {object} args
   * @param {import('../../wallet/entity').Wallet} args.wallet
   * @param {any[]} args.params
   * @param {string} args.tokenType
   * @param {Fee=} args.fee
   * @param {Protocol} args.protocol
   * @param {string=} args.feeCurrency
   */
  constructor({ wallet, tokenType, params, fee, protocol, feeCurrency }) {
    this.wallet = wallet
    this.tokenType = tokenType
    this.params = params
    this.protocol = protocol
    this.fee = fee
    this.feeCurrency = feeCurrency
  }
}

module.exports = {
  SmartContractCallTransactionInput,
  SolanaTokenDeployInput,
  SmartContractCallResponse,
  SmartContractDeployTransactionInput,
  TokenDeployTransactionInput,
  SmartContractCallMethodInput,
}
