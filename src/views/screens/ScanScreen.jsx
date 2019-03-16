import React from 'react';
import { ScrollView, View, TouchableOpacity, Text, Image, RefreshControl, Platform, ActionSheetIOS } from 'react-native';
import QRCodeScanner from "react-native-qrcode-scanner";
import { utils } from 'ethers';
import styles from './styles';


class ScanScreen extends React.Component {
    static navigatorStyle = {
	orientation: 'portrait',	
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }
    scanner: null
    
    componentWillMount() {
        this.props.navigator.setTitle({ title: 'QR Code Scanner' });
    }

    
    onRead(event) {
	console.log({event});
	const uri = event.data;

	if (uri && typeof uri === "string") {
	    try { 
		const address = utils.getAddress(uri);
		this.props.navigator.push({
		    screen: 'dailywallet.SendToAddressScreen',
		    passProps: {
			address,
			amount: this.props.amount
		    }
		});
	    } catch (err) {
		alert("Invalid address");
	    }
	}
	
	setTimeout(() => {
	    this.scanner.reactivate();
	}, 5000);
    }

    render() {
        return (
            <View style={{...styles.screenContainer, justifyContent: 'center'}}>
		<QRCodeScanner
	    topViewStyle={{ height: 0, backgroundColor: 'black' }}
	    bottomViewStyle={{ height: 0, backgroundColor: 'black'  }}
	    cameraProps={{captureAudio: false}}
	    showMarker={true}
	    style={{ height: 100 }}
	    ref={(c) => {
		this.scanner = c;
	    }}
	    onRead={this.onRead.bind(this)}
	        />
		
            </View>
        );
    }
}


export default ScanScreen;
