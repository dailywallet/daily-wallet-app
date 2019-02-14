import { combineReducers } from 'redux';

import wallet from './wallet';
import pendingClaimTx from './pendingClaimTx';
import {
    keystore
} from './keystore';
import {
    mnemonic
} from './mnemonic';


export default combineReducers({
    wallet,
    keystore,
    mnemonic,
    pendingClaimTx
});
