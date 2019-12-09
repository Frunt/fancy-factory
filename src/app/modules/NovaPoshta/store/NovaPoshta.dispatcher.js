import {NovaPoshtaQuery} from "Modules/NovaPoshta";
import {Field, prepareQuery} from "Util/Query";
import {makeCancelable} from "Util/Promise";
import {executeGet, listenForBroadCast} from "Util/Request";
import {showNotification} from "Store/Notification";
import {getCity, getWarehouses} from "./NovaPoshta.actions";

class NovaPoshtaDispatcher{
    constructor(name, cacheTTL) {
        // super('NpCityList', 86400);
        this.name = name;
        this.cacheTTL = cacheTTL;
        this.promise = null;
    }

    handleData(dispatch, options, prepareRequest, onSuccess, onError, onUpdate) {
        const {name, cacheTTL} = this;
        const rawQueries = prepareRequest(options, dispatch);
        const queries = rawQueries instanceof Field ? [rawQueries] : rawQueries;

        if (this.promise) this.promise.cancel();

        this.promise = makeCancelable(
            new Promise((resolve, reject) => {
                executeGet(prepareQuery(queries), name, cacheTTL)
                    .then(data => resolve(data), error => reject(error));
            })
        );

        this.promise.promise.then(
            data => onSuccess(data, dispatch, options),
            error => onError(error, dispatch, options),
        );

        listenForBroadCast(name).then(
            data => onUpdate(data, dispatch, options),
        );
    }

    getCity(dispatch, options) {
        const prepareRequest = (options) => {
            return NovaPoshtaQuery.getCities(options);
        };

        const onSuccess = (data, dispatch) => {
            return dispatch(getCity(data));
        };

        const onError = (error, dispatch) => {
            return dispatch(showNotification('error', error[0].message))
        };
        const onUpdate = (data, dispatch, options) => {
            onSuccess(data, dispatch, options);
        };
        this.handleData(dispatch, options, prepareRequest, onSuccess, onError, onUpdate)
    }

    getWarehouses(dispatch, options) {
        const prepareRequest = (options) => {
            return NovaPoshtaQuery.getWarehouses(options);
        };

        const onSuccess = (data, dispatch) => {
            return dispatch(getWarehouses(data));
        };

        const onError = (error, dispatch) => {
            return dispatch(showNotification('error', error[0].message))
        };
        const onUpdate = (data, dispatch, options) => {
            onSuccess(data, dispatch, options);
        };
        this.handleData(dispatch, options, prepareRequest, onSuccess, onError, onUpdate)
    }

    clearWarehouses(dispatch) {
        dispatch(getWarehouses({npWarehouses: {items: []}}))
    }


}

export default new NovaPoshtaDispatcher();