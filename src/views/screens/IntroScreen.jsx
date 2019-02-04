import React from 'react';
import { View, TouchableOpacity, Text, } from 'react-native';
import styles from './styles';


class IntroScreen extends React.Component {
    static navigatorStyle = {
        navBarHidden: true
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Intro Screen</Text>
                </View>
                <View style={styles.centeredFlex}>
                  <TouchableOpacity style={{...styles.buttonContainer, width: 200}} onPress={() => this.props.navigator.push({ screen: 'dailywallet.PasscodeSetScreen' })}>
                      <Text style={styles.buttonText}>Create New Wallet</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


export default IntroScreen;
