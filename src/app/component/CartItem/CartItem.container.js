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

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {PureComponent} from 'react';
import {CartDispatcher} from 'Store/Cart';
import {makeCancelable} from 'Util/Promise';
import {objectToUri} from 'Util/Url';
import {CartItemType} from 'Type/MiniCart';
import CartItem from './CartItem.component';

export const mapDispatchToProps = dispatch => ({
    addProduct: options => CartDispatcher.addProductToCart(dispatch, options),
    changeItemQty: options => CartDispatcher.changeItemQty(dispatch, options),
    removeProduct: options => CartDispatcher.removeProductFromCart(dispatch, options)
});

export class CartItemContainer extends PureComponent {
    static propTypes = {
        item: CartItemType.isRequired,
        currency_code: PropTypes.string.isRequired,
        changeItemQty: PropTypes.func.isRequired,
        removeProduct: PropTypes.func.isRequired
    };

    state = {isLoading: false};

    handlers = [];

    setStateNotLoading = this.setStateNotLoading.bind(this);

    containerFunctions = {
        handleChangeQuantity: this.handleChangeQuantity.bind(this),
        handleRemoveItem: this.handleRemoveItem.bind(this),
        getCurrentProduct: this.getCurrentProduct.bind(this)
    };

    componentWillUnmount() {
        if (this.handlers.length) [].forEach.call(this.handlers, cancelablePromise => cancelablePromise.cancel());
    }

    /**
     * @returns {Product}
     */
    getCurrentProduct() {
        const {item: {product}} = this.props;
        const variantIndex = this._getVariantIndex();

        return variantIndex < 0
            ? product
            : product.variants[variantIndex];
    }

    setStateNotLoading() {
        this.setState({isLoading: false});
    }

    containerProps = () => ({
        thumbnail: this._getProductThumbnail(),
        linkTo: this._getProductLinkTo()
    });

    /**
     * Handle item quantity change. Check that value is <1
     * @param {Number} value new quantity
     * @return {void}
     */
    handleChangeQuantity(quantity) {
        this.setState({isLoading: true}, () => {
            const {changeItemQty, item: {item_id, sku}} = this.props;
            this.hideLoaderAfterPromise(changeItemQty({item_id, quantity, sku}));
        });
    }

    /**
     * @return {void}
     */
    handleRemoveItem() {
        this.setState({isLoading: true}, () => {
            const {removeProduct, item: {item_id}} = this.props;
            this.hideLoaderAfterPromise(removeProduct(item_id));
        });
    }

    /**
     * @param {Promise}
     * @returns {cancelablePromise}
     */
    registerCancelablePromise(promise) {
        const cancelablePromise = makeCancelable(promise);
        this.handlers.push(cancelablePromise);
        return cancelablePromise;
    }

    /**
     * @param {Promise} promise
     * @returns {void}
     */
    hideLoaderAfterPromise(promise) {
        this.registerCancelablePromise(promise)
            .promise.then(this.setStateNotLoading, this.setStateNotLoading);
    }

    /**
     * @returns {Int}
     */
    _getVariantIndex() {
        const {
            item: {
                sku: itemSku,
                product: {variants = []}
            }
        } = this.props;

        return variants.findIndex(({sku}) => sku === itemSku);
    }

    /**
     * Get link to product page
     * @param url_key Url to product
     * @return {{pathname: Srting, state Object}} Pathname and product state
     */
    _getProductLinkTo() {
        const {
            item: {
                product,
                product: {
                    type_id,
                    configurable_options,
                    parent,
                    variants = [],
                    url_rewrites,
                }
            }
        } = this.props;
        const url_key = url_rewrites ? url_rewrites[0].url : null;
        if (type_id !== 'configurable') return {pathname: `/${url_key}`};

        const variant = variants[this._getVariantIndex()];
        if (!variant) return {pathname: `/${url_key}`};
        const {attributes} = variant;

        const parameters = Object.entries(attributes).reduce(
            (parameters, [code, {attribute_value}]) => {
                if (Object.keys(configurable_options).includes(code)) return {...parameters, [code]: attribute_value};
                return parameters;
            }, {}
        );

        return {
            pathname: `/${url_key}`,
            state: {product: parent || product},
            search: objectToUri(parameters)
        };
    }

    _getProductThumbnail() {
        const product = this.getCurrentProduct();
        const {thumbnail: {path: thumbnail} = {}} = product;

        return thumbnail
            ? `/media/catalog/product${thumbnail}`
            : '';
    }

    render() {
        return (
            <CartItem
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
                {...this.containerProps()}
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(CartItemContainer);
