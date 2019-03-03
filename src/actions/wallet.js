import { Navigation } from 'react-native-navigation';
import { utils } from 'ethers';
import { Alert, Clipboard } from 'react-native';
const qs = require('querystring');
import {changeAppRoot} from './app';
import identitySDK from 'DailyWallet/src/services/sdkService';
import * as ksService from './../services/keystoreService';


export const actions = {
    ADD_IDENTITY_CONTRACT: 'ADD_IDENTITY_CONTRACT',
    GENERATE_KEYSTORE: 'GENERATE_KEYSTORE',    
    DELETE_WALLET: 'DELETE_WALLET',
    UPDATE_BALANCE: 'UPDATE_BALANCE',
    UPDATE_PENDING_CLAIM_TX: 'UPDATE_PENDING_CLAIM_TX'
};


export const generateKeystore = (password) => {
    return async (dispatch, getState) => {
	const { address, privateKey, mnemonic } = await ksService.generatePrivateKey();
        const { keystore, encryptedMnemonic } = await ksService.generateKeystore({password, mnemonic, privateKey});
        dispatch({
            type: actions.GENERATE_KEYSTORE,
            payload: { keystore, address, encryptedMnemonic }
        });
        dispatch(changeAppRoot('BalanceScreen'));
    };
}

export const generateKeystoreFromMnemonic = ({ address, privateKey, mnemonic, password }) => {
    return async (dispatch, getState) => {
        const { keystore, encryptedMnemonic } = await ksService.generateKeystore({password, mnemonic, privateKey});
        dispatch({
            type: actions.GENERATE_KEYSTORE,
            payload: { keystore, address, encryptedMnemonic }
        });
        dispatch(changeAppRoot('BalanceScreen'));
	return null;
    };
}


const updateBalance = (balance) => {
    return {
	type: actions.UPDATE_BALANCE,
	payload: { balance } 
    };
}


export const addIdentityContract = (identityContract) => {
    return (dispatch, getState) => {	
	dispatch({
	    type: actions.ADD_IDENTITY_CONTRACT,
	    payload: { address: identityContract } 
	});

	dispatch(fetchBalance());
    };
}


export const fetchBalance = () => {
    return async (dispatch, getState) => {	
	const state = getState();
	let address = state.data.wallet.address;	
	//don't fetch balance if wallet is not set up yet
	if (!state.data.keystore.pubKeyAddress) { return null; } 
	
	if (!address) {
	    address = await identitySDK.getIdentityByPublicKey(state.data.keystore.pubKeyAddress);
	    if (address !== '0x0000000000000000000000000000000000000000') { 
		dispatch(addIdentityContract(address));
	    }
	} 
	let balance = await identitySDK.getBalance(address);
	balance = Number(balance.toString()) / 100;
	dispatch(updateBalance(balance));
    };
}


export const recoverFromMnemonic = (mnemonic, navigator) => {
    return async (dispatch, getState) => {

	// recover key pair from mnemonic
	const { address, privateKey } = ksService.recoverWalletFromMnemonic(mnemonic);
	
	// check that this key is attached to an identity contract
	// fetch identity address from identity factory by pub key
	const identity = await identitySDK.getIdentityByPublicKey(address);
	if (identity === '0x0000000000000000000000000000000000000000') {
	    throw new Error("Invalid mnemonic");
	    return null;
	}

	navigator.push({
	    screen: 'dailywallet.PasscodeSetScreen',
	    passProps: {
		onConfirm: async (password) => {
		    await dispatch(generateKeystoreFromMnemonic({ address, privateKey, mnemonic, password }));
		    dispatch(fetchBalance());		    
		}
	    }
	});
	
	
    };
}


export const startMnemonicBackup = (navigator) => {
    return async (dispatch, getState) => {	
	const onSuccess = async (privateKey) => {
	    const state = getState();
	    const { ciphertext, iv } =  state.data.mnemonic;
	    const mnemonic = await ksService.decryptMnemonicWithPK(ciphertext, iv, privateKey);
	    if (!mnemonic) { 
		alert("Error while decrypting mnemonic");
		return null;
	    } 

	    //  navigate to new screen
	    navigator.push({
		screen: 'dailywallet.BackupWalletWordScreen',
		passProps: { mnemonic, n: 1 },
		//backButtonTitle: "" // override the back button title (optional)
	    });

	    // dismiss pincode modal
	    Navigation.dismissModal({
		animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
	    });	
	};
	
	getPrivateKeyViaModal(onSuccess);
    };
}


export const claimLink = (link) => {
    return async (dispatch, getState) => {	
	const state = getState();
	try {

	    // update app state that tx is pending
	    dispatch({
		type: actions.UPDATE_PENDING_CLAIM_TX,
		payload: {
		    txHash: null,
		    amount: null,
		    isPending: true
		}
	    });
	    
	    // parse url
	    const urlParams = link.substring(link.search('claim?') + 6);
	    const parsedParams = qs.parse(urlParams);
	    const { a: amount, from: sender, sig: sigSender, pk: transitPK } = parsedParams;

	    const receiverPubKey = state.data.keystore.pubKeyAddress;

	    console.log({receiverPubKey});
	    
	    // send transaction
	    const { response, txHash }  = await identitySDK.transferByLink({
		amount,
		sender,
		sigSender,
		transitPK,
		receiverPubKey
	    });
	    
	    // update redux store 
	    dispatch({
		type: actions.UPDATE_PENDING_CLAIM_TX,
		payload: {
		    txHash,
		    amount,
		    isPending: true
		}
	    });


	    // subscribe for mining event
	    dispatch(waitForPendingTxMined());
	    
	    return { response, txHash };
	    
	} catch (err) {
	    console.log(err);
	    Alert.alert("Link is invalid", "The link you copied doesn’t exist or has already been redeemed.");

	    // update app state that tx was mined
	    dispatch({
		type: actions.UPDATE_PENDING_CLAIM_TX,
		payload: {
		    txHash: null,
		    amount: null,
		    isPending: false
		}
	    });	  	    
	}
	
    };
}


export const waitForPendingTxMined = () => {
    return async (dispatch, getState) => {
	const state = getState();
	// wait only if there is pending tx
	const { isPending, txHash } = state.data.pendingClaimTx;
	
	if (isPending) {
	    const txReceipt = await identitySDK.waitForTxReceipt(txHash);

	    // update balance
	    await dispatch(fetchBalance());

 	    // update app state that tx was mined
	    dispatch({
		type: actions.UPDATE_PENDING_CLAIM_TX,
		payload: {
		    txHash: null,
		    amount: null,
		    isPending: false
		}
	    });
	} 
    };
}


export const onPressRedeemBtn = () => {
    return async (dispatch, getState) => {


	const linkInClipboard = await Clipboard.getString();

	// No link detected alert
	const linkBase = 'https://gasless-wallet.volca.tech/#/claim?';
	if (!(linkInClipboard && linkInClipboard.indexOf(linkBase) > -1)) { 
	    Alert.alert("No link detected", "Copy the text with the link from your messaging application, open Daily Wallet, and tap on Redeem link again.");
	    return null;
	}

	const state = getState();
	if (state.data.pendingClaimTx.isPending) { 
	    Alert.alert("Wait for previous claim link", "You can't claim several links at the same time. Please wait until the first link is redeemed.");
	    return null;
	}

	await dispatch(claimLink(linkInClipboard));	

    };
}



const generateClaimLinkWithPK = ({
    amount,
    identityPK,
    navigator
}) => {
    return async (dispatch, getState) => {	
	const state = getState();
	const identityAddress = state.data.wallet.address;
		
	// send transaction
	const link = await identitySDK.generateLink({
	    amount,
	    privateKey: identityPK,
	    identityAddress
	});

	// navigate to Receiving Screen
	navigator.push({
	    screen: 'dailywallet.ShareLinkScreen', // unique ID registered with Navigation.registerScreen
	    title: undefined, // navigation bar title of the pushed screen (optional)
	    passProps: {
		amount,
		link
	    }, // simple serializable object that will pass as props to the pushed screen (optional)
	    animated: false, // does the resetTo have transition animation or does it happen immediately (optional)
	    animationType: 'none', // 'fade' (for both) / 'slide-horizontal' (for android) does the resetTo have different transition animation (optional)
	    navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
	    navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
	});
	
	Navigation.dismissModal({
	    animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
	});	
    };
}


export const generateClaimLink = ({
    amount,
    navigator
}) => {
    return async (dispatch, getState) => {
	// onSuccess callback
	const onSuccess = (privateKey) => {
	    dispatch(generateClaimLinkWithPK({
	    	amount,
		navigator,
		identityPK: privateKey
	    }));	   	
	};
	
	getPrivateKeyViaModal(onSuccess);
   }
}


const getPrivateKeyViaModal = (onSuccess) => {
    // show modal
    Navigation.showModal({
	screen: 'dailywallet.PincodeOnSendScreen', // unique ID registered with Navigation.registerScreen
	title: 'Modal', // title of the screen as appears in the nav bar (optional)
	passProps: {onSuccess}, // simple serializable object that will pass as props to the modal (optional)
	navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
	navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
	animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
	overrideBackPress: false // true / false, (Android only), prevents back button and hardware back button from hiding the dialog on Android, instead the [navigator event](https://wix.github.io/react-native-navigation/#/screen-api?id=setonnavigatoreventcallback) 'backPress' will be sent (optional)
    });
}


export function deleteWallet() {
    return async (dispatch, getState) => {	
	const onSuccess = (privateKey) => {
	    
	    dispatch({
		type: 'DELETE_WALLET'
	    });
	    dispatch(changeAppRoot('IntroScreen'));	    
	};
	
	Alert.alert(
	    'Are you sure?',
	    'Are you sure you want to delete your wallet?',
	    [
		{
		    text: 'Yes, delete my wallet',
		    onPress: () => onSuccess()
		},
		{text: "No, don't delete my wallet", onPress: () => console.log('Cancelled')},		
		{cancelable: true},	
	    ]
	);

    };
}


export function claimFromDeepLink (url) {
    return async (dispatch, getState) => {
	const state = getState();
	
	// if wallet hasn't been setup yet
	if (!state.data.keystore.pubKeyAddress) {
	    alert("Please setup a wallet first");
	}

	dispatch(claimLink(url));
    }
}



const sendToAddressWithPK = ({ amount, address, navigator, identityPK }) => {
    return async (dispatch, getState) => {	
	const state = getState();
	
	const result = await identitySDK.transferToAddress({
	    to: address,
	    from: state.data.wallet.address,
	    amount: amount,
	    privateKey: identityPK
	});

	console.log({result});

	// update redux store 
	dispatch({
	    type: actions.UPDATE_PENDING_CLAIM_TX,
	    payload: {
		txHash: result.txHash,
		amount: amount * -1,
		isPending: true
	    }
	});


	// subscribe for mining event
	dispatch(waitForPendingTxMined());

	// pop navigator to root
	navigator.popToRoot({});  

	// dismiss modal
	Navigation.dismissModal({
	    animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
	});		
    }
}


export const sendToAddress = ({
    amount,
    address,
    navigator
}) => {
    return async (dispatch, getState) => {
	// onSuccess callback
	const onSuccess = (privateKey) => {
	    dispatch(sendToAddressWithPK({
	    	amount,
		address,
		navigator,
		identityPK: privateKey
	    }));	   	
	};
	
	getPrivateKeyViaModal(onSuccess);
   }
}
