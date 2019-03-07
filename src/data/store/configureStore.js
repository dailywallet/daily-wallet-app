import { changeAppRoot } from 'DailyWallet/src/actions/app';
import { waitForPendingTxMined, fetchBalance } from 'DailyWallet/src/actions/wallet';
import ulSdk from 'DailyWallet/src/services/sdkService';


function configureStore(store) {  
    return () => {
	const state = store.getState();			

	console.log({state})
	
	// set root screen (add wallet screen or home screen with tabs)
	let root;
 	if (state.data.keystore.pubKeyAddress === '') {
	    root = 'IntroScreen';
	} else { 
	    root = 'BalanceScreen';
	}
	
	store.dispatch(changeAppRoot(root));

	// start universal logins sdk
	ulSdk.start();

	store.dispatch(fetchBalance());
	store.dispatch(waitForPendingTxMined());

   };
}

export default configureStore;
