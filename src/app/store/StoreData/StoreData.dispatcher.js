import {StoreDataQuery} from "Query";
import {getStoreData} from "Store/StoreData";
import {NovaPoshtaDispatcher} from "Modules/NovaPoshta";
import {showNotification} from "Store/Notification";

class StoreDataDispatcher {
    constructor(name, cacheTTL) {
        // super('NpCityList', 86400);
        this.name = name;
        this.cacheTTL = cacheTTL;
        this.promise = null;
    }

    getStoreData(dispatch) {
        const prepareRequest = () => {
            return StoreDataQuery.getStoresData();
        };

        const onSuccess = (StoreData, dispatch) => {
            return dispatch(getStoreData(StoreData));
        };

        const onError = (error, dispatch) => {
            return dispatch(showNotification('error', error[0].message))
        };
        const onUpdate = (data, dispatch, options) => {
            onSuccess(data, dispatch, options);
        };

        NovaPoshtaDispatcher.handleData(dispatch, null, prepareRequest, onSuccess, onError, onUpdate)
    }
}

export default new StoreDataDispatcher();