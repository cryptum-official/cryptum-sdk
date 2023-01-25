const { getWalletControllerInstance } = require('../../src/features/wallet/controller')
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
  hathor: null,
  cardano: null,
  avaxcchain: null,
  solana: null
}
exports.mnemonic = mnemonic
exports.config = {
  environment: 'development',
  apiKey: 'apikeyexamplecryptum',
}

exports.getWallets = async () => {
  const controller = getWalletControllerInstance(exports.config)
  wallets.ethereum = await controller.generateWallet({
    protocol: Protocol.ETHEREUM,
    mnemonic,
  })
  wallets.bitcoin = await controller.generateWallet({
    protocol: Protocol.BITCOIN,
    mnemonic,
  })
  wallets.bsc = await controller.generateWallet({
    protocol: Protocol.BSC,
    mnemonic,
  })
  wallets.celo = await controller.generateWallet({
    protocol: Protocol.CELO,
    mnemonic,
  })
  wallets.ripple = await controller.generateWallet({
    protocol: Protocol.RIPPLE,
    mnemonic,
  })
  wallets.stellar = await controller.generateWallet({
    protocol: Protocol.STELLAR,
    mnemonic,
  })
  wallets.hathor = await controller.generateWallet({
    protocol: Protocol.HATHOR,
    mnemonic,
  })
  wallets.cardano = await controller.generateWallet({
    protocol: Protocol.CARDANO,
    mnemonic,
  })
  wallets.avaxcchain = await controller.generateWallet({
    protocol: Protocol.AVAXCCHAIN,
    mnemonic,
  })
  wallets.solana = await controller.generateWallet({
    protocol: Protocol.SOLANA,
    mnemonic,
  })
  return wallets
}
