import { Contract } from 'ethers';
import Token from 'universal-login-monorepo/universal-login-example/build/Token';


class TokenService {
    constructor(tokenContractAddress, provider) {
	this.tokenContractAddress = tokenContractAddress;
	this.provider = provider;
	this.interface = Token.interface;
	this.tokenContract = new Contract(this.tokenContractAddress, this.interface , this.provider);
    }

    async getBalance(address) {
	return this.tokenContract.balanceOf(address);
    }
}

export default TokenService;
