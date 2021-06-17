const WalletController = require('../../src/features/wallet/controller')
const { Protocol } = require('../../src/services/blockchain')

const mnemonic =
  'coyote cost habit float february version unique balcony pluck always cheese amount river conduct wave wonder north scale series gather skate address invite kidney'

const wallets = {
  stellar: null,
  ripple: null,
  ethereum: null,
  bsc: null,
  celo: null,
  bitcoin: null,
  binancechain: null,
}
exports.mnemonic = mnemonic
exports.config = {
  enviroment: 'development',
  apiKey: 'apikeyexamplecryptum',
}

exports.getWallets = async () => {
  const controller = new WalletController(exports.config)
  wallets.ethereum = await controller.generateWallet({
    protocol: Protocol.ETHEREUM,
    mnemonic,
    testnet: true,
  })
  wallets.bitcoin = await controller.generateWallet({
    protocol: Protocol.BITCOIN,
    mnemonic,
    testnet: true,
  })
  wallets.bsc = await controller.generateWallet({
    protocol: Protocol.BSC,
    mnemonic,
    testnet: true,
  })
  wallets.celo = await controller.generateWallet({
    protocol: Protocol.CELO,
    mnemonic,
    testnet: true,
  })
  wallets.ripple = await controller.generateWallet({
    protocol: Protocol.RIPPLE,
    mnemonic,
  })
  wallets.stellar = await controller.generateWallet({
    protocol: Protocol.STELLAR,
    mnemonic,
  })
  wallets.binancechain = await controller.generateWallet({
    protocol: Protocol.BINANCECHAIN,
    mnemonic,
    tesnet: true,
  })
  return wallets
}
