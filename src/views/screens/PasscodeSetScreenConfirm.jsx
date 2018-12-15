import React from 'react';
import { connect } from 'react-redux';
import { View, Text, } from 'react-native';
import PinView from 'react-native-pin-view'
import { generateKeystore } from './../../actions/wallet'
import styles from './styles';


class PasscodeSetScreenConfirm extends React.Component {
    static navigatorStyle = {
        navBarHidden: true,
    }


    _checkCode(code, clear) {
        console.log("CODE: ", code, this.props.code)
        if (code === this.props.code) {
            this.props.generateKeystore(this.props.code)
            this.props.navigator.push({ screen: 'dailywallet.BalanceScreen' })
        } else {
            alert("Codes do not match, try again")
            clear()
        }
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.centeredFlex}>
                    <Text style={styles.infoText}>Confirm your passcode</Text>
                </View>
                <View style={styles.pinContainer}>
                    {/* <CodePin
                        keyboardType='numeric'
                        number={4}
                        text="Confirm pin code"
                        pinStyle={{ backgroundColor: 'white', borderWidth: 1 }}
                        underlineColorAndroid="white"
                        checkPinCode={(code, callback) => callback(code === this.props.code)}
                        success={() => {
                            this.props.createWallet(this.props.code)
                            this.props.navigator.push({ screen: 'dailywallet.BalanceScreen' })
                        }
                        }
                        error="Codes do not match"
                        autoFocusFirst={true}
                        obfuscation={true}
                    /> */}
                    <PinView
                        onComplete={(code, clear) => this._checkCode(code, clear)}
                        pinLength={4}
                        inputActiveBgColor='#0ED226'
                    />
                </View>
            </View>
        )
    }
}

export default connect(null, { generateKeystore })(PasscodeSetScreenConfirm)
