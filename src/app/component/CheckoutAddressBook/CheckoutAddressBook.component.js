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
import {customerType, ADDRESS_BOOK} from 'Type/Account';
import {MY_ACCOUNT_URL} from 'Route/MyAccount/MyAccount.container';
import Link from 'Component/Link';
import CheckoutAddressTable from 'Component/CheckoutAddressTable';
import Loader from 'Component/Loader';
import CheckoutAddressForm from 'Component/CheckoutAddressForm';
import './CheckoutAddressBook.style';
import {BILLING_STEP, SHIPPING_STEP} from 'Route/Checkout/Checkout.component';

class CheckoutAddressBook extends PureComponent {
    static propTypes = {
        customer: customerType.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        isBilling: PropTypes.bool.isRequired
    };

    state = {
        isCustomAddressExpanded: false
    };

    renderLoading() {
        return (
            <Loader isLoading/>
        );
    }

    renderAddressList() {
        const {customer: {addresses}} = this.props;
        if (!addresses) return this.renderLoading();
        if (!addresses.length) return this.renderCustomAddress();
        return this.renderCustomAddress(addresses[0]);
    }

    renderCustomAddress(address) {
        const {isBilling, onShippingEstimationFieldsChange, selectedShippingMethod} = this.props;
        const formPortalId = isBilling ? BILLING_STEP : SHIPPING_STEP;

        return (
            <CheckoutAddressForm
                selectedShippingMethod={selectedShippingMethod}
                onShippingEstimationFieldsChange={onShippingEstimationFieldsChange}
                address={address || {}}
                id={formPortalId}
            />
        );
    }

    renderSignedInContent() {
        return (
            <>
                <div block="CheckoutAddressBook" elem="Wrapper">
                    {this.renderAddressList()}
                </div>
            </>
        );
    }

    renderGuestContent() {
        return this.renderCustomAddress();
    }

    renderContent() {
        const {isSignedIn} = this.props;
        if (isSignedIn) return this.renderSignedInContent();
        return this.renderGuestContent();
    }

    render() {
        return (
            <div block="CheckoutAddressBook">
                {this.renderContent()}
            </div>
        );
    }
}

export default CheckoutAddressBook;
