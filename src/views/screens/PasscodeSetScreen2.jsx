import React from 'react';
import { View, Text, } from 'react-native';
import PinView from 'react-native-pin-view'
import styles from './styles';
import { throws } from 'assert';


class PasscodeSetScreen2 extends React.Component {
    static navigatorStyle = {
        navBarHidden: true,
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.centeredFlex}>
                    <Text style={styles.infoText}>Enter a four-digit passcode. You'll need to enter it every time you send money.</Text>
                </View>
                <View style={styles.pinContainer}>
                    {/* <CodePin
                        keyboardType='numeric'
                        number={4}
                        text={false}
                        ref={ref => this.ref = ref}
                        pinStyle={{ backgroundColor: 'white', borderWidth: 2, borderColor: '#0ED226', borderRadius: 20, color: '#0ED226' }}
                        underlineColorAndroid="white"
                        checkPinCode={(code, callback) => {
                            this.setState({ code })
                            callback(true);
                        }}
                        success={() => this.props.navigator.push({ screen: 'dailywallet.PasscodeSetScreenConfirm', passProps: { code: this.state.code } })}
                        onTextChange={code => this.setState({ code })}
                        autoFocusFirst={true}
                        obfuscation={true}
                        textStyle={{fontSize:50}}

                    /> */}
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