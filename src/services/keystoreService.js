import { Wallet } from 'ethers';
import * as EthereumJsWallet from 'ethereumjs-wallet-react-native';
const bip39 = require('bip39'); // a forked version, see package.json
import { asyncRandomBytes } from 'react-native-secure-randombytes';
const hdkey = require('ethereumjs-wallet-react-native/hdkey');


// Ethereumjs-wallet version
//
export async function generateKeystore(password) {

    
    // var hashedEntropy = ethUtil.sha256(entropy + extraEntropy).slice(0, 16);

    const randomBytes = await asyncRandomBytes(16);
    console.log({randomBytes})
    
    var mnemonic = bip39.generateMnemonic(undefined, () => { return randomBytes; });

    var seed = bip39.mnemonicToSeed(mnemonic);
    console.log({seed, mnemonic});
    const wallet = hdkey.fromMasterSeed(seed).
	    derivePath(`m/44'/60'/0'/0`).
	      deriveChild(0).getWallet();
    
    // genereate keystore
    // const wallet = await EthereumJsWallet.generate();
    
    // encrypt private key
    const keystore = await encryptPrivateKeyFastCrypto(wallet.getPrivateKey(), password);
    //const {  mnemonic, address } = wallet;
    console.log({keystore});

    const address = wallet.getChecksumAddressString();
    //const mnemonic = '';
    
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
