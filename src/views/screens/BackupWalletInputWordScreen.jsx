import React from 'react';
import { connect } from 'react-redux';
import {  View, TouchableOpacity, Text, Image, RefreshControl, Platform, ActionSheetIOS, TextInput } from 'react-native';
import { startMnemonicBackup } from './../../actions/wallet';
import { changeAppRoot } from 'DailyWallet/src/actions/app';
import { formatAmount } from '../../utils/helpers';
import styles from './styles';
import { Alert, Clipboard } from 'react-native';


class BackupWalletInputWordScreen extends React.Component {
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

    _checkWord() {
	return (this.props.word === this.state.inputWord.toLowerCase());
    }
    
    _onContinuePress () {
	const { mnemonic, leftWords } = this.props;

	// validate mnemonic word
	if (!this._checkWord()) {
	    alert("Incorrect word #" + this.props.n);
	    return null;
	}

	const updatedWords = leftWords.split(" ");
	updatedWords.shift();
	console.log({updatedWords})
	
	if (updatedWords.length > 0) { 
	     //  navigate to next screen
	    this.props.navigator.push({
	 	screen: 'dailywallet.BackupWalletInputWordScreen',
	 	passProps: { mnemonic, leftWords: updatedWords.join(" ")}
	    });
	} else {
	    //Alert.alert("Success!", "You have successfully backed up your wallet.");
	    this.props.navigator.popToRoot({});
	}
    }
    
    render() {
        return (
		<View style={{ flex: 1,
			       backgroundColor: '#fff'}}>
                <View style={{marginTop: 100}}>
                <Text style={{ ...styles.balance, fontSize: 28 / 1.5 }}>Type the words again to confirm</Text>
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
    const { mnemonic, leftWords } = props;
    const word = leftWords.split(" ")[0].toLowerCase();
    const n = mnemonic.split(" ").indexOf(word) + 1;

    return {
	word,
	n
    }
}

export default connect(mapStateToProps, { changeAppRoot })( BackupWalletInputWordScreen);
