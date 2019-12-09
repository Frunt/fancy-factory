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

import { Component } from 'react';
import Link from 'Component/Link';
import PropTypes from 'prop-types';
import ContentWrapper from 'Component/ContentWrapper';
import CartItem from 'Component/CartItem';
import CartCoupon from 'Component/CartCoupon';
import { TotalsType } from 'Type/MiniCart';
import isMobile from 'Util/Mobile';
import ExpandableContent from 'Component/ExpandableContent';
import { formatCurrency, roundPrice } from 'Util/Price';
import Meta from 'Component/Meta';

import './CartPage.style';

export default class CartPage extends Component {
    static propTypes = {
        isEditing: PropTypes.bool.isRequired,
        totals: TotalsType.isRequired
    };

    renderHeading() {
        const {totals: {items_qty}} = this.props;

        return (
          <div block="CartPage" elem="Top" >
              <h2 block="CartPage" elem="Heading" className="page-title">{ __('Shopping cart') }</h2>
              <span block="CartPage" elem="Heading" mods={{type: 'quantity'}}>{`${items_qty} ${__('products').toUpperCase()}`}</span>
          </div>

        )
    }

    renderCartItems() {
        const { isEditing, totals: { items, base_currency_code } } = this.props;

        if (!items || items.length < 1) {
            return (
                <p block="CartPage" elem="Empty">{ __('There are no products in cart.') }</p>
            );
        }

        return (
            <>
                <div block="CartPage" elem="TableHead" aria-hidden>
                    <span>{ __('Name') }</span>
                    <span>{ __('Cost') }</span>
                    <span>{ __('Quantity') }</span>
                </div>
                <ul block="CartPage" elem="Items" aria-label="List of items in cart">
                    { items.map(item => (
                        <CartItem
                          key={ item.item_id }
                          item={ item }
                          currency_code={ base_currency_code }
                          isEditing={ !isMobile.any() || isEditing }
                          isLikeTable
                        />
                    )) }
                </ul>
            </>
        );
    }

    renderDiscountCode() {
        const {
            totals: { coupon_code }
        } = this.props;

        return (
          <div
            block="CartPage"
            elem="DiscountCoupon"
          >
              <CartCoupon couponCode={ coupon_code } />
          </div>

        );
    }

    renderPriceLine(price) {
        const { totals: { base_currency_code } } = this.props;
        return `${formatCurrency(base_currency_code)}${roundPrice(price)}`;
    }

    renderTotals() {
        const {
            totals: {
                grand_total = 0,
                subtotal = 0,
                tax_amount = 0,
                items
            }
        } = this.props;

        const props = !items || items.length < 1
            ? {
                onClick: e => e.preventDefault(),
                disabled: true
            }
            : {};

        return (
            <article block="CartPage" elem="Summary">
                <dl block="CartPage" elem="Total" aria-label="Complete order total">
                    <dt>{ __('Total sum:') }</dt>
                    <dd>{ this.renderPriceLine(grand_total) }</dd>
                </dl>
                <Link
                  block="CartPage"
                  elem="CheckoutButton"
                  mix={ { block: 'Button' } }
                  to="/checkout"
                  { ...props }
                >
                    <span />
                    { __('To checkout') }
                </Link>
            </article>
        );
    }

    render() {
        return (
            <main block="CartPage" aria-label="Cart Page">
                <Meta metaObject={ { title: 'Cart' } } />
                <ContentWrapper
                  mix={ { block: 'CartPage' } }
                  wrapperMix={ { block: 'CartPage', elem: 'Wrapper' } }
                  label="Cart page details"
                >
                    { this.renderHeading() }
                    { this.renderCartItems() }
                    <div
                      block="CartPage"
                      elem="Bottom"
                    >
                      { this.renderDiscountCode() }
                      { this.renderTotals() }
                    </div>
                </ContentWrapper>
            </main>
        );
    }
}
