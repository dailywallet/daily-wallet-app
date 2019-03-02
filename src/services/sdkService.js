import EthereumIdentitySDK from 'universal-login-monorepo/universal-login-sdk';
import { providers, Wallet, utils } from 'ethers';
import TokenService from './tokenService';
import IdentityFactoryService from './IdentityFactoryService';
import { generatePrivateKey } from './keystoreService.js';

// #todo  move to config
const TOKEN_ADDRESS = '0x0566C17c5E65d760243b9c57717031c708f13d26';
const IDENTITY_FACTORY_ADDRESS = '0x0B90af7936A2e83eC29F1f1c59BEEaCaD5Fa0448';


class UniversalLoginSDK {
    start() {
	const serverUrl = 'https://gasless-ropsten.eth2phone.com';
	this.provider = new providers.JsonRpcProvider('https://ropsten.infura.io');

	this.sdk = new EthereumIdentitySDK(
	    serverUrl,
	    this.provider,
	);

	this.tokenService = new TokenService(TOKEN_ADDRESS, this.provider);
	this.identityFactoryService = new IdentityFactoryService(IDENTITY_FACTORY_ADDRESS, this.provider);
 	this.sdk.start();
	console.log("universal Login SDK started");
    }

    transferByLink(params) {
	return this.sdk.transferByLink({...params, token: TOKEN_ADDRESS});
    }

    async getIdentityByPublicKey(keystoreAddress) {
	return this.identityFactoryService.getIdentityByPublicKey(keystoreAddress);
    }

    async generateLink({amount, privateKey, identityAddress}) {
	let { privateKey: transitPrivKey }  = await generatePrivateKey();
	transitPrivKey = '0x' + transitPrivKey;
	const { sigSender, transitPK } = this.sdk.generateLink({ privateKey, token: TOKEN_ADDRESS, amount, transitPrivKey });
	const url  = `https://gasless-wallet.volca.tech/#/claim?sig=${sigSender}&pk=${transitPrivKey}&a=${amount}&from=${identityAddress}`;
	return url;
    }

    async transferToAddress({ amount, to, privateKey, from }) {
	const amountHex = utils.hexlify(Number(amount));
	const erc20Data = '0xa9059cbb' + utils.hexZeroPad(to, 32).substring(2) + utils.hexZeroPad(amountHex, 32).substring(2);
	const message = {
	    to: TOKEN_ADDRESS,
	    from,
	    value: 0,
	    data: erc20Data,
	    gasPrice: 0,
	    gasToken: TOKEN_ADDRESS 
	};
	return await this.sdk.execute(message, privateKey);
    }
    
    waitForTxReceipt(params) {
	return this.sdk.waitForTxReceipt(params);
    }

    getBalance(address) {
	return this.tokenService.getBalance(address);
    }
    
}

export default new UniversalLoginSDK();
