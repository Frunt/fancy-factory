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

import BrowserDatabase from 'Util/BrowserDatabase';
import {UPDATE_CONFIG} from './Config.action';

export const initialState = BrowserDatabase.getItem('config') || {
    countries: [],
    reviewRatings: [],
    category: {},
    cms_home_page: '',
    cms_no_route: '',
    instagram_info: {},
    PopupData: [],
    copyright: '',
    header_logo_src: '',
    timezone: '',
    liqPayConfiguration: {},
    storeInformation: {}
};

const ConfigReducer = (state = initialState, action) => {
    const {config: {countries, reviewRatings, storeConfig, category, storeInformation, liqPayConfiguration} = {}, type} = action;

    switch (type) {
        case UPDATE_CONFIG:
            return {
                ...state,
                liqPayConfiguration,
                countries,
                storeInformation,
                reviewRatings,
                ...storeConfig,
                category
            };

        default:
            return state;
    }
};

export default ConfigReducer;
