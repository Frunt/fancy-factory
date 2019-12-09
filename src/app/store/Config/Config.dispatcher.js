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

import {QueryDispatcher} from 'Util/Request';
import {RegionQuery, ReviewQuery, ConfigQuery, CategoryQuery, StoreInformationQuery} from 'Query';
import {Mageplaza_BetterPopupQuery} from 'Modules/Mageplaza_BetterPopup';
import {showNotification} from 'Store/Notification';
import {updateConfig} from 'Store/Config';
import BrowserDatabase from 'Util/BrowserDatabase';
import {ONE_MONTH_IN_SECONDS} from 'Util/Request/QueryDispatcher';
import {getLiqPayConfig} from "Modules/Liqpay";

export class ConfigDispatcher extends QueryDispatcher {
    constructor() {
        super('Config');
    }

    onSuccess(data, dispatch) {
        if (data) {
            BrowserDatabase.setItem(data, 'config', ONE_MONTH_IN_SECONDS);
            dispatch(updateConfig(data));
        }
    }

    onError(error, dispatch) {
        dispatch(showNotification('error', 'Error fetching Config!', error));
    }

    prepareRequest() {
        return [
            RegionQuery.getCountriesQuery(),
            Mageplaza_BetterPopupQuery.getPopupData(),
            ReviewQuery.getRatingQuery(),
            ConfigQuery.getQuery(),
            getLiqPayConfig,
            CategoryQuery.getCategoryList(),
            StoreInformationQuery.getStoreInformation()
        ];
    }
}

export default new ConfigDispatcher();
