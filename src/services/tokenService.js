import { Contract } from 'ethers';
import Token from 'universal-login-monorepo/universal-login-example/build/Token';


class TokenService {
    constructor(tokenContractAddress, provider) {
	this.tokenContractAddress = tokenContractAddress;
	this.provider = provider;
	const erc20interface = Token.interface; // ["function getBalance(address _address) view returns (uint256 value)"];  //Token.interface;
	
	this.tokenContract = new Contract(this.tokenContractAddress, erc20interface, this.provider);
    }

    async getBalance(address) {
	return this.tokenContract.balanceOf(address);
    }
}

export default TokenService;
