import React from 'react';
import { View, TouchableOpacity, Text, Image, RefreshControl } from 'react-native';
import styles from './styles';


class InfoScreen extends React.Component {
    static navigatorStyle = {
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }


    componentWillMount() {
        this.props.navigator.setTitle({ title: 'Info' });
    }

    render() {
        return (
            <View contentContainerStyle={{...styles.screenContainer, justifyContent: 'center'}}>
              <View style={{padding: 30}}>
                    <Text style={{ ...styles.balance, fontSize: 28 / 1.5 }}>This is Info screen about Daily Wallet app</Text>
                </View>
            </View>
        );
    }
}



export default InfoScreen;
