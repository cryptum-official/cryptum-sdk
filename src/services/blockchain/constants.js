/**
 * Blockchain protocols
 *
 * @enum {string}
 */
const Protocol = {
  BITCOIN: 'BITCOIN',
  BSC: 'BSC',
  CELO: 'CELO',
  ETHEREUM: 'ETHEREUM',
  STELLAR: 'STELLAR',
  RIPPLE: 'RIPPLE',
  HATHOR: 'HATHOR',
  CARDANO: 'CARDANO',
  AVAXCCHAIN: 'AVAXCCHAIN',
  CHILIZ: 'CHILIZ',
  POLYGON: 'POLYGON',
  SOLANA: 'SOLANA',
  STRATUS: 'STRATUS'
}
module.exports.Protocol = Protocol

module.exports.CELO_CONTRACT_ADDRESS = {
  testnet: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
  mainnet: '0xA87710B8DC870483a2bE526EBca9F5048720eDce',
}
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

module.exports.AVAXCCHAIN_COMMON_CHAIN = {
  testnet: {
    base: 'rinkeby',
    chain: {
      chainId: 43113,
      networkId: 1,
    },
  },
  mainnet: {
    base: 'mainnet',
    chain: {
      chainId: 43114,
      networkId: 1,
    },
  },
}

module.exports.CHLIZ_COMMON_CHAIN = {
  testnet: {
    base: 'rinkeby',
    chain: {
      chainId: 88882,
      networkId: 88882,
    },
  },
  mainnet: {
    base: 'mainnet',
    chain: {
      chainId: 88888,
      networkId: 88888,
    },
  },
}

// ===================================
// CONFIRMAR
module.exports.STRATUS_COMMON_CHAIN = {
  testnet: {
    base: 'goerli',
    chain: {
      chainId: 2008,
      networkId: 2008,
    },
  },
  mainnet: {
    base: 'mainnet',
    chain: {
      chainId: 2008,
      networkId: 2008,
    },
  },
}
// ===================================

module.exports.POLYGON_COMMON_CHAIN = {
  testnet: {
    base: 'rinkeby',
    chain: {
      chainId: 80001,
      networkId: 80001,
    },
  },
  mainnet: {
    base: 'mainnet',
    chain: {
      chainId: 137,
      networkId: 137,
    },
  },
}

module.exports.CELO_ACCOUNTS_ADDRESS = {
  testnet: '0xed7f51A34B4e71fbE69B3091FcF879cD14bD73A9',
  mainnet: '0x7d21685C17607338b313a7174bAb6620baD0aaB7',
}
module.exports.CELO_ELECTION_ADDRESS = {
  testnet: '0x1c3eDf937CFc2F6F51784D20DEB1af1F9a8655fA',
  mainnet: '0x8D6677192144292870907E3Fa8A5527fE55A7ff6',
}
module.exports.CELO_LOCKEDGOLD_ADDRESS = {
  testnet: '0x6a4CC5693DC5BFA3799C699F3B941bA2Cb00c341',
  mainnet: '0x6cC083Aed9e3ebe302A6336dBC7c921C9f03349E',
}

module.exports.TOKEN_TYPES = {
  ERC20: 'ERC20',
  ERC721: 'ERC721',
  ERC1155: 'ERC1155',
}
