/**
 * Blockchain protocols
 * @enum {string}
 */
const Protocol = {
  BITCOIN: 'BITCOIN',
  BINANCECHAIN: 'BINANCECHAIN',
  BSC: 'BSC',
  CELO: 'CELO',
  ETHEREUM: 'ETHEREUM',
  STELLAR: 'STELLAR',
  RIPPLE: 'RIPPLE',
}
module.exports.Protocol = Protocol

module.exports.CUSD_CONTRACT_ADDRESS = {
  testnet: '0x874069fa1eb16d44d622f2e0ca25eea172369bc1',
  mainnet: '0x765de816845861e75a25fca122bb6898b8b1282a',
}
module.exports.CEUR_CONTRACT_ADDRESS = {
  testnet: '0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f',
  mainnet: '0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73',
}

module.exports.BSC_COMMON_CHAIN = {
  testnet: {
    base: 'rinkeby',
    chain: {
      chainId: 97,
      networkId: 97,
    },
  },
  mainnet: {
    base: 'mainnet',
    chain: {
      chainId: 56,
      networkId: 56,
    },
  },
}

module.exports.TRANSFER_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
module.exports.TRANSFER_COMMENT_METHOD_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256', name: '_value', type: 'uint256' },
      { internalType: 'string', name: '_comment', type: 'string' },
    ],
    name: 'transferWithComment',
    outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
