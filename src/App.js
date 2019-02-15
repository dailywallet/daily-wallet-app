import React from 'react';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { Linking } from 'react-native';
import store from './data/store';
import registerScreens from './views/screens';


registerScreens(store, Provider);


export default class App extends React.Component {
    constructor(props) {
        super(props);
        store.subscribe(this.onStoreUpdate.bind(this));
	const state = store.getState();
        //this.startApp(state.appRoot);
	console.log("in constructor...")
        Linking.getInitialURL().then(url => {		
	    //alert(url);
	    console.log({url});
            // if (url) {	
            // }
        });

        Linking.addEventListener('url', this.handleOpenURL);
        //this.startApp('IntroScreen');
    }

    handleOpenURL = (event) => {
	console.log({event})
    	// if (event && event.url) {
    	//     //
    	//     // redirect here
    	//     console.log({event})
    	//     store.dispatch(claimTokens(event.url));
    	// }
    }


    onStoreUpdate() {
        const state = store.getState();
        const root = state.appRoot;
        // handle a root change
        if (this.currentRoot !== root) {
            this.currentRoot = root;
            this.startApp(root);
        }
    }

    startApp(root, params = null) {
        //root = 'ReceiveScreen'

        switch (root) {
            case 'IntroScreen':
                Navigation.startSingleScreenApp({
                    screen: {
                        screen: 'dailywallet.IntroScreen', // unique ID registered with Navigation.registerScreen
                        navigatorStyle: {
                            orientation: 'portrait',
                            //screenBackgroundColor: '#242836',
                            // navBarHidden: true,
                        }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
                        navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
                    },
		    appStyle: {
			orientation: 'portrait',
		    }		    
                });
                return;
            case 'BalanceScreen':
                Navigation.startSingleScreenApp({
                    screen: {
                        screen: 'dailywallet.BalanceScreen', // unique ID registered with Navigation.registerScreen
                        navigatorStyle: {
                            orientation: 'portrait',
                            //screenBackgroundColor: '#242836',
                            // navBarHidden: true,
                        }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
                        navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
                    },
		    appStyle: {
			orientation: 'portrait',
		    }
                });
            return;
            default:
            // pass
        }
    }
}

