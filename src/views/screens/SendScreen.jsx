import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, View, TouchableOpacity, Text, TextInput, ActionSheetIOS, Platform } from 'react-native';
import { generateClaimLink } from './../../actions/wallet';
import { formatAmount } from '../../utils/helpers';
import styles from './styles';


class SendScreen extends React.Component {
    static navigatorStyle = {
	orientation: 'portrait',	
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	this.state = {
            amount: ''
	};
    }

    componentWillMount() {
        this.props.navigator.setTitle({ title: 'Daily' });
	let rightButtons = [];
	if (Platform.OS === 'ios') {
	    //
	    rightButtons = [
		{
		    id: 'settingsIOS',
		    icon: require('../../img/settings.png')
		}		
	    ]
	} else { // Action Bar on android
	    rightButtons = [
                {
                    id: 'sendToAddress',
                    title: 'Send To Address',
                    showAsAction: 'withText'
                },
                {
                    id: 'scan',
                    title: 'Scan QR-Code',
                    showAsAction: 'withText'
                },		
	    ]
	}

	this.props.navigator.setButtons({
	    rightButtons
        });
    }

    onNavigatorEvent(event) {
        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'sendToAddress') {
		this.props.navigator.push({
		    screen: 'dailywallet.SendToAddressScreen',
		    passProps: {
			amount: this.state.amount
		    }
		});
            } else if (event.id == 'scan') {
		this.props.navigator.push({
		    screen: 'dailywallet.ScanScreen',
		    passProps: {
			amount: this.state.amount
		    }
		});
	    } else if (event.id == 'settingsIOS') {
		this._showActionSheetIOS();
            }    
        }
    }

    _showActionSheetIOS() {
	ActionSheetIOS.showActionSheetWithOptions( {
	    options: ['Cancel', 'Send To Address'],
	    destructiveButtonIndex: 3,
	    cancelButtonIndex: 0,
	},  (buttonIndex) => {
	    if (buttonIndex === 1) {
		this.props.navigator.push({ screen: 'dailywallet.SendToAddressScreen' });
	    } 
	});		
    }

    

    onSend() {
	if (this.state.amount <= 0) {
	    alert(`Amount should be more than 0`);
	    return;
	}	
	
	if (Number(this.props.balance) < this.state.amount / 100) {
	    alert(`Amount should be less than balance ($${formatAmount(this.props.balance)})`);
	    return;
	}
	try {
	    this.props.generateClaimLink({
		amount: this.state.amount / 100,
		navigator: this.props.navigator
	    });
	} catch(err) {
	    console.log({err});
	    alert("Error");
	}
    }

    _handleInput(val) {
	console.log({newVal: val, oldVal: this.state.amount});
	
	// we don't want users to have , input
	if (val.indexOf(',') >= 0) {
	    return;
	}

	// we don't want users to have . input	
	// const hasSecondDot = val.substr(val.indexOf('.')+1).indexOf('.') >= 0;
	// if (hasSecondDot) {
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
                    <View style={{...styles.sendInputContainer, marginTop:80}}>
		      <TouchableOpacity onPress={() => this.textInputRef.focus()}>
			<Text style={styles.sendScreenText}>You're sending ${this.state.amount && Number(this.state.amount / 100).toFixed(2)}</Text>
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
                    <View style={{ alignItems: 'center' }}>
                      <TouchableOpacity style={styles.buttonContainer} onPress={this.onSend.bind(this)}>
                            <Text style={styles.buttonText}>Send</Text>
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

export default connect(mapStateToProps, { generateClaimLink })(SendScreen);

