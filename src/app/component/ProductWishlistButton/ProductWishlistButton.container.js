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
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {showNotification} from 'Store/Notification';
import {WishlistDispatcher} from 'Store/Wishlist';
import {ProductType} from 'Type/ProductList';
import ProductWishlistButton from './ProductWishlistButton.component';

export const mapStateToProps = state => ({
    productsInWishlist: state.WishlistReducer.productsInWishlist,
    isSignedIn: state.MyAccountReducer.isSignedIn,
    isLoading: state.WishlistReducer.isLoading
});

export const mapDispatchToProps = dispatch => ({
    addProductToWishlist: wishlistItem => WishlistDispatcher.addItemToWishlist(dispatch, wishlistItem),
    removeProductFromWishlist: options => WishlistDispatcher.removeItemFromWishlist(dispatch, options),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

export const ERROR_CONFIGURABLE_NOT_PROVIDED = 'ERROR_CONFIGURABLE_NOT_PROVIDED';

export class ProductWishlistButtonContainer extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        isLoading: PropTypes.bool.isRequired,
        showNotification: PropTypes.func.isRequired,
        productsInWishlist: PropTypes.objectOf(ProductType).isRequired,
        addProductToWishlist: PropTypes.func.isRequired,
        removeProductFromWishlist: PropTypes.func.isRequired
    };

    containerProps = () => ({
        isDisabled: this.isDisabled(),
        isInWishlist: this.isInWishlist(),
        isReady: true
    });

    containerFunctions = () => ({
        addToWishlist: this.toggleProductInWishlist.bind(this, true),
        removeFromWishlist: this.toggleProductInWishlist.bind(this, false)
    });

    toggleProductInWishlist = (add = true) => {
        const {
            product: {sku},
            showNotification,
            productsInWishlist,
            addProductToWishlist,
            removeProductFromWishlist,
            product,
            isSignedIn
        } = this.props;

        if (!isSignedIn) {
            return showNotification('error', __('You must login or register to add items to your wishlist.'));
        }


        const {sku: variantSku, id} = product;
        if (add) return addProductToWishlist({sku, item_id: id});
        const {wishlist: {id: item_id}} = Object.values(productsInWishlist).find(
            (item) => item.sku === variantSku
        );
        return removeProductFromWishlist({item_id});
    };

    isDisabled = () => {
        const {isSignedIn} = this.props;
        return !isSignedIn;
    };

    isInWishlist = () => {
        const {productsInWishlist, product} = this.props;

        const {sku: productSku} = product;
        return Object.values(productsInWishlist).findIndex(({sku}) => sku === productSku) >= 0;
    };

    render() {
        return (
            <ProductWishlistButton
                {...this.props}
                {...this.containerProps()}
                {...this.containerFunctions()}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductWishlistButtonContainer);
