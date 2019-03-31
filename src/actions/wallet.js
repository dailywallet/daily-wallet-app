import { Navigation } from 'react-native-navigation';
import { utils } from 'ethers';
import { Alert, Clipboard } from 'react-native';
const qs = require('querystring');
import {changeAppRoot} from './app';
import identitySDK from 'DailyWallet/src/services/sdkService';
import * as ksService from './../services/keystoreService';
import Config from 'react-native-config';
import i18n from 'DailyWallet/src/i18n';


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

	// add identity address
	const computedIdentityAddress = identitySDK.computeIdentityAddress(address);
	dispatch(addIdentityContract(computedIdentityAddress));
	
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


export const fetchDaiBalance = () => {
    return async (dispatch, getState) => {
	const state = getState();
	let address = state.data.wallet.address;
	if (!address) { return null; }

	const daiBalance = await identitySDK.getDaiBalance(address);
	
	console.log({ daiBalance });

	if (Number(daiBalance) > 0) {
	    const result = await identitySDK.moveDaiToXdai(state.data.keystore.pubKeyAddress);
	    alert(`Depositing $${daiBalance}. It may take about 5 mins...` );	    
	    console.log({result})
	}
    }    
}

export const fetchBalance = () => {
    return async (dispatch, getState) => {
	const state = getState();
	let address = state.data.wallet.address;	
	//don't fetch balance if wallet is not set up yet
	if (!state.data.keystore.pubKeyAddress) { return null; }
	console.log({address});
	
	if (!address) {
	    address = await identitySDK.getIdentityByPublicKey(state.data.keystore.pubKeyAddress);
	    console.log({address});
	    if (String(address) !== '0x0000000000000000000000000000000000000000') { 
	    	dispatch(addIdentityContract(address));
	    } else {
	    	return null;
	    }
	} 
	let balance = await identitySDK.getBalance(address);
	console.log({balance, address})
	dispatch(updateBalance(balance));
	dispatch(fetchDaiBalance());
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
		const msg_text = "error_while_decrypting_mnemonic";		
		const msg = i18n.t(`alerts.${msg_text}`);
		alert(msg);
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
		    amount: utils.formatUnits(amount, Config.TOKEN_DECIMALS),
		    isPending: true
		}
	    });


	    // subscribe for mining event
	    dispatch(waitForPendingTxMined());
	    
	    return { response, txHash };
	    
	} catch (err) {
	    console.log(err);

	    const alert_title = i18n.t("alerts.invalid_link_title");
	    const alert_text = i18n.t("alerts.invalid_link_text");	    	    	    
	    Alert.alert(alert_title, alert_text);

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
	const linkBase = '/#/claim?';
	if (!(linkInClipboard && linkInClipboard.indexOf(linkBase) > -1)) {

	    const alert_title = i18n.t("alerts.no_link_title");
	    const alert_text = i18n.t("alerts.no_link_text");	    	    
	    Alert.alert(alert_title, alert_text);
	    return null;
	}

	const state = getState();
	if (state.data.pendingClaimTx.isPending) {
	    const alert_title = i18n.t("alerts.wait_link_title");
	    const alert_text = i18n.t("alerts.wait_link_text");	    	    
	    Alert.alert(alert_title, alert_text);	    
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

	// translate helper
	const t = (text) => i18n.t(`prompts.erase_wallet.${text}`);
	
	Alert.alert(
	    t("are_you_sure"),
	    t("are_you_sure_you_want_to_delete_your_wallet"),
	    [
		{
		    text: t('yes_delete_my_wallet'),
		    onPress: () => onSuccess()
		},
		{text: t("no_dont_delete_my_wallet"), onPress: () => console.log('Cancelled')},		
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
	    const msg_text = "please_setup_a_wallet_first";
	    const msg = i18n.t(`alerts.${msg_text}`);
	    alert(msg);
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
