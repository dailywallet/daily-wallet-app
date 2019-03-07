import EthereumIdentitySDK from 'universal-login-monorepo/universal-login-sdk';
import { providers, Wallet, utils } from 'ethers';
import TokenService from './tokenService';
import IdentityFactoryService from './IdentityFactoryService';
import { generatePrivateKey } from './keystoreService.js';
import Config from 'react-native-config';

console.log({Config})

const {
    TOKEN_ADDRESS,
    IDENTITY_FACTORY_ADDRESS,
    SECRET_KEY,
    LINK_BASE,
    RELAYER_HOST,
    ETHEREUM_RPC_URL
} = Config;



class UniversalLoginSDK {
    start() {
	
	this.provider = new providers.JsonRpcProvider(ETHEREUM_RPC_URL);
	
	this.sdk = new EthereumIdentitySDK(
	    RELAYER_HOST,
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
	// parse units in atomic values
	const amountAtomic = utils.parseUnits(String(amount), 18).toString();
	console.log({amount})
	const { sigSender, transitPK } = this.sdk.generateLink({ privateKey, token: TOKEN_ADDRESS, amount: amountAtomic, transitPrivKey });
	const url  = `${LINK_BASE}/#/claim?sig=${sigSender}&pk=${transitPrivKey}&a=${amountAtomic}&from=${identityAddress}`;
	return url;
    }

    async transferToAddress({ amount, to, privateKey, from }) {

	const amountAtomic = utils.parseUnits(String(amount), 18).toHexString();
	console.log({amount, amountAtomic})
	const erc20Data = '0xa9059cbb' + utils.hexZeroPad(to, 32).substring(2) + utils.hexZeroPad(amountAtomic, 32).substring(2);
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
