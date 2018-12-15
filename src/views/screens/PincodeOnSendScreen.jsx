import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Text, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import PinView from 'react-native-pin-view';
import { decryptKeystore } from './../../services/keystoreService';
import styles from './styles';


class PincodeOnSendScreen extends React.Component {
    state = {
        step: '1',
	decrypting: false
    }

    static navigatorStyle = {
        navBarHidden: true,
    }

    onComplete(code, clear) {
	this.setState({decrypting: true});
	setTimeout(async () =>  this._checkCode(code, clear), 0);
    }
    
    async _checkCode(code, clear) {
	const { keystore, pubKeyAddress } = this.props.keystore;	

        try {
	    const { address, privateKey } = await decryptKeystore({ keystore, password:code });

	    // check that pincode is correct
            if (address.toUpperCase() !== pubKeyAddress.toUpperCase()) {
		throw new Error("Wrong PIN, try again");
	    }
	    
            //this.props.navigator.push({ screen: 'dailywallet.ShareLinkScreen', passProps: { amount: this.props.amount } });
	    this.props.onSuccess(privateKey);
        } catch (e) {
            console.log('callback error: ', e);
            alert("Wrong PIN, try again");
            clear();
        }
	this.setState({decrypting:false});
    }


    
    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.centeredFlex}>
                    <Text style={styles.infoText}>Enter your 4-digit passcode</Text>
                </View>

		{this.state.decrypting ? (
		    <ActivityIndicator
		       animating
		       color="black"
		       size="large"
		       style={styles.activityIndicator}
		       />
		) : 
                <View style={styles.pinContainer}>
                    <PinView
                 onComplete={this.onComplete.bind(this)}
                        pinLength={4}
                        inputActiveBgColor='#0ED226'
                    />
                 </View>
		}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        keystore: state.data.keystore || ''
    }
}

export default connect(mapStateToProps)(PincodeOnSendScreen)
