import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { generateClaimLink } from './../../actions/wallet';
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
	console.log("onSubmit"); 
	if (this.props.balance < this.state.amount) {
	    alert(`Amount should be less than balance ($${this.props.balance})`);
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
                            keyboardType='numbers-and-punctuation'
                            autoFocus={true}
                            style={{ ...styles.sendScreenText, width: 50 }}
                            onChangeText={(amount) => this.setState({ amount })}
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

