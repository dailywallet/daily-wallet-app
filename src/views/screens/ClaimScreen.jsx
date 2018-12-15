import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
const qs = require('querystring');
import identitySDK from 'DailyWallet/src/services/sdkService';
import { claimLink } from './../../actions/wallet';
import styles from './styles';





class ClaimScreen extends React.Component {
    static navigatorStyle = {
        navBarHidden: true,
    }

    state = {
        claimlLink: ''
    }

    _parseURL(url) {
	const urlParams = url.substring(url.search('claim?') + 6);
	const result = qs.parse(urlParams);
	return result;
    }
    
    async onSubmit() {
	const { claimLink } = this.state;
	// await this.props.claimLink();
	
	try {

	    const { a: amount, from: sender, sig: sigSender, pk: transitPK  } = this._parseURL(claimLink);
	    // send tx
	    const { response, txHash, identityPK: newIdentityPK }  = await identitySDK.transferByLink({
	    	amount,
	    	sender,
	    	sigSender,
	    	transitPK,
	    });
	    console.log({response, txHash, newIdentityPK});
	    
	    // this.setState({
	    // 	txHash
	    // });

	    // // wait for tx to be mined
	    // const txReceipt = await identitySDK.waitForTxReceipt(txHash);
	    // console.log({txReceipt});
	    // let newIdentity;
	    
	    // if (this.state.newIdentity) {
	    // 	newIdentity = txReceipt.logs[0] && txReceipt.logs[0].address;
	    // }

	    // this.setState({
	    // 	txReceipt,
	    // 	identity: newIdentity
	    // });

	    // #todo store identity PK in localstorage

	} catch (err) {
	    console.log({err});
	    this.setState({error: err});;
	}
	
    }
    
    
    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Intro Screen</Text>
                </View>
                <View style={styles.centeredFlex}>

                  <TextInput
                     keyboardType='url'
                     autoFocus={true}
		     style={{borderWidth: 1, borderColor: "black", width: '90%', height: 40, padding: 10}}
                     onChangeText={(claimLink) => this.setState({ claimLink })}
                    value={this.state.claimLink}
                    underlineColorAndroid='black'
                    />

		  
                    <TouchableOpacity style={styles.buttonContainer} onPress={this.onSubmit.bind(this)}>
                        <Text style={{...styles.buttonText, fontSize: 20}}>Receive</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


export default connect(null, { claimLink })(ClaimScreen);
