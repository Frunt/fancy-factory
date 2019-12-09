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
import Field from 'Component/Field';
import ProductCard from 'Component/ProductCard';
import {ProductType, FilterType} from 'Type/ProductList';

import './WishlistItem.style';

export default class WishlistItem extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        isLoading: PropTypes.bool
    };

    static defaultProps = {
        isLoading: false
    };

    render() {
        const {product, isLoading} = this.props;
        return (
            <ProductCard
                product={product}
                mix={{block: 'WishlistItem'}}
                isLoading={isLoading}
                isWishListItem
            />
        );
    }
}
