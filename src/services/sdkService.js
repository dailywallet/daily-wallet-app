
import EthereumIdentitySDK from 'universal-login-monorepo/universal-login-sdk';
import { providers } from 'ethers';


class UniversalLoginSDK {
    start() {
	const serverUrl = 'https://gasless-ropsten.eth2phone.com';
	this.provider = new providers.JsonRpcProvider('https://ropsten.infura.io');

	this.sdk = new EthereumIdentitySDK(
	    serverUrl,
	    this.provider,
	);

	// this.tokenService = new TokenService(TOKEN_ADDRESS, this.provider)
 	this.sdk.start();
	console.log("universal Login SDK started");
    }

    transferByLink(params) {
	return this.sdk.transferByLink(params);
    }

    waitForTxReceipt(params) {
	return this.sdk.waitForTxReceipt(params);
    }
    
    
}

export default new UniversalLoginSDK();
