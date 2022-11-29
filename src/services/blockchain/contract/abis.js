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
module.exports.ERC721_SAFE_TRANSFER_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
]
module.exports.ERC1155_SAFE_TRANSFER_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
module.exports.ERC20_MINT_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
module.exports.ERC20_BURN_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'amount', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
module.exports.ERC721_MINT_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'uri', type: 'string' },
    ],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
module.exports.ERC721_BURN_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
module.exports.ERC1155_MINT_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
module.exports.ERC1155_MINT_WITH_URI_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'uri', type: 'string' },
      { name: 'data', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
module.exports.ERC1155_BURN_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
module.exports.TRANSFER_COMMENT_METHOD_ABI = [
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'string', name: 'comment', type: 'string' },
    ],
    name: 'transferWithComment',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
module.exports.TOTAL_SUPPLY_ABI = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
module.exports.SUPPORTS_INTERFACE_ABI = [
  {
    inputs: [{ name: '_id', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

module.exports.LOOTBOX_CONTENT_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: '_lootBoxId', type: 'uint256' }],
    name: 'getLootBoxContents',
    outputs: [{
      components: [{ internalType: 'address', name: 'tokenAddress', type: 'address', },
      { internalType: 'enum TokenBundle.TokenType', name: 'tokenType', type: 'uint8', },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }],
      internalType: 'struct TokenBundle.Token[]', name: 'contents', type: 'tuple[]',
    },
    { internalType: 'uint256[]', name: 'perUnitAmounts', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
]

module.exports.ERC20_APPROVE_METHOD_ABI = [
  {
    constant: false,
    inputs: [{ name: "_spender", type: "address" }, { name: "_value", type: "uint256" }],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
]

module.exports.ERC721_APPROVE_METHOD_ABI = [
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
]

module.exports.ERC1155_SETAPPROVALLFORALL_METHOD_ABI = [
  {
    inputs: [{ internalType: "address", name: "operator", type: "address" }, { internalType: "bool", name: "approved", type: "bool" }],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
]
module.exports.ERC1155_ISAPPROVEDFORALL_METHOD_ABI = [
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }, { internalType: "address", name: "operator", type: "address" }],
    name: "isApprovedForAll",
    outputs: [{ type: 'bool', name: '' }],
    stateMutability: "nonpayable",
    type: "function"
  }
]