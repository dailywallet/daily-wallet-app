import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, Image, RefreshControl, Platform, ActionSheetIOS, Clipboard } from 'react-native';
import { onPressRedeemBtn } from './../../actions/wallet';
import QRCode from 'react-native-qrcode';
import styles from './styles';


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
        this.props.navigator.setTitle({ title: 'Your account' });
    }

    _onAddressPress() {
	Clipboard.setString(this.props.address);
	alert("Address is copied to your clipboard");
    }

    _renderQRCode() {
	if (!this.props.address) {
	    return (
		<View style={styles.balanceContainer}>
		    <Text style={{marginTop: 20, textAlign: 'center'}}>
		    To create an account, get claiming link from an existing user and redeem it.
		    </Text>
		    </View>
	    );
	}

	return (
		<TouchableOpacity onPress={this._onAddressPress.bind(this)} style={styles.balanceContainer}>
		<QRCode
	    value={this.props.address}
	    size={200}
		/>
		<Text style={{marginTop: 20}}>{this.props.address}</Text>
		<Text style={{color: '#aaa'}}>Click to copy</Text>
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
			<Text style={{ ...styles.balance, fontSize: 28 / 1.5, width: 100, marginTop: 8}}>Redeem link</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}


function mapStateToProps(state) {
    return {
        address: state.data.wallet.address
    }
}

export default connect(mapStateToProps, { onPressRedeemBtn })(ReceiveScreen);
