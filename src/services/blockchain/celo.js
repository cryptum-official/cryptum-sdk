const { LocalWallet } = require('@celo/wallet-local')

const signCeloTx = async (rawTransaction, fromPrivateKey) => {
  const celoWallet = new LocalWallet()
  celoWallet.addAccount(fromPrivateKey)
  const signedTx = await celoWallet.signTransaction(rawTransaction)

  return signedTx.raw
}

exports.signCeloTx = signCeloTx
