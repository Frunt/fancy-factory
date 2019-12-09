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
import {TotalsType} from 'Type/MiniCart';
import {formatCurrency, roundPrice} from 'Util/Price';
import './CheckoutOrderSummary.style';
import {CheckoutCartItem} from "Component/CheckoutOrderSummary/CartItem";
import CartCoupon from "Component/CartCoupon";
import ExpandableContent from "Component/ExpandableContent";

/**
 * Checkout Order Summary component
 */
export default class CheckoutOrderSummary extends PureComponent {

    static propTypes = {
        totals: TotalsType
    };

    static defaultProps = {
        totals: {}
    };


    renderPriceLine(price, name, mods) {
        if (!price) return null;

        const {totals: {base_currency_code}} = this.props;
        const priceString = formatCurrency(base_currency_code);

        return (
            <li block="CheckoutOrderSummary" elem="SummaryItem" mods={mods}>
                <span block="CheckoutOrderSummary" elem="Text">
                    {name}
                </span>
                <span block="CheckoutOrderSummary" elem="Text">
                    {`${roundPrice(price)}${priceString}`}
                </span>
            </li>
        );
    }

    renderItem = (item) => {
        const {
            totals: {
                base_currency_code
            }
        } = this.props;

        const {item_id} = item;

        return (
            <CheckoutCartItem
                key={item_id}
                item={item}
                currency_code={base_currency_code}
            />
        );
    };

    renderCouponCode() {
        const {
            totals: {
                discount_amount,
                coupon_code
            }
        } = this.props;

        if (!coupon_code) return null;

        return this.renderPriceLine(
            -Math.abs(discount_amount),
            __('Coupon %s:', coupon_code.toUpperCase())
        );
    }

    renderItems() {
        const {totals: {items = []}} = this.props;

        return (
            <div block="CheckoutOrderSummary" elem="OrderItems">
                <ul block="CheckoutOrderSummary" elem="CartItemList">
                    {items.map(this.renderItem)}
                </ul>
            </div>
        );
    }

    renderHeading() {
        const {totals: {items_qty}} = this.props;

        return (
            <h3
                block="CheckoutOrderSummary"
                elem="Header"
                mix={{block: 'CheckoutPage', elem: 'Heading', mods: {hasDivider: true}}}
            >
                <span>{__('Products')}</span>
                <p block="CheckoutOrderSummary" elem="ItemsInCart">{items_qty}</p>
            </h3>
        );
    }

    renderDiscountCode() {
        const {
            totals: {coupon_code}
        } = this.props;

        return (
            <div
                block="CartPage"
                elem="DiscountCoupon"
            >
                <CartCoupon couponCode={coupon_code}/>
            </div>

        );
    }

    renderTotals() {
        const {
            totals: {
                subtotal,
                tax_amount,
                grand_total,
                shipping_amount
            }
        } = this.props;

        return (
            <div block="CheckoutOrderSummary" elem="OrderTotals">
                <ul>
                    {this.renderPriceLine(shipping_amount, __('Shipping'), {divider: true})}
                    {this.renderPriceLine(subtotal, __('Cart Subtotal'))}
                    {this.renderCouponCode()}
                    {this.renderPriceLine(tax_amount, __('Tax'))}
                    {this.renderPriceLine(grand_total, __('Order Total'))}
                </ul>
            </div>
        );
    }

    render() {

        return (
            <article block="CheckoutOrderSummary" aria-label="Order Summary">
                {this.renderHeading()}
                {this.renderItems()}
                <ExpandableContent
                    isContentExpanded={false}
                    closeOnClick={true}
                    heading={__('Have a promo code?')}
                >
                    {this.renderDiscountCode()}
                </ExpandableContent>
                {this.renderTotals()}
            </article>
        );
    }
}
