const CryptumSDK = require('./index');


const hathor = new CryptumSDK({
  environment: 'development',
  apiKey: 'FJEJZCX-DAAMA8H-NNR86FG-S7K723E',
});

const walletController = hathor.getWalletController()

walletController.generateWalletFromPrivateKey({
  privateKey: '19a5965a0f6a8b95a74907881f77020de5f53c7084ffb3d0f7ec201056562a15',
  protocol: 'HATHOR',
}).then((wallet) => {
  const txController = hathor.getTransactionController()

  txController.createHathorTransferTransaction({
    wallet,
    outputs: [{ address: 'WfJqB5SNHnkwXCCGLMBVPcwuVr94hq1oKH', amount: 5 }],
    testnet: true
  }).then((transaction) => {
    console.log(transaction);
    // const { hash } =  txController.sendTransaction(transaction)
    console.log(transaction)
  })
})
