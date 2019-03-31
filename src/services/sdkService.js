import EthereumIdentitySDK from 'universal-login-monorepo/universal-login-sdk';
import { providers, Wallet, utils, constants } from 'ethers';
import TokenService from './tokenService';
import IdentityFactoryService from './IdentityFactoryService';
import { generatePrivateKey } from './keystoreService.js';
import { computeIdentityAddress } from '../utils/computeIdentityAddress';
import Config from 'react-native-config';


const {
    IDENTITY_FACTORY_ADDRESS,
    IDENTITY_LIB_ADDRESS,
    SECRET_KEY,
    LINK_BASE,
    RELAYER_HOST,
    ETHEREUM_RPC_URL
} = Config;

console.log({Config})

const TOKEN_ADDRESS = Config.TOKEN_ADDRESS === '0x000000000000000000000000000000000000000' ? constants.AddressZero : Config.TOKEN_ADDRESS;

class UniversalLoginSDK {
    start() {
	
	this.provider = new providers.JsonRpcProvider(ETHEREUM_RPC_URL);
	
	this.sdk = new EthereumIdentitySDK(
	    RELAYER_HOST,
	    this.provider,
	);

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
	const amountAtomic = utils.parseUnits(String(amount), Config.TOKEN_DECIMALS).toString();
	console.log({amount})
	const { sigSender, transitPK } = this.sdk.generateLink({ privateKey, token: TOKEN_ADDRESS, amount: amountAtomic, transitPrivKey });
	const url  = `${LINK_BASE}/#/claim?sig=${sigSender}&pk=${transitPrivKey}&a=${amountAtomic}&from=${identityAddress}`;
	return url;
    }

    async transferToAddress(params) {
	if (TOKEN_ADDRESS === constants.AddressZero) {
	    return this.transferEther(params);
	} else {
	    return this.transferERC20(params);	    
	}
    }

    async transferEther({ amount, to, privateKey, from }) {
	const amountAtomic = utils.parseUnits(String(amount), Config.TOKEN_DECIMALS).toHexString();
	const message = {
	    to,
	    from,
	    value: amountAtomic,
	    gasPrice: 0,
	    gasToken: TOKEN_ADDRESS
	};
	return await this.sdk.execute(message, privateKey);
    }
    

    async transferERC20({ amount, to, privateKey, from }) {
	const amountAtomic = utils.parseUnits(String(amount), Config.TOKEN_DECIMALS).toHexString();
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

    async getBalance(address) {
	if (TOKEN_ADDRESS === constants.AddressZero) {
	    // Look up the balance
	    let balance = await this.provider.getBalance(address);
	    return utils.formatEther(balance);
	} else {
	    const tokenService = new TokenService(TOKEN_ADDRESS, this.provider);	    
	    let balance = await tokenService.getBalance(address);
	    balance = utils.formatUnits(balance, Config.TOKEN_DECIMALS);
	    return balance;	    
	}
    }

    computeIdentityAddress(keystoreAddress) {	
	return computeIdentityAddress(keystoreAddress, IDENTITY_FACTORY_ADDRESS, IDENTITY_LIB_ADDRESS);
    }

    
}

export default new UniversalLoginSDK();
