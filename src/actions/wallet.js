import { Navigation } from 'react-native-navigation';
import { utils } from 'ethers';
import {changeAppRoot} from './app';
import identitySDK from 'DailyWallet/src/services/sdkService';
import * as ksService from './../services/keystoreService';


export const actions = {
    ADD_IDENTITY_CONTRACT: 'ADD_IDENTITY_CONTRACT',
    GENERATE_KEYSTORE: 'GENERATE_KEYSTORE',    
    DELETE_WALLET: 'DELETE_WALLET',
    UPDATE_BALANCE: 'UPDATE_BALANCE'
};


export const generateKeystore = (password) => {
    return async (dispatch, getState) => {
        const {address, keystore} = await ksService.generateKeystore(password);
        dispatch({
            type: actions.GENERATE_KEYSTORE,
            payload: {keystore, address}
        });
        dispatch(changeAppRoot('BalanceScreen'));
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
	const address = state.data.wallet.address;
	console.log({address});
	let balance = await identitySDK.getBalance(address);
	balance = Number(balance.toString()) / 100;
	console.log({balance});
	dispatch(updateBalance(balance));
    };
}


export const claimLink = ({
    amount,
    sender,
    sigSender,
    transitPK,
    navigator
}) => {
    return async (dispatch, getState) => {	
	console.log("in claimLinkWithPK");

	const state = getState();

	const receiverPubKey = state.data.keystore.pubKeyAddress;
	
	// send transaction
	const { response, txHash }  = await identitySDK.transferByLink({
	    amount,
	    sender,
	    sigSender,
	    transitPK,
	    receiverPubKey
	});
	console.log({response, txHash});


	// navigate to Receiving Screen
	navigator.resetTo({
	    screen: 'dailywallet.ReceiveScreen', // unique ID registered with Navigation.registerScreen
	    title: undefined, // navigation bar title of the pushed screen (optional)
	    passProps: {
		amount,
		txHash
	    }, // simple serializable object that will pass as props to the pushed screen (optional)
	    animated: false, // does the resetTo have transition animation or does it happen immediately (optional)
	    animationType: 'none', // 'fade' (for both) / 'slide-horizontal' (for android) does the resetTo have different transition animation (optional)
	    navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
	    navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
	});

	Navigation.dismissModal({
	    animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
	});	
	
	return { response, txHash };
    };
}


const generateClaimLinkWithPK = ({
    amount,
    identityPK,
    navigator
}) => {
    return async (dispatch, getState) => {	
	console.log("in generateClaimLinkWithPK");
	const state = getState();
	const identityAddress = state.data.wallet.address;
	console.log({
	    amount,
	    identityPK,
	    identityAddress
	});
		
	// send transaction
	const link = await identitySDK.generateLink({
	    amount,
	    privateKey: identityPK,
	    identityAddress
	});
	console.log({link});

	
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
	    console.log("got private Key: ", privateKey);

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
    return {
        type: 'DELETE_WALLET',
        payload: null
    }
}


