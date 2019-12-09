import {GET_STORES_DATA} from "Store/StoreData";
import BrowserDatabase from "Util/BrowserDatabase";

const initialState = {
    storesData: {
        items: BrowserDatabase.getItem(GET_STORES_DATA) || []
    }
};

const StoreDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_STORES_DATA:
            const storesData = action.storeData;
            const items = storesData.storesData.items.filter(ss => ss.store_code !== 'luma');
            BrowserDatabase.setItem(items, GET_STORES_DATA, 860000);
            return {
                ...state,
                storesData: {items}
            };
        default:
            return state
    }
};
export default StoreDataReducer