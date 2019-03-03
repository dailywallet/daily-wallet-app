import React from 'react';
import { connect } from 'react-redux';
import {  View, TouchableOpacity, Text, Image, RefreshControl, Platform, ActionSheetIOS, TextInput } from 'react-native';
import { recoverFromMnemonic } from './../../actions/wallet';
//import { recoverFromMnemonic } from 'DailyWallet/src/actions/wallet';
import { formatAmount } from '../../utils/helpers';
import styles from './styles';
import { Alert, Clipboard } from 'react-native';


class RecoverMnemonicScreen extends React.Component {
    static navigatorStyle = {
	orientation: 'portrait',	
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }
    
    state = {
	inputWord: ''
    }
    
    componentWillMount() {
        this.props.navigator.setTitle({ title: 'Daily' });
    }

    
    _onContinuePress () {
	const { mnemonic, n } = this.props;
	console.log({mnemonic, n})

	if (this.state.inputWord.length === 0) {
	    alert("Input Can't be empty");
	    return null;
	}
	
	const newMnemonic = [...mnemonic, this.state.inputWord.toLowerCase()].join(" ");

	if (mnemonic.length < 11) { 
	     //  navigate to next screen
	    this.props.navigator.push({
	 	screen: 'dailywallet.RecoverMnemonicScreen',
	 	passProps: { mnemonic:  newMnemonic }
	    });
	} else {
	    this._recoverFromMnemonic(newMnemonic);
	}
    }

    async _recoverFromMnemonic(mnemonic) {
	try {
	    await this.props.recoverFromMnemonic(mnemonic, this.props.navigator);
	} catch (err) {
	    console.log({err});
	    alert(err);
	}
    }
    
    render() {
        return (
		<View style={{ flex: 1,
			       backgroundColor: '#fff'}}>
                <View style={{marginTop: 100}}>
                <Text style={{ ...styles.balance, fontSize: 28 / 1.5 }}>Type the words from the recovery paper</Text>
                <Text style={{ ...styles.balance, fontSize: 60 / 1.5 }}>{this.props.n}</Text>				
		</View>
		<View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                <TextInput
            autoFocus={true}
	    ref={ref => this.textInputRef = ref}
            style={{ ...styles.sendScreenText, fontSize: 60 / 1.5,  width: 200 }}
	    autoCapitalize='none'
            onChangeText={(inputWord) => this.setState({inputWord})}
	    value={this.state.inputWord}
            underlineColorAndroid='black'
                />		   
                </View>
                <View style={{marginTop: 120, padding: 20}}>
                </View>
                <View style={styles.centeredFlex}>
                <TouchableOpacity style={{...styles.buttonContainer, width: 165}} onPress={this._onContinuePress.bind(this)}>
                <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>		
            </View>
        );
    }
}

const mapStateToProps = (state, props) => {
    console.log({props})    
    let { mnemonic } = props;
    if (mnemonic.length > 0) { 
	mnemonic = mnemonic.split(" ");
    } else {
	mnemonic = [];
    }
    console.log({mnemonic})
    const n = mnemonic.length + 1;

    return {
	mnemonic, 
	n
    }
}

export default connect(mapStateToProps, { recoverFromMnemonic })(RecoverMnemonicScreen);
