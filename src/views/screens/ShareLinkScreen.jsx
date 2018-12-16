import React from 'react';
import { View, TouchableOpacity, Text, Share } from 'react-native';
import styles from './styles';


class ShareLinkScreen extends React.Component {
    static navigatorStyle = {
        navBarHidden: true,
    }

    render() {
	const amount = this.props.amount / 100;
	console.log("link", this.props.link);
        return (
            <View style={styles.screenContainer}>
                <View style={styles.centeredFlex}>
                    <Text style={styles.title}>Share Link Screen</Text>
                </View>
                <View style={styles.centeredFlex}>
                    <Text style={styles.shareScreenText}>Share this link to send ${amount}</Text>
                </View>
                <View style={styles.centeredFlex}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={() => {
                        Share.share({
                            message: `Hey, I've sent you $${amount}: ${this.props.link}`,
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
