import { Contract } from 'ethers';
import Token from 'universal-login-monorepo/universal-login-example/build/Token';


class TokenService {
    constructor(tokenContractAddress, provider) {
	this.tokenContractAddress = tokenContractAddress;
	this.provider = provider;
	this.tokenContract = new Contract(this.tokenContractAddress, Token.interface, this.provider);
    }

    async getBalance(address) {
	return this.tokenContract.balanceOf(address);
    }
}

export default TokenService;
