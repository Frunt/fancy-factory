import {SUBSCRIBE_CUSTOMER} from "./Subscribe.action";

const SubscribeReducer = (state = {}, action) => {
    switch (action.type) {
        case SUBSCRIBE_CUSTOMER:
            const {subscribe: subscribeCustomer} = action;
            return {
                ...state,
                ...subscribeCustomer
            };
        default:
            return state
    }
};
export default SubscribeReducer