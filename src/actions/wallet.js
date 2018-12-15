import { Navigation } from 'react-native-navigation';
import {changeAppRoot} from './app';
import * as ksService from './../services/keystoreService';


export const actions = {
    ADD_IDENTITY_CONTRACT: 'ADD_IDENTITY_CONTRACT',
    GENERATE_KEYSTORE: 'GENERATE_KEYSTORE',    
    DELETE_WALLET: 'DELETE_WALLET',
};


export const generateKeystore = (password) => {
    return async (dispatch, getState) => {
        const {address, keystore} = await ksService.generateKeystore(password);
        dispatch({
            type: actions.GENERATE_KEYSTORE,
            payload: {keystore, address}
        });
        dispatch(changeAppRoot('ClaimScreen'));
    };
}


const claimLinkWithPK = (privateKey) => {
    return async (dispatch, getState) => {	
	console.log("in claimLinkWithPK", privateKey);	
    };
}

export const claimLink = () => {
    return async (dispatch, getState) => {
	// onSuccess callback
	const onSuccess = (privateKey) => {
	    console.log("got private Key: ", privateKey);

	    dispatch(claimLinkWithPK(privateKey));
	    
	    Navigation.dismissModal({
		animationType: 'none' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
	    });
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
	animationType: 'none', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
	overrideBackPress: false // true / false, (Android only), prevents back button and hardware back button from hiding the dialog on Android, instead the [navigator event](https://wix.github.io/react-native-navigation/#/screen-api?id=setonnavigatoreventcallback) 'backPress' will be sent (optional)
    });
}


export function deleteWallet() {
    return {
        type: 'DELETE_WALLET',
        payload: null
    }
}


