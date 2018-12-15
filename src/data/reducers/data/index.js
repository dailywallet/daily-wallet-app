import { combineReducers } from 'redux';
import {
    wallet
} from './wallet';
import {
    keystore
} from './keystore';


export default combineReducers({
    wallet,
    keystore
});
