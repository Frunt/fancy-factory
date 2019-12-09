import {GET_CITY, GET_WAREHOUSES} from "./NovaPoshta.actions";

const initialState = {
    npCities: {items: []},
    npWarehouses: {items: []}
};

const NovaPoshtaReducer = (state = initialState, action) => {
    const {type} = action;
    switch (type) {
        case GET_CITY:
            const {city: npCities} = action;
            return {
                ...state,
                ...npCities
            };
        case GET_WAREHOUSES:
            const {warehouses: npWarehouses} = action;
            return {
                ...state,
                ...npWarehouses
            };
        default:
            return state
    }
};

export {NovaPoshtaReducer}