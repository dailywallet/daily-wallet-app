import { Contract } from 'ethers';
import IdentityFactory from 'universal-login-contracts/build/IdentityFactory';


class IdentityFactoryService {
    constructor(identityFactoryContractAddress, provider) {
	this.identityFactoryContractAddress = identityFactoryContractAddress;
	this.provider = provider;
	this.identityFactoryContract = new Contract(this.identityFactoryContractAddress, IdentityFactory.interface, this.provider);
    }

    async getIdentityByPublicKey(keystoreAddress) {
	const publicKey = '0x000000000000000000000000' + keystoreAddress.substring(2);
	console.log({publicKey});
	return this.identityFactoryContract.getIdentity(publicKey);
    }    
    
}

export default IdentityFactoryService;
