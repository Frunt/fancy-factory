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

import CheckoutAddressBook from 'Component/CheckoutAddressBook';
import {SHIPPING_STEP, USER_DATA_STEP} from 'Route/Checkout/Checkout.component';
import CheckoutDeliveryOptions from 'Component/CheckoutDeliveryOptions';
import {shippingMethodsType, shippingMethodType} from 'Type/Checkout';
import Loader from 'Component/Loader';
import Form from 'Component/Form';
import Link from "Component/Link";

class CheckoutShipping extends PureComponent {
    static propTypes = {
        onShippingSuccess: PropTypes.func.isRequired,
        onShippingError: PropTypes.func.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        shippingMethods: shippingMethodsType.isRequired,
        onShippingMethodSelect: PropTypes.func.isRequired,
        selectedShippingMethod: shippingMethodType,
        onAddressSelect: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    static defaultProps = {
        selectedShippingMethod: null
    };

    renderActions() {
        const {selectedShippingMethod, setCheckoutStep} = this.props;

        return (

            <div block="Checkout" elem="StepButtons">
                <Link to={'#'}
                      onClick={() => setCheckoutStep(USER_DATA_STEP)}
                      className="button-prev">{__('Back to information')}</Link>
                <button
                    type="submit"
                    block="Button"
                    disabled={!selectedShippingMethod}
                    mix={{block: 'CheckoutShipping', elem: 'Button'}}
                >
                    {__('Next')}
                </button>
            </div>
        );
    }

    renderDelivery() {
        const {
            shippingMethods,
            onShippingMethodSelect
        } = this.props;

        return (
            <CheckoutDeliveryOptions
                shippingMethods={shippingMethods}
                onShippingMethodSelect={onShippingMethodSelect}
            />
        );
    }

    renderAddressBook() {
        const {
            onAddressSelect,
            selectedShippingMethod,
            onShippingEstimationFieldsChange
        } = this.props;

        return (
            <CheckoutAddressBook
                onAddressSelect={onAddressSelect}
                selectedShippingMethod={selectedShippingMethod}
                onShippingEstimationFieldsChange={onShippingEstimationFieldsChange}
            />
        );
    }

    render() {
        const {
            onShippingSuccess,
            onShippingError,
            isLoading
        } = this.props;

        return (
            <Form
                id={SHIPPING_STEP}
                mix={{block: 'CheckoutShipping'}}
                onSubmitError={onShippingError}
                onSubmitSuccess={onShippingSuccess}
            >
                <h3 block="Checkout" elem="StepTitle">
                    {__('Delivery')}
                </h3>
                <Loader isLoading={isLoading}/>
                {this.renderDelivery()}
                {this.renderAddressBook()}
                {this.renderActions()}
            </Form>
        );
    }
}

export default CheckoutShipping;
