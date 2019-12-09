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

import PropTypes from 'prop-types';
import {PureComponent} from 'react';
import {orderType} from 'Type/Account';
import MyAccountOrderTableRow from './MyAccountOrderTableRow.component';

export class MyAccountOrderTableRowContainer extends PureComponent {
    static propTypes = {
        showOderData: PropTypes.func.isRequired,
        order: orderType.isRequired
    };

    containerFunctions = {
        onViewClick: this.onViewClick.bind(this)
    };

    onViewClick(type) {
        const {showOderData, order} = this.props;
        const {base_order_info: {increment_id}} = order;
        window.scrollTo(0, 0)

        showOderData({
            title: __('Order #%s', increment_id),
            type: type,
            increment_id,
            order
        });
    }

    containerProps = () => {
        const {order: {base_order_info, order_products, shipping_info: {tracking_numbers}}} = this.props;
        return {base_order_info, order_products, tracking_numbers};
    };

    render() {
        return (
            <MyAccountOrderTableRow
                {...this.containerProps()}
                {...this.containerFunctions}
            />
        );
    }
}

export default MyAccountOrderTableRowContainer;
