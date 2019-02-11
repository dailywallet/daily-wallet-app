import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { generateClaimLink } from './../../actions/wallet';
import { formatAmount } from '../../utils/helpers';
import styles from './styles';


class SendScreen extends React.Component {
    static navigatorStyle = {
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }
    
    state = {
        amount: ''
    }

    onSend() {
	if (this.state.amount <= 0) {
	    alert(`Amount should be more than 0`);
	    return;
	}	
	
	if (this.props.balance < this.state.amount) {
	    alert(`Amount should be less than balance ($${formatAmount(this.props.balance)})`);
	    return;
	}
	try { 
	    this.props.generateClaimLink({
		amount: this.state.amount * 100,
		navigator: this.props.navigator
	    });
	} catch(err) {
	    console.log({err});
	    alert("Error");
	}
    }
    
    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.sendScreenContainer}>
                    <View>
                        <Text style={styles.title}>Send Screen</Text>
                    </View>
                    <View style={{...styles.sendInputContainer, marginTop:50}}>
                        <Text style={styles.sendScreenText}>You're sending $</Text>
                        <TextInput
                            keyboardType='numeric'
                            autoFocus={true}
                            style={{ ...styles.sendScreenText, width: 100 }}
                           onChangeText={(val) => {
			       let amount;
			       console.log({val});
			       if (val.length < 4) {
				    amount = val / 100;
				} else {
				   const digits = val.substring(val.indexOf('.') + 1).length;
						    if (digits === 3) {
							amount = val * 10;
						    } else {							
							amount = val;
						    }
 						    }
						    if (!amount || amount === NaN || amount === "NaN") {
							amount = 0;
						    }
						    console.log({amount});
						    this.setState({ amount: String(Number(amount).toFixed(2)) });
						}}
			    value={this.state.amount}
                            underlineColorAndroid='black'
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <TouchableOpacity style={styles.buttonContainer} onPress={this.onSend.bind(this)}>
                            <Text style={styles.buttonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                </View>
            </View>
        );
    }
}


function mapStateToProps(state) {
    return {
        balance: state.data.wallet.balance
    }
}

export default connect(mapStateToProps, { generateClaimLink })(SendScreen);

