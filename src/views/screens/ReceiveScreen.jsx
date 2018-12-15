import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, Image, Linking, ActivityIndicator } from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import identitySDK from 'DailyWallet/src/services/sdkService';
import { addIdentityContract, fetchBalance } from './../../actions/wallet';

class ReceiveScreen extends React.Component {    
    static navigatorStyle = {
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
    }
    
    state = {
	pending: true
    }
    
    
    
    componentWillMount() {
        this.props.navigator.setTitle({ title: 'Daily' });
        // this.props.navigator.setButtons({
        //     rightButtons: [
        //         {
        //             id: 'settingsIcon',
        //             icon: require('./../../img/settings.png'),
        //         },
        //     ],
        // });
    }

    async componentDidMount() {
	const txReceipt = await identitySDK.waitForTxReceipt(this.props.txHash);
	console.log({txReceipt});

	if (!this.props.identityAddress) {
	    console.log("identity doesn't exist");
	    let newIdentity = txReceipt.logs[0] && txReceipt.logs[0].address;
	    console.log({newIdentity});
	    this.props.addIdentityContract(newIdentity);
	} else {
	    console.log("identity exists: ", this.props.identityAddress);
	    this.props.fetchBalance();
	}
	
	this.setState({
	    pending: false
	});
    }

    
    onSubmit() {
	this.props.navigator.resetTo({
	    screen: 'dailywallet.BalanceScreen', // unique ID registered with Navigation.registerScreen
	    title: undefined, // navigation bar title of the pushed screen (optional)
	    passProps: {}, // simple serializable object that will pass as props to the pushed screen (optional)
	    animated: false, // does the resetTo have transition animation or does it happen immediately (optional)
	    animationType: 'none', // 'fade' (for both) / 'slide-horizontal' (for android) does the resetTo have different transition animation (optional)
	    navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
	    navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
	});
    }

    render() {
	const title = this.state.pending ? "Receving..." : "You received";
        return (
            <View colors={['rgba(195, 249, 207, 1)', 'rgba(114, 231, 130, 1)', 'rgba(103, 227, 118, 1)']} style={styles.screenContainer}>
                <View/>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require('./../../img/arrow.png')} />
                    <Text style={{...styles.balance, fontSize: 28}}>{title}</Text>
                    <Text style={{...styles.balance, fontSize: 60}}>${this.props.amount/100}</Text>
                </View>

                <View style={{alignItems: 'center', marginBottom: 30}}>
		  { !this.state.pending ? 		      
                  <TouchableOpacity style={{ ...styles.buttonContainer }} onPress={this.onSubmit.bind(this)}>
                        <Text style={styles.buttonText}>Done</Text>
                      </TouchableOpacity> :
		      <View>
			    <ActivityIndicator/>
		      <TouchableOpacity  onPress={() => Linking.openURL(`https://ropsten.etherscan.io/tx/${this.props.txHash}`).catch(() => null) }>
			    <Text style={styles.buttonText}>Pending Tx Details >></Text>
			  </TouchableOpacity>
			  </View>
			 }
                </View> 
            </View>
        );
    }
}


const mapStateToProps = (state) => ({
    identityAddress: state.data.wallet.address
})

export default connect(mapStateToProps, { addIdentityContract, fetchBalance })(ReceiveScreen);
