import { utils } from 'ethers';

const addressToBytes32 = (address) =>
	  utils.padZeros(utils.arrayify(address), 32);

function buildCreate2Address(creatorAddress, saltHex, byteCode) {

    const byteCodeHash = utils.keccak256(byteCode);
    return `0x${utils.keccak256(`0x${[
	'ff',
	creatorAddress,
	saltHex,
	byteCodeHash
    ].map(x => x.replace(/0x/, '')).join('')}`).slice(-40)}`.toLowerCase();
}


export const computeIdentityAddress = (managementKey, factoryAddress, libAddress) => {
    
    const pubKey = utils.hexlify(addressToBytes32(managementKey));
    const bytecode =`0x3d602d80600a3d3981f3363d3d373d3d3d363d73${libAddress.slice(2)}5af43d82803e903d91602b57fd5bf3`;
    const address = buildCreate2Address(
	factoryAddress,
	pubKey,
	bytecode
    );

    console.log({
	managementKey,
	pubKey,
	factoryAddress,
	libAddress,
	address
    })
    
    return address;
}
