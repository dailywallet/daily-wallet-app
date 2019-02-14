import {
    actions
} from './../../../actions/wallet';

const initialState = {
    ciphertext: '',
    iv: ''
}

export function mnemonic(state = initialState, action) {
    switch (action.type) {
    case actions.GENERATE_KEYSTORE:
        const { encryptedMnemonic } = action.payload;
        return encryptedMnemonic;
    case actions.DELETE_WALLET:
        return initialState;
    default:
        return state;
    }
}
