import * as types from '../types';

const initialState = {

    firstTime: false

}


export default (state = initialState, action) => {
    console.log({action});
    
    switch (action.type) {
        case types.FIRST_TIME:
            return {
                ...state,
                ...action.afterSignup
            }

        default:
            return state;
    }
}