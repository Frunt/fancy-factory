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

import {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import Slider from 'Component/Slider';
import Image from 'Component/Image';
import './ProductGallery.style';
import ProductGalleryImage from 'Component/ProductGalleryImage';
import ProductLabelStatus from "Component/ProductLabelStatus";
import Link from "Component/Link";

export const GALLERY_LENGTH_BEFORE_COLLAPSE = 4;

/**
 * Product gallery
 * @class ProductGallery
 */
export default class ProductGallery extends PureComponent {
    static propTypes = {
        gallery: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string
                ]),
                image: PropTypes.string,
                isPlaceholder: PropTypes.bool,
                alt: PropTypes.string,
                type: PropTypes.string
            })
        ).isRequired
    };

    state = {activeImage: 0};

    renderAdditionalPicture = this.renderAdditionalPicture.bind(this);

    onActiveImageChange = this.onActiveImageChange.bind(this);

    componentDidUpdate(prevProps) {
      if (prevProps.product.id !== this.props.product.id) {
        this.setState({activeImage: 0})
      }
    }

  onActiveImageChange(activeImage) {
        this.setState({activeImage});
    }

    renderAdditionalPicture(media, index = 0) {
        return (
            <ProductGalleryImage
                key={index}
                media={media}
                index={index}
                active={this.state.activeImage === index}
                onActiveImageChange={this.onActiveImageChange}
            />
        );
    }

    renderAdditionalPictures() {
        const {gallery} = this.props;
        const galleryLength = gallery.length;
        return galleryLength < GALLERY_LENGTH_BEFORE_COLLAPSE
            ? gallery.map((item, index) => this.renderAdditionalPicture({...item, type: 'single'}, index))
            : gallery.slice(0, GALLERY_LENGTH_BEFORE_COLLAPSE).map(this.renderAdditionalPicture);
    }

    renderSlide(media, index) {
        const {
            alt,
            type,
            image = '',
            isPlaceholder
        } = media;
        const fullImageUrl = `${process.env.API_URL}${image}`;

        switch (type) {
            case 'image':
                return (
                    <Fragment key={index}>
                        <Image
                            src={image}
                            ratio="custom"
                            mix={{
                                block: 'ProductGallery',
                                elem: 'SliderImage',
                                mods: {isPlaceholder: !image}
                            }}
                            isPlaceholder={isPlaceholder}
                            alt={alt}
                        />
                        <img
                            style={{display: 'none'}}
                            alt={name}
                            src={fullImageUrl}
                            itemProp="image"
                        />
                    </Fragment>
                );
            default:
                return null;
        }
    }

    render() {
        const {gallery, product} = this.props;
        const {activeImage} = this.state;
        return (
            <div block="ProductGallery">
                {this.renderAdditionalPictures()}
                <Slider
                    mix={{block: 'ProductGallery', elem: 'Slider'}}
                    showCrumbs
                    activeImage={activeImage}
                    onActiveImageChange={this.onActiveImageChange}
                >
                    {gallery.map(this.renderSlide)}
                </Slider>
                <ProductLabelStatus product={product}/>
                <Link block="ProductGallery" elem="Link" to="/page/delivery">
                    { __('Payment and delivery methods') }
                </Link>
            </div>
        );
    }
}
