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

import {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {shippingMethodType} from 'Type/Checkout';
import {TotalsType} from 'Type/MiniCart';

import './CheckoutDeliveryOption.style';
import {formatCurrency} from 'Util/Price';

class CheckoutDeliveryOption extends PureComponent {
    static propTypes = {
        option: shippingMethodType.isRequired,
        onClick: PropTypes.func.isRequired,
        isSelected: PropTypes.bool,
        totals: TotalsType.isRequired
    };

    static defaultProps = {
        isSelected: false
    };

    onClick = () => {
        const {
            onClick,
            option
        } = this.props;

        onClick(option);
    };

    render() {
        const {
            isSelected,
            option: {carrier_title, method_title}
        } = this.props;

        return (
            <li block="CheckoutDeliveryOption">
                <button
                    block="CheckoutDeliveryOption"
                    mods={{isSelected}}
                    elem="Button"
                    onClick={this.onClick}
                    type="button"
                >
                    <span>{carrier_title} {method_title}</span>
                </button>
            </li>
        );
    }
}

export default CheckoutDeliveryOption;
