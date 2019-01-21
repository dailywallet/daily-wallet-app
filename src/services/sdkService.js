import EthereumIdentitySDK from 'universal-login-monorepo/universal-login-sdk';
import { providers } from 'ethers';
import TokenService from './tokenService';
import { generatePrivateKey } from './keystoreService.js';

// #todo  move to config
const TOKEN_ADDRESS = '0x0566C17c5E65d760243b9c57717031c708f13d26';


class UniversalLoginSDK {
    start() {
	const serverUrl = 'https://gasless-ropsten.eth2phone.com';
	this.provider = new providers.JsonRpcProvider('https://ropsten.infura.io');

	this.sdk = new EthereumIdentitySDK(
	    serverUrl,
	    this.provider,
	);

	this.tokenService = new TokenService(TOKEN_ADDRESS, this.provider);
 	this.sdk.start();
	console.log("universal Login SDK started");
    }

    transferByLink(params) {
	return this.sdk.transferByLink({...params, token: TOKEN_ADDRESS});
    }

    async generateLink({amount, privateKey, identityAddress}) {
	const transitPrivKey = await generatePrivateKey();
	const { sigSender, transitPK } = this.sdk.generateLink({ privateKey, token: TOKEN_ADDRESS, amount, transitPrivKey });
	const url  = `https://gasless-wallet.volca.tech/#/claim?sig=${sigSender}&pk=${transitPrivKey}&a=${amount}&from=${identityAddress}`;
	return url;
    }
    
    
    waitForTxReceipt(params) {
	return this.sdk.waitForTxReceipt(params);
    }

    getBalance(address) {
	return this.tokenService.getBalance(address);
    }
    
}

export default new UniversalLoginSDK();
