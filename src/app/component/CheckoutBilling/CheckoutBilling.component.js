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

import Form from 'Component/Form';
import CheckoutPayments from 'Component/CheckoutPayments';
import CheckoutAddressBook from 'Component/CheckoutAddressBook';
import {BILLING_STEP, SHIPPING_STEP} from 'Route/Checkout/Checkout.component';
import {paymentMethodsType} from 'Type/Checkout';
import {TotalsType} from 'Type/MiniCart';
import Field from 'Component/Field';

import './CheckoutBilling.style';
import Link from "Component/Link";

class CheckoutBilling extends PureComponent {
    static propTypes = {
        onSameAsShippingChange: PropTypes.func.isRequired,
        onPaymentMethodSelect: PropTypes.func.isRequired,
        onBillingSuccess: PropTypes.func.isRequired,
        onBillingError: PropTypes.func.isRequired,
        paymentMethods: paymentMethodsType.isRequired,
        totals: TotalsType.isRequired
    };

    renderActions() {
        const {setCheckoutStep} = this.props;
        return (
            <div block="Checkout" elem="StepButtons">
                <Link to={'#'}
                      onClick={() => setCheckoutStep(SHIPPING_STEP)}
                      className="button-prev">{__('Back to shipping')}</Link>
                <button
                    type="submit"
                    block="Button"
                    mix={ { block: 'CheckoutShipping', elem: 'Button' } }
                >
                    { __('Complete order') }
                </button>
            </div>
        );
    }

    renderAddressBook() {
        const {onAddressSelect} = this.props;

        return (
            <CheckoutAddressBook
                onAddressSelect={onAddressSelect}
                isBilling
            />
        );
    }

    renderAddresses() {
        const {
            isSameAsShipping,
            totals: {is_virtual}
        } = this.props;

        return (
            <>
                {!is_virtual && (
                    <Field
                        id="sameAsShippingAddress"
                        name="sameAsShippingAddress"
                        type="hidden"
                        value="sameAsShippingAddress"
                        checked={true}
                    />
                )}
                {!isSameAsShipping && this.renderAddressBook()}
            </>
        );
    }

    renderPayments() {
        const {paymentMethods, onPaymentMethodSelect, checkoutTotals} = this.props;

        if (!paymentMethods.length) return null;

        return (
            <CheckoutPayments
                checkoutTotals={checkoutTotals}
                paymentMethods={paymentMethods}
                onPaymentMethodSelect={onPaymentMethodSelect}
            />
        );
    }

    render() {
        const {onBillingSuccess, onBillingError} = this.props;

        return (
            <Form
                mix={{block: 'CheckoutBilling'}}
                id={BILLING_STEP}
                onSubmitError={onBillingError}
                onSubmitSuccess={onBillingSuccess}
            >
                {this.renderAddresses()}
                {this.renderPayments()}
                {this.renderActions()}
            </Form>
        );
    }
}

export default CheckoutBilling;
