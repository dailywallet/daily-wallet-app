import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, } from 'react-native';
import { generateKeystore } from './../../actions/wallet';
import styles from './styles';
import i18n from 'DailyWallet/src/i18n';

class IntroScreen extends React.Component {
    static navigatorStyle = {
	orientation: 'portrait',	
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }

    // translate helper
    t(text) {
	return i18n.t(`IntroScreen.${text}`);
    }
    
    
    componentWillMount() {
        this.props.navigator.setTitle({ title: 'Daily Wallet' });
    }

    _onCreateBtnPress () {
	this.props.navigator.push({ screen: 'dailywallet.PasscodeSetScreen', passProps: { onConfirm: this.props.generateKeystore } });
    }
    
    _onRecoverBtnPress () {
	this.props.navigator.push({ screen: 'dailywallet.RecoverMnemonicScreen', passProps: { mnemonic: ""} });
    }

    
    render() {
        return (
            <View style={styles.screenContainerCentered}>
                <View style={styles.centeredFlex}>
                <TouchableOpacity style={{...styles.buttonContainer, width: 280, marginBottom: 20}} onPress={this._onCreateBtnPress.bind(this)}>
                <Text style={styles.buttonText}>{ this.t("create_new_wallet") }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.buttonContainer, width: 280}} onPress={this._onRecoverBtnPress.bind(this)}>
                   <Text style={styles.buttonText}>{ this.t("recover_paper_wallet") }</Text>
                </TouchableOpacity>
                </View>		
            </View>
        );
    }
}


export default connect(null, { generateKeystore })(IntroScreen);
