import { Navigation } from 'react-native-navigation';
import IntroScreen from './IntroScreen';
import BalanceScreen from './BalanceScreen';

import ScanScreen from './ScanScreen';
import PasscodeSetScreen from './PasscodeSetScreen';
import PasscodeSetScreenConfirm from './PasscodeSetScreenConfirm';
import PincodeOnSendScreen from './PincodeOnSendScreen';
import ShareLinkScreen from './ShareLinkScreen';
import SendScreen from './SendScreen';
import SendToAddressScreen from './SendToAddressScreen';
import InfoScreen from './InfoScreen';

import BackupWalletStartScreen from './BackupWalletStartScreen';
import BackupWalletWordScreen from './BackupWalletWordScreen';
import BackupWalletInputWordScreen from './BackupWalletInputWordScreen';
import RecoverMnemonicScreen from './RecoverMnemonicScreen';
import ReceiveScreen from './ReceiveScreen';


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
    Navigation.registerComponent('dailywallet.RecoverMnemonicScreen', () => RecoverMnemonicScreen, store, Provider);
    Navigation.registerComponent('dailywallet.SendToAddressScreen', () => SendToAddressScreen, store, Provider);
    Navigation.registerComponent('dailywallet.ScanScreen', () => ScanScreen, store, Provider);
    Navigation.registerComponent('dailywallet.ReceiveScreen', () => ReceiveScreen, store, Provider);    
};
