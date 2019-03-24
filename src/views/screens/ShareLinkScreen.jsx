import React from 'react';
import { View, TouchableOpacity, Text, Share } from 'react-native';
import { formatAmount } from '../../utils/helpers';
import i18n from 'DailyWallet/src/i18n';
import styles from './styles';


class ShareLinkScreen extends React.Component {
    static navigatorStyle = {
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }    


    componentDidMount() {
	this._share();
    }

    // translate helper
    t(text) {
	return i18n.t(`ShareLinkScreen.${text}`);
    }    
    
    _share() {
	
        Share.share({
            message: `${this.t("hey_i_ve_sent_you")} $${formatAmount(this.props.amount)}: ${this.props.link}`,
            url: this.props.link,
            title: this.t("share_the_link")
        }, {
            // Android only:
            dialogTitle: this.t("share_the_link"),
            // iOS only:
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ]
        })
    }
    
    render() {
	const { amount } = this.props;
        return (
            <View style={styles.screenContainer}>
                <View style={styles.centeredFlex}>
                <Text style={styles.shareScreenText}>{this.t("share_the_link_to_send")} ${formatAmount(amount)}</Text>
                </View>
                <View style={styles.centeredFlex}>
                <TouchableOpacity style={styles.buttonContainer} onPress={this._share.bind(this)}>
                <Text style={styles.buttonText}>{this.t("share")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


export default ShareLinkScreen;
