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

import {orderType} from 'Type/Account';
import Loader from 'Component/Loader';
import MyAccountAddressTable from 'Component/MyAccountAddressTable';
import {formatCurrency} from 'Util/Price';

import './MyAccountOrderPopup.style';
import {LiqpayComponent} from "Modules/Liqpay";
import ProductCard from "Component/ProductCard";

export const ORDER_POPUP_ID = 'MyAccountOrderPopup';

class MyAccountOrderPopup extends PureComponent {
    static propTypes = {
        order: orderType.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderBaseInfo() {
        const {order: {base_order_info, shipping_info}} = this.props;
        const {status_label, created_at, increment_id} = base_order_info || {};
        const {delivery_date} = shipping_info || {};

        return (
            <div block="MyAccountOrderTableRow">
                <h5 block="MyAccountOrderTableRow" elem="Heading"
                    mods={{status: status_label.replace(/ /g, '_')}}>{status_label}</h5>
                <div block="MyAccountOrderTableRow" elem="Info">
                    <div block="MyAccountOrderTableRow" elem="InfoItem">
                        <h5 className="subtitle-light">{__('Order number')}</h5>
                        {increment_id ? `${increment_id}` : ''}
                    </div>
                    <div block="MyAccountOrderTableRow" elem="InfoItem">
                        <h5 className="subtitle-light">{__('Order date')}</h5>
                        {created_at}
                    </div>
                    <div block="MyAccountOrderTableRow" elem="InfoItem">
                        <h5 className="subtitle-light">{__('Delivery date')}</h5>
                        {delivery_date}
                    </div>
                </div>
            </div>
        );
    }

    renderPayment() {
        const {order: {payment_info}} = this.props;
        const {additional_information: {method_title} = {}} = payment_info || {};

        return (
            <div block="MyAccountOrderPopup" elem="Payment">
                <h4 className="page-title">{__('Payment method')}</h4>
                <p block="MyAccountOrderPopup" elem="PaymentMethod">{method_title}</p>
            </div>
        );
    }

    renderShippingAddressTable() {
        const {order: {shipping_info: {shipping_address}}} = this.props;

        return (
            <MyAccountAddressTable
                title={__('Shipping address')}
                address={shipping_address}
                mix={{block: 'MyAccountOrderPopup', elem: 'Address'}}
            />
        );
    }

    renderShipping() {
        const {order: {shipping_info}} = this.props;

        const {
            shipping_description,
            shipping_address,
            delivery_date
        } = shipping_info || {};

        const {
            firstname,
            lastname,
            city,
            street,
            postcode,
            telephone
        } =  shipping_address || {};

        if (!shipping_address) return null;

        return (
            <div block="MyAccountOrderPopup" elem="ShippingWrapper">
                <h4 className="page-title">{__('Delivery Data')}</h4>
                <div block="MyAccountOrderPopup" elem="ShippingItem">
                    <h5 className="subtitle-light">{__('Delivery address:')}</h5>
                    <span>
                        {firstname} {lastname},<br/>
                        {street},<br/>
                        {city}, {postcode},<br/>
                        {telephone}
                    </span>
                </div>
                <div block="MyAccountOrderPopup" elem="ShippingItem">
                    <h5 className="subtitle-light">{__('Delivery Date')}:</h5>
                    <span>{delivery_date}</span>
                </div>
                <div block="MyAccountOrderPopup" elem="ShippingItem">
                    <h5 className="subtitle-light">{__('Delivery Method:')}</h5>
                    <span>{shipping_description}</span>
                </div>
                {/*{this.renderShippingAddressTable()}*/}
            </div>
        );
    }

    renderItems() {
        const {order: {order_products = []}} = this.props;

        return <>
            <h3 className="page-title">{order_products.length + ' ' + __('products')}</h3>
            <div block="MyAccountMyWishlist" elem="Products">
                {order_products.map((product, i) => <ProductCard
                    key={i}
                    isOrderItem={true}
                    product={product}
                />)}
            </div>
        </>;
    }

    renderProducts() {
        return (
            <div block="MyAccountOrderPopup" elem="ProductsWrapper">
                {this.renderItems()}
            </div>
        );
    }

    renderTotals() {
        const {order: {base_order_info, shipping_info}} = this.props;
        const {grand_total, sub_total} = base_order_info || {};
        const {shipping_amount} = shipping_info || 0;

        return (
            <div block="MyAccountOrderPopup" elem="Totals">
                <h4 className="page-title">{__('Product Amount')}</h4>
                <div className="row">
                    <span className="rowTitle subtitle-light">{__('Amount')}</span>
                    <span className="rowValue">{sub_total}{formatCurrency()}</span>
                </div>
                <div className="row">
                    <span className="rowTitle subtitle-light">{__('Shipping')}</span>
                    <span className="rowValue">{shipping_amount}{formatCurrency()}</span>
                </div>
                <div className="row">
                    <span className="rowTitle subtitle-light">{__('Total amount')}</span>
                    <span className="rowValue grandTotal">{grand_total}{formatCurrency()}</span>
                </div>
            </div>
        );
    }

    renderPayOrder() {
        if (!this.props.order.payment_info) return null;
        const {order: {payment_info: {method}, base_order_info}} = this.props;
        if (method === 'wise_liqpay' && base_order_info.status_label === 'Pending') {
            return <LiqpayComponent
                checkoutTotals={base_order_info}
                mode={'popup'}
                submit={(data) => console.log(data)}
            />
        } else {
            return null
        }
    }

    renderContent() {
        const {order: {order_products}} = this.props;

        if (!order_products) return null;

        return (
            <>
                {this.renderBaseInfo()}
                {this.renderProducts()}
                {this.renderShipping()}
                {this.renderPayment()}
                {this.renderTotals()}
                {this.renderPayOrder()}
            </>
        );
    }

    render() {
        const {isLoading} = this.props;

        return (
            <div block="MyAccountOrderPopup">
                <Loader isLoading={isLoading}/>
                {this.renderContent()}
            </div>
        );
    }
}

export default MyAccountOrderPopup;
