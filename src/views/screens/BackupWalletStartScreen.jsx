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

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.navigator.setTitle({ title: 'Daily' });
    }
    
    render() {
        return (
		<View style={{ flex: 1,
			      // flexDirection: 'column',
			      // justifyContent:'space-between', //'flex-start',
			       backgroundColor: '#fff'}}>
                <View style={{marginTop: 100}}>
                    <Text style={{ ...styles.balance, fontSize: 28 / 1.5 }}>Your phone has</Text>
                    <Text style={{ ...styles.balance, fontSize: 60 / 1.5 }}>${formatAmount(this.props.balance)}</Text>
                </View>
                <View style={{marginTop: 40, padding: 20}}>
		<Text style={{...styles.balance, fontSize: 14, textAlign: 'center'}}>You can save your money to a long password
	    that you should write on a piece of paper.
		It’s like a poem with 12 words.</Text>		
		<Text style={{...styles.balance, fontSize: 14, marginTop: 14, textAlign: 'center'}}>
		Anyone who finds the paper can use your
	    money, so store it in a safe place!</Text>
                </View>
                <View style={styles.centeredFlex}>
                <TouchableOpacity style={{...styles.buttonContainer, width: 165}} onPress={() => this.props.startMnemonicBackup(this.props.navigator)}>
                      <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>		
            </View>
        );
    }
}


function mapStateToProps(state) {
    return {
        balance: state.data.wallet.balance,
    }
}

export default connect(mapStateToProps, { startMnemonicBackup })(BackupWalletStartScreen);
