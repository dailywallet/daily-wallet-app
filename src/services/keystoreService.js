import { Wallet } from 'ethers';
import * as EthereumJsWallet from 'ethereumjs-wallet-react-native';
const CryptoJS = require('crypto-js');
const bip39 = require('bip39'); // a forked version, see package.json
import { asyncRandomBytes } from 'react-native-secure-randombytes';
const hdkey = require('ethereumjs-wallet-react-native/hdkey');


export async function generatePrivateKey() {
    const randomBytes = await asyncRandomBytes(16);
    const mnemonic = bip39.generateMnemonic(undefined, () => { return randomBytes; });
    const { address, privateKey } = recoverWalletFromMnemonic(mnemonic);
    return { address, privateKey, mnemonic };
}

export async function generateKeystore({password, mnemonic, privateKey}) {
    
    // encrypt private key
    const keystore = await encryptPrivateKeyFastCrypto(privateKey, password);
    console.log({keystore, privateKey});
    
    const encryptedMnemonic = await encryptMnemonicWithPK(mnemonic, '0x' + privateKey) ;
    return { keystore, encryptedMnemonic };    
}

async function encryptPrivateKeyFastCrypto(privateKey, password) {
    const wallet = await EthereumJsWallet.fromPrivateKey(new Buffer(privateKey, 'hex'));
    const params = {
	n: 1024  // todo, use 65536 for better security
	// n:262144, r:1, p:8 GETH params
    };
    const keystore = JSON.stringify(await wallet.toV3(password, params));
    return keystore;
}

export function recoverWalletFromMnemonic(mnemonic) {
    var seed = bip39.mnemonicToSeed(mnemonic);
    const wallet = hdkey.fromMasterSeed(seed).
	      derivePath(`m/44'/60'/0'/0`).
	      deriveChild(0).getWallet();
    
    return {
	address: wallet.getChecksumAddressString(),
	privateKey: wallet.getPrivateKey().toString('hex')
    };
}

async function encryptMnemonicWithPK (mnemonic, privateKey) {
    const AESBlockSize = 16;
    const randomBytes = (await asyncRandomBytes(16)).toString("hex");
    const words = [];
    for (var i = 0; i < AESBlockSize * 2; i += 8) {
    	words.push('0x' + randomBytes.substring(i, i + 8));
    }
    var iv = new CryptoJS.lib.WordArray.init(words, AESBlockSize);
    var ciphertext = CryptoJS.AES.encrypt(mnemonic, privateKey, { iv: iv });

    return {
	ciphertext: ciphertext.toString(),
	iv: iv
    };
}

export function decryptMnemonicWithPK (ciphertext, iv, privateKey) {
    var decrypted = CryptoJS.AES.decrypt(ciphertext, privateKey, { iv: iv});
    return decrypted.toString(CryptoJS.enc.Utf8);
}



export async function decryptKeystore({keystore, password}) {
    const w = await EthereumJsWallet.fromV3(keystore, password);
    const pk = w.getPrivateKey();
    let wallet = new Wallet(pk);
    return wallet;
}


