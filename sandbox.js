const CryptumSDK = require('./index')

const sandbox = async () => {
  const sdk = new CryptumSDK({
    environment: 'development',
    apiKey: '2VE9Y8S-V82MPKV-Q399FBW-SX6A2WP',
  })

  console.log(sdk)
  const wc = sdk.getWalletController()

  const serverInfo = await wc.getWalletInfo({
    address: '66NhjryvQ7VRB2mym1ooBqg3b1TYRVTnHnz6oqGk757f',
    protocol: 'SOLANA',
  })

  console.log(serverInfo)
}

sandbox()

const { Connection } = require('@metaplex/js')
const { Metadata } = require("@metaplex-foundation/mpl-token-metadata")

const connection = new Connection('testnet');
const tokenPublicKey = { toBase58: () => '66NhjryvQ7VRB2mym1ooBqg3b1TYRVTnHnz6oqGk757f' };

const runThis = async () => {
  try {
    const balance = await connection.getBalance(tokenPublicKey);
    console.log(balance);
    const ownedMetadata = await Metadata.load(connection, balance.owner);
  } catch (error) {
    console.log('Failed to fetch metadata', error);
  }
};

runThis();

// // Init store
// const { storeId } = await actions.initStore({
//   connection,
//   wallet,
// });

// // Get existing store id
// const storeId = await Store.getPDA(publicKey as AnyPublicKey);