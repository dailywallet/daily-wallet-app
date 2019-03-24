import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, View, TouchableOpacity, Text, TextInput, ActionSheetIOS, Platform } from 'react-native';
import { sendToAddress } from './../../actions/wallet';
import { formatAmount } from '../../utils/helpers';
import { utils } from 'ethers';
import i18n from 'DailyWallet/src/i18n';
import styles from './styles';


class SendToAddressScreen extends React.Component {

    constructor(props) {
        super(props);
	this.state = {
            amount: this.props.amount || '',
	    address: this.props.address || ''
	};
    }

    // translate helper
    t(text) {
	return i18n.t(`SendScreen.${text}`);
    }    
    
    
    onSend() {
	if (this.state.amount <= 0) {
	    alert(this.t(`amount_should_be_more_than_0`));
	    return;
	}	
	
	if (this.props.balance < this.state.amount / 100) {
	    alert(`${this.t("amount_should_be_less_than_balance")} ($${formatAmount(this.props.balance)})`);
	    return;
	}

	if (!this.state.address) {
	    alert(this.t(`invalid_ethereum_address`));	    
	    return;
	}

	try { 
	    const checksumAddress = utils.getAddress(this.state.address);
	} catch (err) {
	    alert(this.t(`invalid_ethereum_address`));	    
	    return;
	}

	try {
	    this.props.sendToAddress({
	    	amount: this.state.amount / 100,
		address: this.state.address,
	    	navigator: this.props.navigator
	    });
	} catch(err) {
	    console.log({err});
	    alert(this.t("error"));
	}
    }

    _handleInput(val) {
	console.log({newVal: val, oldVal: this.state.amount});
	
	// we don't want users to have , input
	if (val.indexOf(',') >= 0) {
	    return;
	}

	// we don't want users to have . input	
	if (val.indexOf('.') >= 0) {	
	    return;
	}

	this.setState({ amount: val});	
    }

   
    render() {
        return (
            <ScrollView
	       keyboardDismissMode="on-drag"
	    keyboardShouldPersistTaps='always' style={{flex: 1, backgroundColor: '#fff'}}>
	      <View style={styles.screenContainer}>
                <View style={styles.sendScreenContainer}>
                    <View style={{...styles.sendInputContainer, marginTop:60}}>
		      <TouchableOpacity onPress={() => this.textInputRef.focus()}>
		<Text style={styles.sendScreenText}>{this.t("you_are_sending")}  ${this.state.amount && Number(this.state.amount / 100).toFixed(2)}</Text>
			</TouchableOpacity>
                        <TextInput
                            keyboardType='numeric'
                           autoFocus={true}
			   caretHidden={true}
			   ref={ref => this.textInputRef = ref}
                           style={{width: 0, color: "#fff" }}
                            onChangeText={this._handleInput.bind(this)}
			    value={this.state.amount}
                            underlineColorAndroid='black'
                           />
                    </View>

                    <View style={{...styles.sendInputContainer, marginTop:60}}>
                        <TextInput
                            keyboardType='default'
                           autoFocus={false}
                           placeholder="Ethereum Address, 0x123...000"
                           style={styles.addressInput}
                            onChangeText={(address) => { this.setState({ address })}}
			    value={this.state.address}
                            underlineColorAndroid='black'
                           />
                    </View>


                    <View style={{ alignItems: 'center' }}>
                      <TouchableOpacity style={styles.buttonContainer} onPress={this.onSend.bind(this)}>
                <Text style={styles.buttonText}>{this.t("send")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                </View>
		</View>
            </ScrollView>
        );
    }
}


function mapStateToProps(state) {
    return {
        balance: state.data.wallet.balance
    }
}

export default connect(mapStateToProps, { sendToAddress })(SendToAddressScreen);

