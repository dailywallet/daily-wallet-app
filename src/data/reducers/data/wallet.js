import { combineReducers } from 'redux';
import {
    actions
} from './../../../actions/wallet'



function address(state = '', action) {
    switch (action.type) {
    case actions.ADD_IDENTITY_CONTRACT:
        const { address } = action.payload;
        return address;
    case actions.DELETE_WALLET:
        return '';
    default:
        return state;
    }
}


const zero = 0;
function balance(state = zero, action) {
    switch (action.type) {
    case actions.UPDATE_BALANCE:
        const { balance } = action.payload;
        return balance;
    case actions.DELETE_WALLET:
        return zero;
    default:
        return state
    }
}

export default combineReducers({address, balance});
