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

import {Field} from 'Util/Query';

export class ConfigQuery {
    getQuery() {
        return new Field('storeConfig')
            .addFieldList([
                'cms_home_page',
                'cms_no_route',
                'copyright',
                'header_logo_src',
                'timezone'
            ]).addField(new Field('instagram_info').addFieldList(['api_key', 'is_enabled']));
    }
}

export default new ConfigQuery();
