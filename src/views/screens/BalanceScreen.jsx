import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { deleteWallet } from './../../actions/wallet'
import styles from './styles';


class BalanceScreen extends React.Component {
    static navigatorStyle = {
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
    }

    componentWillMount() {
        this.props.navigator.setTitle({ title: 'Daily' })
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    id: 'settingsIcon',
                    icon: require('./../../img/settings.png'),
                },
            ],
        });
    }

    _deleteWallet() {
        this.props.deleteWallet()
        this.props.navigator.push({ screen: 'dailywallet.IntroScreen' })
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <View/>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require('./../../img/triangle.png')} />
                    <Text style={{...styles.balance, fontSize: 28}}>Your Balance</Text>
                    <Text style={{...styles.balance, fontSize: 60}}>$0.00</Text>
                </View>
                <View style={styles.centeredFlex}>
                    <Text style={styles.deleteWallet} onPress={() => {
                        this._deleteWallet()
                    }}>Delete wallet</Text>
                </View>
                <View style={{alignItems: 'center', marginBottom: 30}}>
                    <TouchableOpacity style={{ ...styles.buttonContainer }} onPress={() => { }}>
                        <Text style={styles.buttonText} onPress={() => this.props.navigator.push({ screen: 'dailywallet.SendScreen' })}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        wallet: state.data.wallet || ''
    }
}

export default connect(mapStateToProps, { deleteWallet })(BalanceScreen)