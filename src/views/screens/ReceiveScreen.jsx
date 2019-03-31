import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, Image, RefreshControl, Platform, ActionSheetIOS, Clipboard } from 'react-native';
import { onPressRedeemBtn } from './../../actions/wallet';
import QRCode from 'react-native-qrcode';
import i18n from 'DailyWallet/src/i18n';
import styles from './styles';
import identitySDK from 'DailyWallet/src/services/sdkService';


class ReceiveScreen extends React.Component {
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
        this.props.navigator.setTitle({ title: this.t("your_account") });
    }

    // translate helper
    t(text) {
	return i18n.t(`ReceiveScreen.${text}`);
    }

    
    _onAddressPress() {
	Clipboard.setString(this.props.address);
	alert(this.t("address_copied_to_clipboard"));
    }

    _renderQRCode() {
	// if (!this.props.address) {
	//     return (
	// 	<View style={styles.balanceContainer}>
	// 	    <Text style={{marginTop: 20, textAlign: 'center'}}>
	// 	    { this.t("no_account_text") }
	// 	    </Text>
	// 	    </View>
	//     );
	// }

	return (
		<TouchableOpacity onPress={this._onAddressPress.bind(this)} style={styles.balanceContainer}>
		<QRCode
	    value={this.props.address}
	    size={200}
		/>
		<Text style={{marginTop: 20}}>{this.props.address}</Text>
		<Text style={{color: '#aaa'}}>{ this.t("click_to_copy") }</Text>
		</TouchableOpacity>		
	)

    }

    render() {
        return (
            <View style={styles.screenContainer}>
		{ this._renderQRCode() }
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center', marginBottom: 50 }}>
                      <TouchableOpacity onPress={() => this.props.onPressRedeemBtn(this.props.navigator)}>
                        <Image source={require('./../../img/redeem_icon.png')}></Image>
		<Text style={{ ...styles.balance, fontSize: 28 / 1.5, width: 100, marginTop: 8}}>{ this.t("redeem_link") }</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}


function mapStateToProps(state) {
    console.log({state})
    return {
        address: state.data.wallet.address //identitySDK.computeIdentityAddress(state.data.keystore.pubKeyAddress)
    }
}

export default connect(mapStateToProps, { onPressRedeemBtn })(ReceiveScreen);
