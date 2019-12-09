/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-tdeme
 * @link https://gitdub.com/scandipwa/base-tdeme
 */

import PropTypes from 'prop-types';
import {PureComponent} from 'react';
import './MyAccountOrderTableRow.style';

import {baseOrderInfoType} from 'Type/Account';
import ProductCard from "Component/ProductCard/ProductCard.container";

class MyAccountOrderTableRow extends PureComponent {
    static propTypes = {
        base_order_info: baseOrderInfoType.isRequired,
        onViewClick: PropTypes.func.isRequired
    };

    render() {
        const {
            base_order_info: {
                created_at,
                status_label,
                increment_id,
            },
            tracking_numbers,
            order_products,
            onViewClick
        } = this.props;
        return (
            <div block="MyAccountOrderTableRow">
                <div block="MyAccountOrderTableRow" elem="Info">
                    <h5 block="MyAccountOrderTableRow" elem="Label"
                        mods={{status: status_label && status_label.replace(/ /g, '_')}}>{status_label}</h5>
                    <div block="MyAccountOrderTableRow" elem="InfoItem">
                        <h5 className="subtitle-light">{__('Order number')}</h5>
                        {increment_id ? `${increment_id}` : ''}
                    </div>
                    <div block="MyAccountOrderTableRow" elem="InfoItem">
                        <h5 className="subtitle-light">{__('Order date')}</h5>
                        {created_at}
                    </div>
                </div>
                <div block="MyAccountOrderTableRow" elem="Content">
                    <div block="MyAccountMyWishlist" elem="Products">
                        {(order_products || []).map((product, i) => <ProductCard
                            key={i}
                            isOrderItem={true}
                            product={product}
                        />)}
                    </div>
                    <div block="MyAccountOrderTableRow" elem="Buttons">
                        <button
                            block="Button"
                            mods={{type: 'white'}}
                            onClick={() => onViewClick('details')}>
                            {__('View order')}
                        </button>
                        {tracking_numbers && tracking_numbers.length > 0 && <button
                            block="Button"
                            mods={{type: 'white'}}
                            onClick={() => onViewClick('tracking')}>
                            {__('Tracking order')}
                        </button>}
                        <div
                            block="MyAccountOrderTableRow"
                            elem="Status"
                            mods={{
                                status: status_label && status_label.replace(/ /g, '_')
                            }}
                        >{status_label}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyAccountOrderTableRow;
