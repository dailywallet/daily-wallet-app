import { combineReducers } from 'redux';

import wallet from './wallet';
import pendingClaimTx from './pendingClaimTx';
import {
    keystore
} from './keystore';


export default combineReducers({
    wallet,
    keystore,
    pendingClaimTx
});
