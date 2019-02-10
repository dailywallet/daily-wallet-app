import { changeAppRoot } from 'DailyWallet/src/actions/app';
import { waitForPendingTxMined } from 'DailyWallet/src/actions/wallet';
import ulSdk from 'DailyWallet/src/services/sdkService';


function configureStore(store) {  
    return () => {
	const state = store.getState();			
	console.log("in configture store")
	
	// set root screen (add wallet screen or home screen with tabs)
	let root;
 	if (state.data.keystore.pubKeyAddress === '') {
	    root = 'IntroScreen';
	} else { 
	    root = 'BalanceScreen';
	}
	
	console.log("Changing root", root);
	store.dispatch(changeAppRoot(root));

	// start universal logins sdk
	ulSdk.start();

	store.dispatch(waitForPendingTxMined());	
   };
}

export default configureStore;
