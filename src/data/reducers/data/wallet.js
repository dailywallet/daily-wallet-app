import {
    actions
} from './../../../actions/wallet'

const initialState = {
    address: ''
}

export function wallet(state = initialState, action) {
    switch (action.type) {
        case actions.ADD_IDENTITY_CONTRACT:
        const { address } = action.payload
        return { address };
        case actions.DELETE_WALLET:
            return initialState
        default:
            return state
    }
}
