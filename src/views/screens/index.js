import { Navigation } from 'react-native-navigation';
import IntroScreen from './IntroScreen';
import BalanceScreen from './BalanceScreen';
import PasscodeSetScreen from './PasscodeSetScreen';
import PasscodeSetScreenConfirm from './PasscodeSetScreenConfirm';
import PincodeOnSendScreen from './PincodeOnSendScreen';
import ShareLinkScreen from './ShareLinkScreen';
import SendScreen from './SendScreen';
import InfoScreen from './InfoScreen';

import BackupWalletStartScreen from './BackupWalletStartScreen';
import BackupWalletWordScreen from './BackupWalletWordScreen';
import BackupWalletInputWordScreen from './BackupWalletInputWordScreen';

export default (store, Provider) => {
    // SCREENS
    Navigation.registerComponent('dailywallet.IntroScreen', () => IntroScreen, store, Provider);
    Navigation.registerComponent('dailywallet.BalanceScreen', () => BalanceScreen, store, Provider);
    Navigation.registerComponent('dailywallet.PasscodeSetScreen', () => PasscodeSetScreen, store, Provider);
    Navigation.registerComponent('dailywallet.PasscodeSetScreenConfirm', () => PasscodeSetScreenConfirm, store, Provider);
    Navigation.registerComponent('dailywallet.PincodeOnSendScreen', () => PincodeOnSendScreen, store, Provider);
    Navigation.registerComponent('dailywallet.ShareLinkScreen', () => ShareLinkScreen, store, Provider);
    Navigation.registerComponent('dailywallet.SendScreen', () => SendScreen, store, Provider);
    Navigation.registerComponent('dailywallet.InfoScreen', () => InfoScreen, store, Provider);
    Navigation.registerComponent('dailywallet.BackupWalletStartScreen', () => BackupWalletStartScreen, store, Provider);
    Navigation.registerComponent('dailywallet.BackupWalletWordScreen', () => BackupWalletWordScreen, store, Provider);
    Navigation.registerComponent('dailywallet.BackupWalletInputWordScreen', () => BackupWalletInputWordScreen, store, Provider);    
};
