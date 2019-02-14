import React from 'react';
import { connect } from 'react-redux';
import {  View, TouchableOpacity, Text, Image, RefreshControl, Platform, ActionSheetIOS } from 'react-native';
import { startMnemonicBackup } from './../../actions/wallet';
import { formatAmount } from '../../utils/helpers';
import styles from './styles';


class BackupWalletStartScreen extends React.Component {
    static navigatorStyle = {
	orientation: 'portrait',	
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }

    componentWillMount() {
        this.props.navigator.setTitle({ title: 'Daily' });
    }

    _onContinuePress () {
	const { mnemonic, n } = this.props;

	if (n < mnemonic.split(" ").length) { 
	
	    //  navigate to next screen
	    this.props.navigator.push({
		screen: 'dailywallet.BackupWalletWordScreen',
		passProps: { mnemonic, n: n + 1 },
	    });
	} else {
	    alert("Done");
	}
    }
    
    render() {
	const { mnemonic, n } = this.props;
	const word = mnemonic.split(" ")[n-1];
        return (
		<View style={{ flex: 1,
			       backgroundColor: '#fff'}}>
                <View style={{marginTop: 100}}>
                    <Text style={{ ...styles.balance, fontSize: 28 / 1.5 }}>Write the number and word in paper</Text>
                <Text style={{ ...styles.balance, fontSize: 60 / 1.5 }}>{n}. {word}</Text>
                </View>
                <View style={{marginTop: 220, padding: 20}}>
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

export default BackupWalletStartScreen;
