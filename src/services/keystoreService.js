import { Wallet } from 'ethers';
import * as EthereumJsWallet from 'ethereumjs-wallet-react-native';

// Ethers version
//
// export async function generateKeystore(password) {
//     // genereate keystore
//     const wallet = Wallet.createRandom();
    
//     function callback(progress) {
// 	console.log("Encrypting: " + parseInt(progress * 100) + "% complete");
//     }

//     const options = {
// 	scrypt: { N: 1024 }
//     }
    
//     // encrypt private key
//     const keystore = await wallet.encrypt(password, options, callback);
//     const {  mnemonic, address } = wallet;
//     console.log({keystore, mnemonic});
    
//     return { keystore, address, mnemonic };    
// }

// Ethereumjs-wallet version
//
export async function generateKeystore(password) {
    // genereate keystore
    const wallet = await EthereumJsWallet.generate();

    //console.log({wallet});
    //const wallet = Wallet.createRandom();
    
    // encrypt private key
    const keystore = await encryptPrivateKeyFastCrypto(wallet.getPrivateKey(), password);
    //const {  mnemonic, address } = wallet;
    console.log({keystore});

    const address = wallet.getChecksumAddressString();
    const mnemonic = '';
    
    return { keystore, address, mnemonic };    
}

async function encryptPrivateKeyFastCrypto(privateKey, password) {
    const wallet = await EthereumJsWallet.fromPrivateKey(new Buffer(privateKey, 'hex'));
    const params = {
	n: 1024  // todo, use 65536 for better security
    };
    const keystore = JSON.stringify(await wallet.toV3(password, params));
    return keystore;
}


export async function decryptKeystore({keystore, password}) {
    const w = await EthereumJsWallet.fromV3(keystore, password);
    const pk = w.getPrivateKey();
    let wallet = new Wallet(pk);
    return wallet;
}


export async function generatePrivateKey() {
    const wallet = await EthereumJsWallet.generate();
    const pk = '0x' + wallet.getPrivateKey().toString('hex');
    console.log({pk});
    return pk;
}
