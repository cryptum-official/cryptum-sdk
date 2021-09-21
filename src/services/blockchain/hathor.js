const hathorLib = require("@hathor/wallet-lib");
const walletApi = require("@hathor/wallet-lib/lib/wallet/api/walletApi");
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
            'token': outputs[j].token,
        }
    }

    const allAddress = await walletService.getAllAddresses()
    const changeAddress = await allAddress.next();
    console.log(allAddress)
    const options = {
        outputs: txData.outputs,
        // inputs: txData.inputs,
        changeAddress: changeAddress.value.address
    };

    const TransactionService = new hathorLib.SendTransactionWalletService(walletService, options)

    const sign = await TransactionService.run()
    const toHex = sign.toHex()
    
    console.log("2HEX: ", toHex)

    // const proposal = await walletApi.default.createTxProposal(walletService, toHex);
    // const updateTxProposal = await walletApi.default.updateTxProposal(walletService, "b057c928-fab4-477a-af15-3710b4ded43b", toHex);
    // console.log(updateTxProposal)

    return toHex

}
