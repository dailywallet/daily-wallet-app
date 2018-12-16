import React from 'react';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator } from 'react-native';
import PinView from 'react-native-pin-view'
import { generateKeystore } from './../../actions/wallet'
import styles from './styles';


class PasscodeSetScreenConfirm extends React.Component {
    static navigatorStyle = {
        navBarHidden: true,
    }
    state = {
	decrypting: false
    }


    onComplete(code, clear) {
	this.setState({decrypting: true});
	setTimeout(async () =>  this._checkCode(code, clear), 0);
    }

    
    async _checkCode(code, clear) {
        console.log("CODE: ", code, this.props.code)
        if (code === this.props.code) {
            await this.props.generateKeystore(this.props.code)
            this.props.navigator.push({ screen: 'dailywallet.BalanceScreen' })
        } else {
            alert("Codes do not match, try again")
            clear()
        }
	this.setState({decrypting:false});	
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.centeredFlex}>
                    <Text style={styles.infoText}>Confirm your passcode</Text>
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
        )
    }
}

export default connect(null, { generateKeystore })(PasscodeSetScreenConfirm);
