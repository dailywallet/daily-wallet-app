import React from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';

import styles from './styles';


class IntroScreen extends React.Component {
    static navigatorStyle = {
        navBarHidden: true,
    }

    state = {
        claimlLink: ''
    }

    onSubmit() {
	const { claimLink } = this.state;
	console.log({claimLink});
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


export default IntroScreen;
