const CryptumSDK = require('./index');


const hathor = new CryptumSDK({
  environment: 'development',
  apiKey: 'FJEJZCX-DAAMA8H-NNR86FG-S7K723E',
});

const walletController = hathor.getWalletController()
const mnemonic = "drive brain exile silly release bacon trial song lemon steel salt resemble train latin fitness sea waste member measure regret hold kind soldier remember";

walletController.generateHathorWallet(mnemonic, true).then((wallet) => {
  
  const txController = hathor.getTransactionController()
  
  txController.createHathorTransferTransaction({
    wallet,
    outputs: [{ address: 'WXngE15Yynt1nEut4EG2C2C5evoxp4gAGm', amount: 1 }],
    testnet: true
  }).then((transaction) => {
    const { hash } =  txController.sendTransaction(transaction)
    console.log(hash)
  }).catch((e) => {
    console.log(e)
  })
})
