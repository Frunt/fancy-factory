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
import { connect } from 'react-redux';
import { debounce } from 'Util/Request';
import { CartDispatcher } from 'Store/Cart';
import { ProductType } from 'Type/ProductList';
import { WishlistDispatcher } from 'Store/Wishlist';
import { showNotification } from 'Store/Notification';
import WishlistItem from './WishlistItem.component';

export const UPDATE_WISHLIST_FREQUENCY = 1000; // (ms)

export const mapDispatchToProps = dispatch => ({
    showNotification: (type, message) => dispatch(showNotification(type, __(message))),
});

export class WishlistItemContainer extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        showNotification: PropTypes.func.isRequired,
    };

    state = {
        isLoading: false
    };

    containerProps = () => {
        const { isLoading } = this.state;

        return {
            isLoading
        };
    };


    showNotification(...args) {
        const { showNotification } = this.props;
        this.setState({ isLoading: false });
        showNotification(...args);
    }

    render() {
        return (
            <WishlistItem
              { ...this.props }
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(WishlistItemContainer);
