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
import Link from 'Component/Link';
import ProductReviewRating from 'Component/ProductReviewRating';
import {ProductType} from 'Type/ProductList';
import TextPlaceholder from 'Component/TextPlaceholder';
import ProductPrice from 'Component/ProductPrice';
import Image from 'Component/Image';
import './ProductCard.style';
import Loader from 'Component/Loader';
import ProductActions from "Component/ProductActions";
import AddToCart from "Component/AddToCart";
import ProductLabelStatus from "Component/ProductLabelStatus";
import ProductCardActions from "Component/ProductCardActions";
import ProductWishlistButton from "Component/ProductWishlistButton";

/**
 * Product card
 * @class ProductCard
 */
export default class ProductCard extends PureComponent {
    static propTypes = {
        linkTo: PropTypes.shape({}),
        product: ProductType.isRequired,
        productOrVariant: ProductType.isRequired,
        thumbnail: PropTypes.string,
        availableVisualOptions: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
        })).isRequired,
        getAttribute: PropTypes.func.isRequired,
        children: PropTypes.element,
        isLoading: PropTypes.bool,
        mix: PropTypes.shape({})
    };

    static defaultProps = {
        thumbnail: '',
        linkTo: {},
        children: null,
        isLoading: false,
        mix: {},
        isOrderItem: false
    };

    state = {
        parameters: {},
        openAdditional: false
    };

    renderProductPrice() {
        const {productOrVariant: {price}} = this.props;
        if (!price) return <TextPlaceholder/>;

        return (
            <ProductPrice
                price={price}
                mix={{block: 'ProductCard', elem: 'Price'}}
            />
        );
    }

    renderVisualConfigurableOptions() {
        const {product: dataSource, isLoading, updateConfigurableVariantIndex, configurableVariantIndex} = this.props;
        const {parameters} = this.state;

        const updateConfigurableVariant = (key, value) => {
            parameters[key] = value;
            updateConfigurableVariantIndex(parameters);
        };

        return (<ProductCardActions
            isProductPage={true}
            updateConfigurableVariant={updateConfigurableVariant}
            product={dataSource}
            isProductCard={true}
            parameters={parameters}
            areDetailsLoaded={!isLoading}
            configurableVariantIndex={configurableVariantIndex}
        />)
    }

    renderPicture() {
        const {productOrVariant: {id, name}, thumbnail} = this.props;
        const imageUrl = thumbnail && `/media/catalog/product${thumbnail}`;
        const fullImageUrl = `${process.env.API_URL}/${imageUrl}`;

        return (
            <>
                <Image
                    src={imageUrl}
                    alt={name}
                    ratio="custom"
                    mix={{block: 'ProductCard', elem: 'Picture'}}
                    isPlaceholder={!id}
                />
                <img
                    style={{display: 'none'}}
                    alt={name}
                    src={fullImageUrl}
                    itemProp="image"
                />
            </>
        );
    }

    renderPictureLabel() {
        const {product: {review_summary: {rating_summary, review_count} = {}}} = this.props;
        if (!rating_summary) return null;

        const ONE_FIFTH_OF_A_HUNDRED = 20;
        const rating = parseFloat(rating_summary / ONE_FIFTH_OF_A_HUNDRED).toFixed(2);

        return (
            <figcaption
                block="ProductCard"
                elem="PictureLabel"
                itemProp="aggregateRating"
                itemScope
                itemType="https://schema.org/AggregateRating"
            >
                <meta itemProp="ratingValue" content={rating || 0}/>
                <meta itemProp="ratingCount" content={review_count || 0}/>
                <ProductReviewRating summary={rating_summary || 0}/>
            </figcaption>
        );
    }

    renderMainDetails() {
        const {product: {name, sku}, product, isWishListItem} = this.props;

        return (
            <>
                <p
                    block="ProductCard"
                    elem="Name"
                    mods={{isLoaded: !!name}}
                    itemProp="name"
                >
                    <TextPlaceholder content={name} length="medium"/>
                </p>
                <p
                    block="ProductCard"
                    elem="Sku"
                    mods={{isLoaded: !!sku}}
                    itemProp="sku"
                >
                    <TextPlaceholder content={sku} length="medium"/>
                </p>
                {!isWishListItem && <ProductLabelStatus product={product}/>}
            </>
        );
    }

    renderCardWrapper(children) {
        const {linkTo, product: {url_key}} = this.props;

        if (!url_key) {
            return (<div>{children}</div>);
        }

        return (
            <Link
                block="ProductCard"
                elem="Link"
                to={linkTo}
            >
                {children}
            </Link>
        );
    }

    getAttributeValue(key) {
        const {product: {attributes}} = this.props;
        if (!attributes) return null;
        const attr = attributes[key];
        if (!attr) return null;
        const {attribute_options, attribute_value} = attr;
        return attribute_options[attribute_value] && <span>{attribute_options[attribute_value].label}</span>
    };

    renderAdditionalInfo() {
        return (
            <>
                {this.getAttributeValue('brend')}
                {this.getAttributeValue('vibrator_size')}
                {this.getAttributeValue('material')}
            </>
        )
    }

    renderAddToCart() {
        const {product, configurableVariantIndex} = this.props;
        return (
            <AddToCart
                product={product}
                isProductCard={true}
                configurableVariantIndex={configurableVariantIndex}
                mix={{block: 'ProductCardActions', elem: 'AddToCart'}}
                openAdditional={() => this.setState({openAdditional: true})}
                quantity={1}
            />
        );
    }

    renderProductDetails() {
        const {openAdditional} = this.state;
        return (
            <div
                block="ProductCard"
                elem="ActionsContent"
                className={openAdditional ? 'active' : ''}
            >
                {this.renderVisualConfigurableOptions()}
            </div>
        )
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

    render() {
        const {
            product: {sku},
            children,
            mix,
            isLoading,
            isOrderItem,
            isWishListItem
        } = this.props;

        const {openAdditional} = this.state;

        return (
            <li
                block="ProductCard"
                itemScope
                itemType={sku && 'https://schema.org/Product'}
                mix={mix}
            >
                <Loader isLoading={isLoading}/>
                <meta itemProp="sku" content={sku}/>
                {isWishListItem && this.renderProductWishlistButton()}
                {this.renderCardWrapper((
                    <>
                        <figure>
                            {this.renderMainDetails()}
                            {this.renderPicture()}
                            {this.renderPictureLabel()}
                        </figure>
                        {!isOrderItem && <>
                            <div block="ProductCard" elem="AdditionalInfo">
                                {this.renderAdditionalInfo()}
                            </div>
                            {this.renderProductPrice()}
                        </>}
                    </>
                ))}
                {!isOrderItem && <div block="ProductCard" elem="AdditionalContent">
                    {children}
                    <div block="ProductCard" elem="Actions">
                        {this.renderAddToCart()}
                        <div
                            block="ProductCard"
                            elem="ActionsButton"
                            className={openAdditional ? 'active' : ''}
                            onClick={() => this.setState({openAdditional: !openAdditional})}
                        >
                            <span>Open</span>
                            {__('Characteristic')}
                        </div>
                    </div>
                    {this.renderProductDetails()}
                </div>}
            </li>
        );
    }
}
