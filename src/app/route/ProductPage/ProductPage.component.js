/* eslint-disable react/no-unused-state */
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

import {Component} from 'react';
import PropTypes from 'prop-types';
import ProductGallery from 'Component/ProductGallery';
import ContentWrapper from 'Component/ContentWrapper';
import Meta from 'Component/Meta';
import ProductActions from 'Component/ProductActions';
import {ProductType} from 'Type/ProductList';
import RelatedProducts from 'Component/RelatedProducts';
import './ProductPage.style';
import ProductReviewList from "Component/ProductReviewList";
import ProductReviewForm from "Component/ProductReviewForm";
import Popup from "Component/Popup";
import {ProductBannersComponent as ProductBanners} from "Component/ProductBanners/ProductBanners.component";
import TextPlaceholder from "Component/TextPlaceholder";

export default class ProductPage extends Component {
    static propTypes = {
        configurableVariantIndex: PropTypes.number.isRequired,
        productOrVariant: ProductType.isRequired,
        getLink: PropTypes.func.isRequired,
        parameters: PropTypes.objectOf(PropTypes.string).isRequired,
        updateConfigurableVariant: PropTypes.func.isRequired,
        dataSource: ProductType.isRequired,
        thumbnail: PropTypes.string.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired
    };

    renderProductPageContent() {
        const {
            configurableVariantIndex,
            parameters,
            getLink,
            dataSource,
            updateConfigurableVariant,
            productOrVariant,
            areDetailsLoaded
        } = this.props;

        return (
            <>
                <ProductGallery
                    product={productOrVariant}
                />
                <ProductActions
                    getLink={getLink}
                    productOrVariant={productOrVariant}
                    isProductPage={true}
                    updateConfigurableVariant={updateConfigurableVariant}
                    product={dataSource}
                    parameters={parameters}
                    areDetailsLoaded={areDetailsLoaded}
                    configurableVariantIndex={configurableVariantIndex}
                />
            </>
        );
    }

    renderProductReview() {
        const {
            dataSource,
            areDetailsLoaded,
            showPopup,
            thumbnail
        } = this.props;
        return (
            <ContentWrapper
                mix={{block: 'ProductReviewList'}}
                wrapperMix={{block: 'ProductReviewList', elem: 'Content'}}
                label={__('Add product review')}
            >
                <h3
                    block="ProductReviewList"
                    elem="Title"
                    id="reviews"
                >
                    <TextPlaceholder content={__('Customer reviews')}/>
                </h3>
                <ProductReviewList product={dataSource} areDetailsLoaded={areDetailsLoaded}/>
                <div block="ReviewPopup">
                    <button block="Button" onClick={showPopup}>{__('Write a review')}</button>
                    <Popup
                        id={'ReviewPopup'}
                        clickOutside={true}
                        mix={{block: 'ReviewPopup'}}
                    >
                        <ProductReviewForm product={dataSource} thumbnail={thumbnail} closeForm={showPopup}/>
                    </Popup>
                </div>
            </ContentWrapper>
        )
    }

    render() {
        const {dataSource, areDetailsLoaded} = this.props;

        return (
            <>
                <Meta metaObject={dataSource}/>
                <main block="ProductPage" aria-label="Product page">
                    <ProductBanners
                        attributes={dataSource.attributes}
                    />
                    <div
                        itemScope
                        itemType="http://schema.org/Product"
                    >
                        <ContentWrapper
                            wrapperMix={{block: 'ProductPage', elem: 'Wrapper'}}
                            label={__('Main product details')}
                        >
                            {this.renderProductPageContent()}
                        </ContentWrapper>
                    </div>
                    <RelatedProducts
                        product={dataSource}
                        linkType={'upsell'}
                        areDetailsLoaded={areDetailsLoaded}
                        label={__('Upsell products')}
                        itemType=""
                    />
                    {this.renderProductReview()}
                    <RelatedProducts
                        product={dataSource}
                        linkType={'related'}
                        areDetailsLoaded={areDetailsLoaded}
                        label={__('Recommends')}
                        itemType=""
                    />
                </main>
            </>
        );
    }
}
