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
        link: ''
    }

    _parseURL(url) {
	const urlParams = url.substring(url.search('claim?') + 6);
	const result = qs.parse(urlParams);
	return result;
    }
    
    async onSubmit() {
	const { link } = this.state;
	// 
	
	try {

	    const { a: amount, from: sender, sig: sigSender, pk: transitPK  } = this._parseURL(link);
	    // send tx

	    await this.props.claimLink({
	    	amount,
	    	sender,
	    	sigSender,
	    	transitPK,
		navigator: this.props.navigator
	    });	    
	} catch (err) {
	    console.log({err});
	    this.setState({error: err});;
	    alert("Error! Check the url")
	}
	
    }
    
    
    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Claim Screen</Text>
                </View>
                <View style={styles.centeredFlex}>

                  <TextInput
                     keyboardType='url'
                     autoFocus={true}
		     style={{borderWidth: 1, borderColor: "black", width: '90%', height: 40, padding: 10}}
                     onChangeText={(link) => this.setState({ link })}
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
