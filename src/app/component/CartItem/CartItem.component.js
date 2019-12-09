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

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'Component/Link';
import Image from 'Component/Image';
import Field from 'Component/Field';
import CartItemPrice from 'Component/CartItemPrice';
import Loader from 'Component/Loader';
import { CartItemType } from 'Type/MiniCart';
import './CartItem.style';
import {formatCurrency} from "Util/Price";

/**
 * Cart and CartOverlay item
 * @class CartItem
 */
export default class CartItem extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool,
        item: CartItemType.isRequired,
        currency_code: PropTypes.string.isRequired,
        isEditing: PropTypes.bool,
        isLikeTable: PropTypes.bool,
        handleRemoveItem: PropTypes.func,
        handleChangeQuantity: PropTypes.func,
        getCurrentProduct: PropTypes.func,
        linkTo: PropTypes.oneOfType([
            PropTypes.shape({
                pathname: PropTypes.string,
                search: PropTypes.string
            }),
            PropTypes.string
        ]),
        thumbnail: PropTypes.string.isRequired
    };

    static defaultProps = {
        isEditing: false,
        isLikeTable: false
    };

    renderContent() {
        const {
            linkTo,
            item: {
                product: {
                    name
                }
            }
        } = this.props;

        return (
            <Link to={ linkTo } block="CartItem" elem="Link">
                <figure
                  block="CartItem"
                  elem="Content"
                >
                    { this.renderImage() }
                    <figcaption
                        block="CartItem"
                        elem="Description"
                    >
                        <p
                          block="CartItem"
                          elem="Heading"
                          itemProp="name"
                        >
                            { name }
                        </p>
                        {/*{ this.renderProductDetails() }*/}
                    </figcaption>
                </figure>
            </Link>
        );
    }

    renderImage() {
        const { item: { product: { name } }, thumbnail } = this.props;
        const fullImageUrl = `${process.env.API_URL}${thumbnail}`;

        return (
            <div
                block="CartItem"
                elem="PictureWrapper"
            >
                <Image
                  src={ fullImageUrl }
                  mix={ {
                      block: 'CartItem',
                      elem: 'Picture'
                  } }
                  ratio="custom"
                  alt={ `Product ${name} thumbnail.` }
                />
                <img
                  style={ { display: 'none' } }
                  alt={ name }
                  src={ fullImageUrl }
                  itemProp="image"
                />
            </div>
        );
    }

    renderDeleteBtn() {
        const {handleRemoveItem} = this.props;

        return (
          <button
            block="CartItem"
            id="RemoveItem"
            name="RemoveItem"
            elem="Delete"
            aria-label="Remove item from cart"
            onClick={ handleRemoveItem }
          />
        )
    }

    renderQty() {
        const {
            item: { qty },
            handleChangeQuantity
        } = this.props;

        return (
          <div
            block="CartItem"
            elem="QtyWrapper"
          >
              <Field
                id="item_qty"
                name="item_qty"
                type="number"
                min={ 1 }
                mix={ { block: 'CartItem', elem: 'Qty' } }
                value={ qty }
                onChange={ handleChangeQuantity }
              />
          </div>
        )
    }

    renderCost() {
        const {item: {price}, currency_code} = this.props;
        return (
          <div block="CartItem" elem="Cost" >{ `${price}${formatCurrency(currency_code)}` }</div>
        )
    }

    renderPriceTotal() {
        const {
            currency_code,
            item: {
                row_total
            }
        } = this.props;

        return (
          <CartItemPrice
            row_total={ row_total }
            currency_code={ currency_code }
            mix={ {
                block: 'CartItem',
                elem: 'PriceTotal'
            } }
          />
        )
    }

    render() {
        const { isLoading } = this.props;

        return (
            <li
              block="CartItem"
              itemScope
              itemType="https://schema.org/Product"
            >
                <Loader isLoading={ isLoading } />
                {this.renderDeleteBtn()}
                {this.renderContent()}
                {this.renderCost()}
                {this.renderQty()}
                {this.renderPriceTotal()}
            </li>
        );
    }
}
