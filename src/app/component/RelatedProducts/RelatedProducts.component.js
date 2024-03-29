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
import ContentWrapper from 'Component/ContentWrapper';
import ProductCard from 'Component/ProductCard';
import PropTypes from 'prop-types';
import {ItemsType} from 'Type/ProductList';
import './RelatedProducts.style';

export const MAX_NUMBER_OF_PRODUCTS_TO_RENDER = 4;

/**
 * Related products block
 * @class RelatedProducts
 */
export default class RelatedProducts extends PureComponent {
    static propTypes = {
        relatedProducts: PropTypes.shape({
            items: ItemsType,
            total_count: PropTypes.number
        }).isRequired,
        product: PropTypes.shape({
            items: ItemsType,
            total_count: PropTypes.number
        }).isRequired,
        linkType: PropTypes.oneOf([
            'upsell',
            'related'
        ]).isRequired,
        clearRelatedProducts: PropTypes.func.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired,
        label: PropTypes.string
    };

    static defaultProps = {
        label: '',
        linkType: 'related'
    };

    componentDidMount() {
        this.clearRelatedProducts();
    }

    componentDidUpdate() {
        this.clearRelatedProducts();
    }

    /**
     * Clears related products store
     * @return {void}
     */
    clearRelatedProducts() {
        const {
            relatedProducts: {items},
            areDetailsLoaded,
            clearRelatedProducts
        } = this.props;

        if (!areDetailsLoaded && typeof items === 'object' && items.length > 0) {
            clearRelatedProducts();
        }
    }

    getSkuArrayByType() {
        const {linkType, product: {product_links}} = this.props;
        const arr = [];
        (product_links || []).forEach(a => a.link_type === linkType ? arr.push(a.linked_product_sku) : null);
        return arr;
    }

    renderProducts(products) {
        return products.filter(ss => this.getSkuArrayByType().indexOf(ss.sku) !== -1).slice(0, MAX_NUMBER_OF_PRODUCTS_TO_RENDER).map(product => (
            <ProductCard
                product={product}
                key={product.id}
            />
        ));
    }

    renderPlaceholder() {
        return (
            <>
                <ProductCard product={{}}/>
                <ProductCard product={{}}/>
                <ProductCard product={{}}/>
                <ProductCard product={{}}/>
            </>
        );
    }

    render() {
        const {
            relatedProducts: {
                items,
                total_count
            },
            product,
            label,
            linkType,
            areDetailsLoaded
        } = this.props;

        const hasRelatedProducts = product.product_links && Object.keys(product.product_links).length > 0;
        const relatedProductsLoaded = typeof items === 'object';

        if (areDetailsLoaded && (!hasRelatedProducts || (relatedProductsLoaded && total_count === 0))) return null;

        return (
            <ContentWrapper
                label="Related products"
                mix={{block: 'RelatedProducts ' + linkType}}
                wrapperMix={{block: 'RelatedProducts', elem: 'Wrapper'}}
            >
                {label && <h2 block="RelatedProducts" elem="Label">{label}</h2>}
                <ul block="RelatedProducts" elem="List">
                    {items ? this.renderProducts(items) : this.renderPlaceholder()}
                </ul>
            </ContentWrapper>
        );
    }
}
