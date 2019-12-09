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

/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
// Disabled due placeholder needs

import {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {ProductType} from 'Type/ProductList';

import './ProductCardActions.style';
import ProductPageConfigurableAttributesComponent
    from "Component/ProductConfigurableAttributes/ProductPageConfigurableAttributes.component";
import ProductDetailsRender from "Component/ProductDetailsRender";

/**
 * Product actions
 * @class ProductActions
 */
export default class ProductCardActions extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        configurableVariantIndex: PropTypes.number,
        showOnlyIfLoaded: PropTypes.func.isRequired,
        quantity: PropTypes.number.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired,
        updateConfigurableVariant: PropTypes.func.isRequired,
        parameters: PropTypes.objectOf(PropTypes.string).isRequired,
        getIsConfigurableAttributeAvailable: PropTypes.func.isRequired
    };

    static defaultProps = {
        isProductPage: false,
        configurableVariantIndex: 0
    };

    renderConfigurableAttributes() {
        const {
            updateConfigurableVariant,
            parameters,
            areDetailsLoaded,
            product: {configurable_options, type_id},
            getIsConfigurableAttributeAvailable,
            isProductCard
        } = this.props;

        if (type_id !== 'configurable') return null;

        return (
            <ProductPageConfigurableAttributesComponent
                numberOfPlaceholders={[2, 4]}
                mix={{block: 'ProductCardActions', elem: 'Attributes'}}
                isReady={areDetailsLoaded}
                getLink={() => ''}
                isProductCard={isProductCard}
                parameters={parameters}
                updateConfigurableVariant={updateConfigurableVariant}
                configurable_options={configurable_options}
                getIsConfigurableAttributeAvailable={getIsConfigurableAttributeAvailable}
            />
        );
    }

    renderProductDetails() {
        const {product, areDetailsLoaded} = this.props;
        return <ProductDetailsRender product={product} loaded={areDetailsLoaded}/>
    }

    render() {
        return (
            <article block="ProductCardActions">
                <h5 className="subtitle">{__('Characteristic')}</h5>
                {this.renderProductDetails()}
                {this.renderConfigurableAttributes()}
            </article>
        );
    }
}
