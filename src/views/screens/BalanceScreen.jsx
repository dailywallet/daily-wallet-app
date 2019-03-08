import React from 'react';
import { utils } from 'ethers';
import { connect } from 'react-redux';
import { ScrollView, View, TouchableOpacity, Text, Image, RefreshControl, Platform, ActionSheetIOS } from 'react-native';
import { deleteWallet, fetchBalance, onPressRedeemBtn } from './../../actions/wallet';
import { formatAmount } from '../../utils/helpers';
import styles from './styles';


class BalanceScreen extends React.Component {
    static navigatorStyle = {
	orientation: 'portrait',	
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	this.state = {
            fetchingBalance: false
	};
    }

    componentWillMount() {
        this.props.navigator.setTitle({ title: 'Daily' });
	let rightButtons = [];
	if (Platform.OS === 'ios') {
	    //
	    rightButtons = [
		{
		    id: 'settingsIOS',
		    icon: require('../../img/settings.png')
		}		
	    ]
	} else { // Action Bar on android
	    rightButtons = [
                {
		    id: 'deleteWallet',
		    title: 'Erase wallet',
                    showAsAction: 'withText'
                },
                {
                    id: 'recoveryButton',
                    title: 'Save wallet to paper',
                    showAsAction: 'withText'
                },				
                {
                    id: 'infoButton',
                    title: 'Info',
                    showAsAction: 'withText'
                },
                {
                    id: 'showAddressButton',
                    title: 'Show address',
                    showAsAction: 'withText'
                },		
	    ]
	}

	this.props.navigator.setButtons({
	    rightButtons
        });
    }

    onNavigatorEvent(event) {
        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'deleteWallet') {
                this._deleteWallet();
            } else if (event.id == 'infoButton') {
		this.props.navigator.push({ screen: 'dailywallet.InfoScreen' });
            } else if (event.id == 'showAddressButton') {
		this.props.navigator.push({ screen: 'dailywallet.ReceiveScreen' });		
            } else if (event.id == 'settingsIOS') {
		this._showActionSheetIOS();
            } else if (event.id == 'recoveryButton') {
		this.props.navigator.push({ screen: 'dailywallet.BackupWalletStartScreen' });
            }	    
	    
        }
    }

    _showActionSheetIOS() {
	ActionSheetIOS.showActionSheetWithOptions( {
	    options: ['Cancel', 'Show Address', 'Save wallet to paper', 'Delete Wallet'],
	    destructiveButtonIndex: 3,
	    cancelButtonIndex: 0,
	},  (buttonIndex) => {
	    if (buttonIndex === 1) {
		this.props.navigator.push({ screen: 'dailywallet.ReceiveScreen' });
	    } else if (buttonIndex === 2) {
		this.props.navigator.push({ screen: 'dailywallet.BackupWalletStartScreen' });
	    } else if (buttonIndex === 3) {
		this._deleteWallet();
	    }
	});		
    }

    _deleteWallet() {
        this.props.deleteWallet();
        //this.props.navigator.push({ screen: 'dailywallet.IntroScreen' })
    }

    onRefresh() {
        this.setState({ fetchingBalance: true });
        setTimeout(async () => {
            try {
                await this.props.fetchBalance();
            } catch (err) {
                console.log(err);
                alert("Error")
            }
            this.setState({ fetchingBalance: false });
        });
    }

    _renderStatusBar() {
        if (!(this.props.isPendingTx)) {
	    return null;
	}
	let title, sign, backgroundColor;
	backgroundColor = 'rgba(38,207,54,0.3)';
	if (this.props.pendingAmount) {
	    let amount = Math.abs(this.props.pendingClaimTx.amount);
	    amount = formatAmount(amount);
	    if (this.props.pendingClaimTx.amount > 0) { 
		sign = "+";
	    } else {
		sign = "-";
		backgroundColor = 'rgba(38, 86, 207, 0.3)';
	    }	    
	    title = `${sign} $${amount} is pending`;
	} else  {
	    title = 'Checking copied link...';
	}
	
	return (
                <View style={{...styles.statusBarContainer, backgroundColor }}>
                <Text style={{ ...styles.balance, fontSize: 28 / 1.5, marginTop: 7}}>
		{ title }
            </Text>
                </View>
	);
        
    }


    render() {
        return (
            <ScrollView contentContainerStyle={styles.screenContainer}
                refreshControl={<RefreshControl onRefresh={this.onRefresh.bind(this)} refreshing={this.state.fetchingBalance} />}
            >
                <View style={styles.balanceContainer}>
                    <Text style={{ ...styles.balance, fontSize: 28 / 1.5 }}>Your phone has</Text>
                    <Text style={{ ...styles.balance, fontSize: 60 / 1.5 }}>${formatAmount(this.props.balance)}</Text>
                    {this._renderStatusBar()}
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center', marginBottom: 50 }}>
                <TouchableOpacity onPress={() => this.props.onPressRedeemBtn()} >
                <Image source={require('./../../img/redeem_icon.png')}></Image>
		<Text style={{ ...styles.balance, fontSize: 28 / 1.5, width: 100, marginTop: 8}}>Redeem Link</Text>
                </TouchableOpacity>
                </View>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => this.props.navigator.push({ screen: 'dailywallet.SendScreen' })}>
                          <Image source={require('./../../img/send_icon.png')}></Image>
			  <Text style={{ ...styles.balance, fontSize: 28 / 1.5, width: 100, marginTop: 8}}>Send money</Text>			  
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
}


function mapStateToProps(state) {
    console.log({state})
    return {
        balance: state.data.wallet.balance,
	pendingClaimTx: state.data.pendingClaimTx,
	isPendingTx: state.data.pendingClaimTx.isPending,
	pendingAmount: state.data.pendingClaimTx.amount
    }
}

export default connect(mapStateToProps, { deleteWallet, fetchBalance, onPressRedeemBtn })(BalanceScreen);
