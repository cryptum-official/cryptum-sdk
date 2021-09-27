const WalletController = require('../../src/features/wallet/controller')
const { Protocol } = require('../../src/services/blockchain/constants')

const mnemonic =
  'coyote cost habit float february version unique balcony pluck always cheese amount river conduct wave wonder north scale series gather skate address invite kidney'

const wallets = {
  stellar: null,
  ripple: null,
  ethereum: null,
  bsc: null,
  celo: null,
  bitcoin: null,
}
exports.mnemonic = mnemonic
exports.config = {
  environment: 'development',
  apiKey: 'apikeyexamplecryptum',
}

exports.getWallets = async () => {
  const controller = new WalletController(exports.config)
  wallets.ethereum = await controller.generateWallet({
    protocol: Protocol.ETHEREUM,
    mnemonic,
    derivation: { address: 0 },
  })
  wallets.bitcoin = await controller.generateWallet({
    protocol: Protocol.BITCOIN,
    mnemonic,
    derivation: { address: 0 },
  })
  wallets.bsc = await controller.generateWallet({
    protocol: Protocol.BSC,
    mnemonic,
    derivation: { address: 0 },
  })
  wallets.celo = await controller.generateWallet({
    protocol: Protocol.CELO,
    mnemonic,
    derivation: { address: 0 },
  })
  wallets.ripple = await controller.generateWallet({
    protocol: Protocol.RIPPLE,
    mnemonic,
    derivation: { address: 0 },
  })
  wallets.stellar = await controller.generateWallet({
    protocol: Protocol.STELLAR,
    mnemonic,
    derivation: { address: 0 },
  })
  return wallets
}
