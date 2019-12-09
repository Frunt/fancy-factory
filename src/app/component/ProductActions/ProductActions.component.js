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
import Field from 'Component/Field';
import ProductConfigurableAttributes from 'Component/ProductConfigurableAttributes';
import ProductWishlistButton from 'Component/ProductWishlistButton';
import TextPlaceholder from 'Component/TextPlaceholder';
import ProductPrice from 'Component/ProductPrice';
import AddToCart from 'Component/AddToCart';
import Html from 'Component/Html';

import './ProductActions.style';
import ProductPageConfigurableAttributesComponent
    from "Component/ProductConfigurableAttributes/ProductPageConfigurableAttributes.component";
import ProductDetailsRender from "Component/ProductDetailsRender";
import ExpandableContent from "Component/ExpandableContent";
import ProductReviewRating from "Component/ProductReviewRating";
import ProductCustomizableOptions from "Component/ProductCustomizableOptions";

/**
 * Product actions
 * @class ProductActions
 */
export default class ProductActions extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        configurableVariantIndex: PropTypes.number,
        showOnlyIfLoaded: PropTypes.func.isRequired,
        quantity: PropTypes.number.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired,
        getLink: PropTypes.func.isRequired,
        setQuantity: PropTypes.func.isRequired,
        updateConfigurableVariant: PropTypes.func.isRequired,
        parameters: PropTypes.objectOf(PropTypes.string).isRequired,
        getIsConfigurableAttributeAvailable: PropTypes.func.isRequired
    };

    static defaultProps = {
        isProductPage: false,
        configurableVariantIndex: 0
    };

    state = {
        showFullDescription: false
    };

    renderConfigurableAttributes() {
        const {
            getLink,
            updateConfigurableVariant,
            parameters,
            areDetailsLoaded,
            product: {configurable_options, type_id},
            getIsConfigurableAttributeAvailable,
            isProductPage,
            isProductCard
        } = this.props;

        if (type_id !== 'configurable') return null;

        return (
            isProductPage ?
                <ProductPageConfigurableAttributesComponent
                    // eslint-disable-next-line no-magic-numbers
                    numberOfPlaceholders={[2, 4]}
                    mix={{block: 'ProductActions', elem: 'Attributes'}}
                    isReady={areDetailsLoaded}
                    getLink={getLink}
                    isProductCard={isProductCard}
                    parameters={parameters}
                    updateConfigurableVariant={updateConfigurableVariant}
                    configurable_options={configurable_options}
                    getIsConfigurableAttributeAvailable={getIsConfigurableAttributeAvailable}
                    isContentExpanded
                />
                : <ProductConfigurableAttributes
                    // eslint-disable-next-line no-magic-numbers
                    numberOfPlaceholders={[2, 4]}
                    mix={{block: 'ProductActions', elem: 'Attributes'}}
                    isReady={areDetailsLoaded}
                    getLink={getLink}
                    parameters={parameters}
                    updateConfigurableVariant={updateConfigurableVariant}
                    configurable_options={configurable_options}
                    getIsConfigurableAttributeAvailable={getIsConfigurableAttributeAvailable}
                    isContentExpanded
                />
        );
    }

    renderCustomizableOptions() {
        const {product: {options}, setCustomizableOptions, customizable_options} = this.props;
        return <ProductCustomizableOptions
            options={options}
            customizable_options={customizable_options}
            setCustomizableOptions={setCustomizableOptions}
        />
    };

    renderShortDescription() {
        const {product: {short_description, description, id}} = this.props;
        const {showFullDescription} = this.state;
        const {html} = short_description || {};
        const {html: htmlFull} = description || {};
        const htmlWithItemProp = `<div itemProp="description">${showFullDescription ? htmlFull : html}</div>`;

        if (!html && id && !htmlFull) return null;

        return (
            <section
                block="ProductActions"
                elem="Section"
                mods={{type: 'short'}}
                aria-label="Product short description"
            >
                <div block="ProductActions" elem="ShortDescription">
                    {html ? <Html content={htmlWithItemProp}/> : <p><TextPlaceholder length="long"/></p>}
                </div>
                {htmlFull && <div
                    onClick={() =>
                        this.setState({showFullDescription: !showFullDescription})}
                    className="button-text"
                >
                    {showFullDescription ? __('Hide') : __('See all')}
                </div>}
            </section>
        );
    }

    renderReviewListRating() {
        const {product: {review_summary}} = this.props;
        return (
            <div
                block="ProductReviewList"
                elem="RatingSummaryItem"
            >
                {(review_summary)
                    ? <ProductReviewRating summary={review_summary.rating_summary} code={'Rate the product'}/>
                    : <ProductReviewRating placeholder/>}
            </div>
        );
    }

    renderNameAndBrand() {
        const {product: {name}} = this.props;

        return (
            <section
                block="ProductActions"
                elem="Section"
                mods={{type: 'name'}}
            >
                <p block="ProductActions" elem="Title" itemProp="name">
                    <TextPlaceholder content={name} length="medium"/>
                </p>
                {this.renderReviewListRating()}
            </section>
        );
    }

    renderQuantityInput() {
        const {quantity, setQuantity} = this.props;

        return (
            <div>
                <span block="ProductActions" elem="QtyTitle">{__('Quantity')}</span>
                <Field
                    id="item_qty"
                    name="item_qty"
                    type="number"
                    min={1}
                    value={quantity}
                    mix={{block: 'ProductActions', elem: 'Qty'}}
                    onChange={setQuantity}
                />
            </div>
        );
    }

    renderAddToCart() {
        const {configurableVariantIndex, product, quantity, customizable_options} = this.props;
        return (
            <><AddToCart
                product={product}
                configurableVariantIndex={configurableVariantIndex}
                customizable_options={Object.values(customizable_options)}
                mix={{block: 'ProductActions', elem: 'AddToCart'}}
                quantity={quantity}
            />
                {this.renderProductWishlistButton()}
            </>
        );
    }

    renderPrice() {
        const {product: {price, variants}, configurableVariantIndex} = this.props;

        // Product in props is updated before ConfigurableVariantIndex in props, when page is opened by clicking CartItem
        // As a result, we have new product, but old configurableVariantIndex, which may be out of range for variants
        const productOrVariantPrice = variants && variants[configurableVariantIndex] !== undefined
            ? variants[configurableVariantIndex].price
            : price;

        return (
            <ProductPrice
                price={productOrVariantPrice}
                mix={{block: 'ProductActions', elem: 'Price'}}
            />
        );
    }

    renderProductWishlistButton() {
        const {
            product
        } = this.props;

        return (
            <ProductWishlistButton
                product={product}
            />
        );
    }

    renderProductDetails() {
        const {product, areDetailsLoaded} = this.props;
        return <ProductDetailsRender product={product} loaded={areDetailsLoaded}/>
    }

    render() {
        return (
            <article block="ProductActions">
                {this.renderNameAndBrand()}
                <ExpandableContent
                    isContentExpanded={false}
                    closeOnClick={true}
                    heading={__('Product description')}
                >
                    {this.renderShortDescription()}
                </ExpandableContent>
                <ExpandableContent
                    isContentExpanded={true}
                    closeOnClick={true}
                    heading={__('Characteristic')}
                >
                    {this.renderProductDetails()}
                </ExpandableContent>
                {this.renderConfigurableAttributes()}
                {this.renderCustomizableOptions()}
                {this.renderPrice()}
                <div block="ProductActions" elem="AddToCartWrapper">
                    {this.renderQuantityInput()}
                    {this.renderAddToCart()}
                </div>
            </article>
        );
    }
}
