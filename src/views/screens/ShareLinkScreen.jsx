import React from 'react';
import { View, TouchableOpacity, Text, Share } from 'react-native';
import { formatAmount } from '../../utils/helpers';
import styles from './styles';


class ShareLinkScreen extends React.Component {
    static navigatorStyle = {
        navBarTextColor: 'white',
        navBarBackgroundColor: '#302E2E',
        navBarButtonColor: 'white',
    }    

    render() {
	const { amount } = this.props;
        return (
            <View style={styles.screenContainer}>
                <View style={styles.centeredFlex}>
                    <Text style={styles.title}>Share Link Screen</Text>
                </View>
                <View style={styles.centeredFlex}>
                  <Text style={styles.shareScreenText}>Share this link to send ${formatAmount(amount)}</Text>
                </View>
                <View style={styles.centeredFlex}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={() => {
                        Share.share({
                            message: `Hey, I've sent you $${formatAmount(amount)}: ${this.props.link}`,
                            url: this.props.link,
                            title: 'Claim link'
                        }, {
                                // Android only:
                                dialogTitle: 'Share the link',
                                // iOS only:
                                excludedActivityTypes: [
                                    'com.apple.UIKit.activity.PostToTwitter'
                                ]
                            })
                    }}>
                        <Text style={styles.buttonText}>Share</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


export default ShareLinkScreen;
