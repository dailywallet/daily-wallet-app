import { combineReducers } from 'redux';
import {
    actions
} from './../../../actions/wallet';


const initialState = {
    txHash: null,
    isPending: false,
    amount: 0
}

function pendingClaimTx(state = initialState, action) {
    switch (action.type) {
    case actions.UPDATE_PENDING_CLAIM_TX:
        const { txHash, isPending, amount } = action.payload;
	return { txHash, isPending, amount };
    case actions.DELETE_WALLET:
        return {...initialState};
    default:
        return state;
    }
}


export default pendingClaimTx;
