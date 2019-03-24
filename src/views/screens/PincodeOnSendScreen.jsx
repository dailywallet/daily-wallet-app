import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Text, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import PinView from 'react-native-pin-view';
import { decryptKeystore } from './../../services/keystoreService';
import i18n from 'DailyWallet/src/i18n';
import styles from './styles';


class PincodeOnSendScreen extends React.Component {
    static navigatorStyle = {
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	this.state = {
	    decrypting: false
	};
      }

    // translate helper
    t(text) {
	return i18n.t(`PincodeScreen.${text}`);
    }    
    
    componentWillMount() {
        //this.props.navigator.setTitle({ title: this.t('send_via_link') });
        this.props.navigator.setButtons({
            leftButtons: [
                {
                    id: 'closeModal',
                    title: this.t('close')
                }
            ],
        });
    }

    onNavigatorEvent(event) {
        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'closeModal') {
		Navigation.dismissModal({
		    animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
		});	
            }
        }
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
		throw new Error(this.t("wrong_pin_try_again"));
	    }
	    
	    this.props.onSuccess(privateKey);
        } catch (e) {
            console.log('callback error: ', e);
            alert(this.t("wrong_pin_try_again"));
            clear();
	    this.setState({decrypting:false});	    
        }

    }


    
    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.centeredFlex}>
                <Text style={{ ...styles.infoText, marginTop: 60}}>{ this.t("enter_your_4_digit_passcode") }</Text>
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
