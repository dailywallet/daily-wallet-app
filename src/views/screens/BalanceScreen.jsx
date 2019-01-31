import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, View, TouchableOpacity, Text, Image, RefreshControl } from 'react-native';
import { deleteWallet, fetchBalance } from './../../actions/wallet';
import styles from './styles';


class BalanceScreen extends React.Component {
    static navigatorStyle = {
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
	navBarButtonColor: 'white',
    }

    state = {
	fetchingBalance: false
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

    onRefresh() {
	this.setState({fetchingBalance: true});
	setTimeout(async () => { 
	    try { 
		await this.props.fetchBalance();
	    } catch(err) {
		console.log(err);
		alert("Error")
	    }
	    this.setState({fetchingBalance: false});
	});
    }
    
    render() {
        return (
            <ScrollView contentContainerStyle={styles.screenContainer}
			refreshControl={<RefreshControl onRefresh={this.onRefresh.bind(this)} refreshing={this.state.fetchingBalance}/>}
			>
	      <View style={{flex: 1, flexDirection: 'column', justifyContent:'center'}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image style={{}} source={require('./../../img/triangle.png')} />
                    <Text style={{...styles.balance, fontSize: 28/ 1.5}}>Your Balance</Text>
                    <Text style={{...styles.balance, fontSize: 60 / 1.5}}>${this.props.balance}</Text>
                </View>
	      </View>
	      <View style={{flex: 1}}>	      
                <View style={styles.centeredFlex}>
                    <Text style={styles.deleteWallet} onPress={() => {
                        this._deleteWallet()
                    }}>Delete wallet</Text>
                </View>
                <View style={{alignItems: 'center', marginBottom: 10}}>
                    <TouchableOpacity style={{ ...styles.buttonContainer }} onPress={() => { }}>
                        <Text style={styles.buttonText} onPress={() => this.props.navigator.push({ screen: 'dailywallet.SendScreen' })}>Send</Text>
                    </TouchableOpacity>
                </View>

                <View style={{alignItems: 'center', marginBottom: 50}}>
                    <TouchableOpacity style={{ ...styles.buttonContainer }} onPress={() => { }}>
                        <Text style={styles.buttonText} onPress={() => this.props.navigator.push({ screen: 'dailywallet.ClaimScreen' })}>Receive</Text>
                    </TouchableOpacity>
                </View>
	      </View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    return {
        balance: state.data.wallet.balance
    }
}

export default connect(mapStateToProps, { deleteWallet, fetchBalance })(BalanceScreen)
