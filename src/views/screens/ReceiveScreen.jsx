import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, Image } from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import { changeAppRoot } from './../../actions/app';
import styles from './styles';


class ReceiveScreen extends React.Component {
    static navigatorStyle = {
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
    }

    componentWillMount() {
        this.props.navigator.setTitle({ title: 'Daily' });
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    id: 'settingsIcon',
                    icon: require('./../../img/settings.png'),
                },
            ],
        });
    }


    render() {
        return (
            <View colors={['rgba(195, 249, 207, 1)', 'rgba(114, 231, 130, 1)', 'rgba(103, 227, 118, 1)']} style={styles.screenContainer}>
                <View/>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require('./../../img/arrow.png')} />
                    <Text style={{...styles.balance, fontSize: 28}}>You received</Text>
                    <Text style={{...styles.balance, fontSize: 60}}>${this.props.amount}</Text>
                </View>
                {/* <View style={styles.centeredFlex}>
                    <Text style={styles.deleteWallet} onPress={() => {
                        this._deleteWallet()
                    }}>Delete wallet</Text>
                </View> */}
                <View style={{alignItems: 'center', marginBottom: 30}}>
                  <TouchableOpacity style={{ ...styles.buttonContainer }} onPress={() => {this.props.changeAppRoot('BalanceScreen'); }}>
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default connect(null, { changeAppRoot })(ReceiveScreen);
