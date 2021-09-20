const hathorLib = require("@hathor/wallet-lib");
const transaction = require("@hathor/wallet-lib/lib/utils/transaction");
const { default: BigNumber } = require("bignumber.js");
const { storageFactory } = require('storage-factory');


hathorLib.storage.setStore(storageFactory(() => 'localStorage'));

module.exports.buildHathorTransferTransaction = async function ({ wallet, inputs, outputs }) {

    const network = new hathorLib.Network((wallet.testnet) ? 'testnet' : 'mainnet');

    const utxos = transaction.default
    const selectedUtxos = utxos.selectUtxos(inputs, 5);

    let totalAmount = 0

    for (let i = 0; i < outputs.length; i++) {
        totalAmount = totalAmount + outputs[i].amount
    }

    let txData = {inputs: [],outputs: []}

    for (let i = 0; i < selectedUtxos.utxos.length; i++) {
        txData.inputs[i] = new hathorLib.Input(selectedUtxos.utxos[i].txHash, selectedUtxos.utxos[i].index);
    }


    outputs.push({
        address: 'Wj2naTrfbE7ffBLK9pjR1Eb8TwbBcBE5Ya',
        amount: selectedUtxos.changeAmount
    });

    for (let j = 0; j < outputs.length; j++) {
        let address = new hathorLib.Address(outputs[j].address)
        let P2PKH  = new hathorLib.P2PKH(address)
        let script = P2PKH.createScript();
        txData.outputs[j] = new hathorLib.Output(outputs[j].amount,script)
    }

    let _tx = new hathorLib.Transaction(txData.inputs, txData.outputs)

    _tx.getShortHash();
    
    _tx.validate();
    _tx.prepareToSend();
    const getDataToSign =_tx.getDataToSign();
    const toBytes = _tx.toBytes();

    const createFromBytes = hathorLib.Transaction.createFromBytes(getDataToSign, network);
    
    console.log(createFromBytes);
    
    return createFromBytes.toHex();


}

