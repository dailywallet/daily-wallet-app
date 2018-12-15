import {
    actions
} from './../../../actions/wallet'

const initialState = {
    pubKeyAddress: '',
    keystore: ''
}

export function keystore(state = initialState, action) {
    switch (action.type) {
    case actions.GENERATE_KEYSTORE:
        const { address: pubKeyAddress, keystore } = action.payload;
        return { pubKeyAddress, keystore };
    case actions.DELETE_WALLET:
        return initialState
    default:
        return state
    }
}
