import {changeAppRoot} from './app';
import * as ksService from './../services/keystoreService';

export const actions = {
    ADD_IDENTITY_CONTRACT: 'ADD_IDENTITY_CONTRACT',
    GENERATE_KEYSTORE: 'GENERATE_KEYSTORE',    
    DELETE_WALLET: 'DELETE_WALLET',
};


export function generateKeystore(password) {
    return async (dispatch, getState) => {
        const {address, keystore} = await ksService.generateKeystore(password);
        dispatch({
            type: actions.GENERATE_KEYSTORE,
            payload: {keystore, address}
        });
        dispatch(changeAppRoot('ClaimScreen'));
    };
}

export function deleteWallet() {
    return {
        type: 'DELETE_WALLET',
        payload: null
    }
}


