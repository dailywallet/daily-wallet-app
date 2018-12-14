import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Text, } from 'react-native';
import { Navigation } from 'react-native-navigation';
import CodePin from 'react-native-pin-code'
import PinView from 'react-native-pin-view'
import { derivePkFromKeystore, deriveAddressFromPk } from './../../services/keystoreService';
import styles from './styles';


class PincodeOnSendScreen extends React.Component {
    state = {
        step: '1'
    }

    static navigatorStyle = {
        navBarHidden: true,
    }

    async _checkCode(code, clear) {
        const wallet = this.props.wallet
        const address = wallet.address
        const keystore = wallet.keystore
        const password = code
        let privateKey;
        let derivedAddress = '';
        try {
            privateKey = await derivePkFromKeystore({ keystore, password })
            derivedAddress = await deriveAddressFromPk({ privateKey })
        } catch (e) {
            console.log('callback error: ', e)
        }
        if (address.toUpperCase() === derivedAddress.toUpperCase()) {
            this.props.navigator.push({ screen: 'dailywallet.ShareLinkScreen', passProps: { amount: this.props.amount } })
        } else {
            alert("Wrong PIN, try again")
            clear()
        }
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.centeredFlex}>
                    <Text style={styles.infoText}>Enter your 4-digit passcode</Text>
                </View>
                <View style={styles.pinContainer}>
                    {/* <CodePin
                            number={4}
                            keyboardType='numeric'
                            ref={ref => this.ref = ref}
                            pinStyle={{ backgroundColor: 'white', borderWidth: 2 }}
                            underlineColorAndroid="white"
                            checkPinCode={async (code, callback) => {
                                const password = code
                                let privateKey;
                                let derivedAddress = '';
                                try {
                                    privateKey = await derivePkFromKeystore({ keystore, password })
                                    derivedAddress = await deriveAddressFromPk({ privateKey })
                                } catch (e) {
                                    console.log('callback error: ', e)
                                }
                                callback(address.toUpperCase() === derivedAddress.toUpperCase())

                            }}
                            success={() => this.props.navigator.push({ screen: 'dailywallet.ShareLinkScreen', passProps: { amount: this.props.amount } })}
                            error="Wrong pin"
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
        );
    }
}

function mapStateToProps(state) {
    return {
        wallet: state.data.wallet || ''
    }
}

export default connect(mapStateToProps)(PincodeOnSendScreen)