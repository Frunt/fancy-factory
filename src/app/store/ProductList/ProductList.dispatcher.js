/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import {executeGet, listenForBroadCast, QueryDispatcher} from 'Util/Request';
import {ProductListQuery} from 'Query';
import {
    appendPage,
    updateProductListItems,
    updateLoadStatus,
    updateWidgetProducts
} from 'Store/ProductList';
import {showNotification} from 'Store/Notification';
import {updateNoMatch} from 'Store/NoMatch';
import {Field, prepareQuery} from "Util/Query";
import {makeCancelable} from "Util/Promise";

/**
 * Product List Dispatcher
 * @class ProductListDispatcher
 * @extends QueryDispatcher
 */
export class ProductListDispatcher extends QueryDispatcher {
    constructor() {
        super('ProductList');
    }


    handleWidgetData(dispatch, options) {
        const {name, cacheTTL} = this;
        const rawQueries = this.prepareRequest(options, dispatch);
        const queries = rawQueries instanceof Field ? [rawQueries] : rawQueries;

        this.promise = makeCancelable(
            new Promise((resolve, reject) => {
                executeGet(prepareQuery(queries), name, cacheTTL)
                    .then(
                        data => resolve(data),
                        error => reject(error)
                    );
            })
        );

        this.promise.promise.then(
            data => this.onSuccess(data, dispatch, options),
            error => this.onError(error, dispatch, options),
        );

        listenForBroadCast(name).then(
            data => this.onUpdate(data, dispatch, options),
        );
    }

    onSuccess(data, dispatch, options) {
        const {
            products: {
                items,
                total_count,
                page_info: {total_pages} = {}
            } = {}
        } = data;
        const {args: {currentPage}, isNext, additionalType} = options;
        if (isNext) return dispatch(appendPage(items, currentPage));
        if (additionalType) return dispatch(updateWidgetProducts(items, total_count, additionalType));
        return dispatch(updateProductListItems(items, currentPage, total_count, total_pages));
    }

    onError(error, dispatch) {
        dispatch(showNotification('error', 'Error fetching Product List!', error));
        dispatch(updateNoMatch(true));
    }

    prepareRequest(options, dispatch) {
        const {isNext} = options;
        if (!isNext) dispatch(updateLoadStatus(true));
        return ProductListQuery.getQuery(options);
    }
}

export default new ProductListDispatcher();
