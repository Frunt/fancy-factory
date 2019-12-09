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

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {paymentMethodsType, shippingMethodsType} from 'Type/Checkout';
import CheckoutOrderSummary from 'Component/CheckoutOrderSummary';
import CheckoutShipping from 'Component/CheckoutShipping';
import CheckoutBilling from 'Component/CheckoutBilling';
import ContentWrapper from 'Component/ContentWrapper';
import {CHECKOUT} from 'Component/Header';
import {addressType} from 'Type/Account';
import {TotalsType} from 'Type/MiniCart';
import {HistoryType} from 'Type/Common';
import Loader from 'Component/Loader';
import Meta from 'Component/Meta';

import './Checkout.style';
import {CheckoutUserDataStepContainer as CheckoutUserDataStep} from "Component/CheckoutUserDataStep/CheckoutUserDataStep.container";
import {LiqpayComponent} from "Modules/Liqpay";

export const USER_DATA_STEP = 'USER_DATA_STEP';
export const SHIPPING_STEP = 'SHIPPING_STEP';
export const BILLING_STEP = 'BILLING_STEP';
export const DETAILS_STEP = 'DETAILS_STEP';
export const LIQ_PAY_STEP = 'LIQ_PAY_STEP';

class Checkout extends PureComponent {
    static propTypes = {
        shippingMethods: shippingMethodsType.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
        paymentMethods: paymentMethodsType.isRequired,
        saveAddressInformation: PropTypes.func.isRequired,
        savePaymentInformation: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        isDeliveryOptionsLoading: PropTypes.bool.isRequired,
        shippingAddress: addressType.isRequired,
        checkoutTotals: TotalsType.isRequired,
        orderID: PropTypes.string.isRequired,
        history: HistoryType.isRequired,
        checkoutStep: PropTypes.oneOf([
            USER_DATA_STEP,
            SHIPPING_STEP,
            BILLING_STEP,
            DETAILS_STEP,
            LIQ_PAY_STEP
        ]).isRequired
    };

    stepMap = {
        [USER_DATA_STEP]: {
            title: __('User data'),
            render: this.renderUserDataStep.bind(this),
            areTotalsVisible: true
        },
        [SHIPPING_STEP]: {
            title: __('Shipping'),
            render: this.renderShippingStep.bind(this),
            areTotalsVisible: true
        },
        [BILLING_STEP]: {
            title: __('Billing'),
            render: this.renderBillingStep.bind(this),
            areTotalsVisible: true
        },
        [LIQ_PAY_STEP]: {
            title: __('Pay'),
            render: this.renderLiqPayStep.bind(this),
            areTotalsVisible: true
        },
        [DETAILS_STEP]: {
            title: __('Thank you for your purchase!'),
            render: this.renderDetailsStep.bind(this),
            areTotalsVisible: false
        }
    };

    constructor(props) {
        super(props);

        this.updateHeader();
    }

    componentDidUpdate(prevProps) {
        const {checkoutStep} = this.props;
        const {checkoutStep: prevCheckoutStep} = prevProps;

        if (checkoutStep !== prevCheckoutStep) {
            this.updateHeader();
        }
    }

    renderLiqPayStep() {
        const {checkoutTotals, liqPaySubmit, orderID} = this.props;
        return <LiqpayComponent
            orderID={orderID}
            checkoutTotals={checkoutTotals}
            submit={(data) => liqPaySubmit(data)}
        />
    }

    updateHeader() {
        const {setHeaderState, checkoutStep, history} = this.props;
        const {title = ''} = this.stepMap[checkoutStep];

        setHeaderState({
            name: CHECKOUT,
            title,
            onBackClick: () => history.push('/')
        });
    }

    renderTitle() {
        const {checkoutStep, setCheckoutStep} = this.props;
        if (checkoutStep === DETAILS_STEP) {
            return null
        }
        return (
            <ul block="Checkout" elem="Tabs">
                {Object.keys(this.stepMap).map((step, index) =>
                    (index < 3 &&
                        <li
                            block="Checkout"
                            elem="TabsTitle"
                            key={index}
                            onClick={() => setCheckoutStep(step)}
                            className={step === checkoutStep ? 'current' : ''}>
                            {this.stepMap[step].title}
                        </li>
                    ))
                }
            </ul>
        );
    }

    renderUserDataStep() {
        const {
            setUserData,
            firstStepData
        } = this.props;
        return (
            <CheckoutUserDataStep
                setUserData={setUserData}
                firstStepData={firstStepData}
            />
        )
    }

    renderShippingStep() {
        const {
            shippingMethods,
            onShippingEstimationFieldsChange,
            saveAddressInformation,
            isDeliveryOptionsLoading,
            firstStepData,
            setCheckoutStep
        } = this.props;

        return (
            <CheckoutShipping
                isLoading={isDeliveryOptionsLoading}
                shippingMethods={shippingMethods}
                setCheckoutStep={setCheckoutStep}
                firstStepData={firstStepData}
                saveAddressInformation={saveAddressInformation}
                onShippingEstimationFieldsChange={onShippingEstimationFieldsChange}
            />
        );
    }

    renderBillingStep() {
        const {
            paymentMethods = [],
            shippingAddress,
            savePaymentInformation,
            setCheckoutStep,
            checkoutTotals
        } = this.props;

        return (
            <CheckoutBilling
                paymentMethods={paymentMethods}
                checkoutTotals={checkoutTotals}
                shippingAddress={shippingAddress}
                setCheckoutStep={setCheckoutStep}
                savePaymentInformation={savePaymentInformation}
            />
        );
    }

    renderDetailsStep() {
        const {orderID} = this.props;

        return (
            <div block="Checkout" elem="Success">
                <p>{__("Thank you for your purchase!")}</p>
                <p>{__('Payment was successful')}</p>
                {/*<a*/}
                {/*    block="Button"*/}
                {/*    mix={{block: 'Checkout', elem: 'ContinueButton'}}*/}
                {/*    href="/"*/}
                {/*>*/}
                {/*    {__('Continue shopping')}*/}
                {/*</a>*/}
            </div>
        );
    }

    renderStep() {
        const {checkoutStep} = this.props;
        const {render} = this.stepMap[checkoutStep];
        if (render) return render();
        return null;
    }

    renderLoader() {
        const {isLoading} = this.props;
        return <Loader isLoading={isLoading || false}/>;
    }

    renderSummary() {
        const {checkoutTotals, checkoutStep} = this.props;
        const {areTotalsVisible} = this.stepMap[checkoutStep];

        if (!areTotalsVisible) return null;

        return (
            <CheckoutOrderSummary totals={checkoutTotals}/>
        );
    }

    render() {
        const {checkoutStep, checkoutTotals: {items_qty}} = this.props;
        return (
            <main block="Checkout" aria-label="Checkout Page">
                <Meta metaObject={{title: 'Checkout'}}/>
                <ContentWrapper
                    mix={{block: 'Checkout'}}
                    wrapperMix={{block: 'Checkout', elem: 'Wrapper'}}
                    label={__('Checkout page')}
                >
                    {checkoutStep === DETAILS_STEP ? null :
                        <h2 block="Checkout" elem="Heading" className="page-title">
                            {__('Checkout')}
                            <div block="Checkout" elem="HeadCounter">{`${items_qty} ${__('Products')}`}</div>
                        </h2>}
                        <div block="Checkout" elem={`Content${checkoutStep === DETAILS_STEP ? '-S' : ''}`}>
                        <div block="Checkout" elem="Step" mods={{step: this.props.checkoutStep}}>
                            {this.renderTitle()}
                            {this.renderStep()}
                            {this.renderLoader()}
                        </div>
                        {this.renderSummary()}
                    </div>
                </ContentWrapper>
            </main>
        );
    }
}

export default Checkout;
