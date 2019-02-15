import React from 'react';
import { View, TouchableOpacity, Text, } from 'react-native';
import styles from './styles';


class IntroScreen extends React.Component {
    static navigatorStyle = {
	orientation: 'portrait',	
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }

    componentWillMount() {
        this.props.navigator.setTitle({ title: 'Daily Wallet' });
    }

    _onRecoverBtnPress () {
	this.props.navigator.push({ screen: 'dailywallet.RecoverMnemonicScreen', passProps: { mnemonic: ""} });
    }
    
    render() {
        return (
            <View style={styles.screenContainerCentered}>
                <View style={styles.centeredFlex}>
                <TouchableOpacity style={{...styles.buttonContainer, width: 200, marginBottom: 20}} onPress={() => this.props.navigator.push({ screen: 'dailywallet.PasscodeSetScreen' })}>
                   <Text style={styles.buttonText}>Create New Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.buttonContainer, width: 200}} onPress={this._onRecoverBtnPress.bind(this)}>
                   <Text style={styles.buttonText}>Recover paper wallet</Text>
                </TouchableOpacity>
                </View>		
            </View>
        );
    }
}


export default IntroScreen;
