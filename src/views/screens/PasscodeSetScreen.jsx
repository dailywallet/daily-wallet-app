import React from 'react';
import { View, Text, } from 'react-native';
import PinView from 'react-native-pin-view';
import styles from './styles';


class PasscodeSetScreen2 extends React.Component {
    static navigatorStyle = {
        navBarHidden: true,
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.centeredFlex}>
                  <Text style={{...styles.infoText, paddingTop: 46}}>Enter a four-digit passcode.</Text>
                  <Text style={{...styles.infoText, paddingTop: 20, paddingBottom: 30 }}>You'll need to enter it every time you send money.</Text>		  
                </View>
                <View style={styles.pinContainer}>
                    <PinView
                        onComplete={(code, clear) => this.props.navigator.push({ screen: 'dailywallet.PasscodeSetScreenConfirm', passProps: { code } })}
                        pinLength={4}
                        inputActiveBgColor='#0ED226'
                    />
                </View>
            </View>
        )
    }
}

export default PasscodeSetScreen2
