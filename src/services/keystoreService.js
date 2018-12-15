import { Wallet } from 'ethers';


export async function generateKeystore(password) {
    // genereate keystore
    const wallet = Wallet.createRandom();
    
    function callback(progress) {
	console.log("Encrypting: " + parseInt(progress * 100) + "% complete");
    }

    // encrypt private key
    const keystore = await wallet.encrypt(password, callback);
    const {  mnemonic, address } = wallet;
    console.log({keystore, mnemonic});
    
    return { keystore, address, mnemonic };    
}



export async function decryptKeystore({keystore, password}) {
    function callback(progress) {
	console.log("Decrypting: " + parseInt(progress * 100) + "% complete");
    }
    console.log({keystore})
    const wallet = await Wallet.fromEncryptedJson(keystore, password, callback);
    return wallet;
}


