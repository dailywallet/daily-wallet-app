import React from 'react';
import { View, Text, } from 'react-native';
import PinView from 'react-native-pin-view';
import styles from './styles';
import i18n from 'DailyWallet/src/i18n';


class PasscodeSetScreen extends React.Component {
    static navigatorStyle = {
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }

    // translate helper
    t(text) {
	return i18n.t(`PincodeScreen.${text}`);
    }    
    

    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.centeredFlex}>
                  <Text style={{...styles.infoText, paddingTop: 20}}>{ this.t("enter_a_4_digit_passcode") }</Text>
                <Text style={{...styles.infoText, paddingTop: 10, paddingBottom: 40 }}>{ this.t("you_ll_need_it_everytime")}</Text>		  
                </View>
                <View style={styles.pinContainer}>
                    <PinView
                        onComplete={(code, clear) => this.props.navigator.push({ screen: 'dailywallet.PasscodeSetScreenConfirm', 
passProps: { code, 
onConfirm: this.props.onConfirm } })}
                        pinLength={4}
                        inputActiveBgColor='#0ED226'
                    />
                </View>
            </View>
        )
    }
}

export default PasscodeSetScreen
