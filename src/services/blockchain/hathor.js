const hathorLib = require("@hathor/wallet-lib");
const { storageFactory } = require('storage-factory');

hathorLib.storage.setStore(storageFactory(() => 'localStorage'));

module.exports.buildHathorTransferTransaction = async function ({ wallet, outputs }) {

    const network = new hathorLib.Network((wallet.testnet) ? 'testnet' : 'mainnet');
    const walletService = new hathorLib.HathorWalletServiceWallet(wallet.mnemonic, network);
    await walletService.start()

    let txData = { outputs: [] }

    for (let j = 0; j < outputs.length; j++) {

        let address = new hathorLib.Address(outputs[j].address)
        let P2PKH = new hathorLib.P2PKH(address)
        let script = P2PKH.createScript();

        txData.outputs[j] = {
            'value': outputs[j].amount,
            'address': outputs[j].address,
            'script': script,
            'tokenData':  0,
            'token': '00',
        }
    }

    const allAddress = await walletService.getAllAddresses()
    const changeAddress = await allAddress.next();

    const options = {
        outputs: txData.outputs,
        // inputs: txData.inputs,
        changeAddress: changeAddress.value.address
    };

    const TransactionService = new hathorLib.SendTransactionWalletService(walletService, options)
    // const prepare = await TransactionService.prepareTx()

    TransactionService.run();


    // const Transaction = new hathorLib.Transaction(TransactionService.inputs, TransactionService.outputs, TransactionService)

    // Transaction.

    console.log("sign", TransactionService)

}
