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
import {ProductType} from 'Type/ProductList';
import {RatingItemsType} from 'Type/Rating';
import Field from 'Component/Field';
import Form from 'Component/Form';
import ContentWrapper from 'Component/ContentWrapper';
import TextPlaceholder from 'Component/TextPlaceholder';
import Loader from 'Component/Loader';
import {customerType} from 'Type/Account';
import './ProductReviewForm.style';
import ReviewStar from 'Component/ReviewStar';
import Image from "Component/Image/Image.container";
import Link from "Component/Link";

/**
 * ProductReviewForm
 * @class ProductReviewForm
 */
export default class ProductReviewForm extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        addReview: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        customer: customerType.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        reviewRatings: RatingItemsType.isRequired
    };

    ratingTitleMap = {
        1: __('Awful'),
        2: __('Bad'),
        3: __('Average'),
        4: __('Good'),
        5: __('Awesome')
    };

    state = {
        isLoading: false,
        is_recommended: true,
        ratingData: {},
        ratingInvalid: false,
    };

    onReviewSubmitAttempt = (_, invalidFields) => {
        const {showNotification, reviewRatings} = this.props;
        const {ratingData} = this.state;
        if (!reviewRatings.every(({rating_id}) => ratingData[rating_id])) {
            this.setState({ratingInvalid: true})
        }
        const reviewsAreNotValid = invalidFields
            || !reviewRatings.every(({rating_id}) => ratingData[rating_id]);

        // if (reviewsAreNotValid) {
        //     showNotification('error', 'Incorrect data! Please check review fields.');
        // }

        this.setState({isLoading: !reviewsAreNotValid});
    };

    onReviewSubmitSuccess = (fields) => {
        const {product, addReview, closeForm} = this.props;
        const {ratingData: rating_data, is_recommended} = this.state;
        const {nickname, title, detail} = fields;
        const {sku: product_sku} = product;

        if (Object.keys(rating_data).length) {
            addReview({
                nickname,
                title,
                detail,
                is_recommended,
                product_sku,
                rating_data
            }).then((success) => {
                /** Clear form after submitting valid review */
                if (success) {
                    this.formRef.form.reset();
                    this.setState({ratingData: {}});
                    closeForm()
                }

                this.setState({isLoading: false});
            });
        }
    };

    onStarRatingClick = (rating_id, option_id) => {
        const {ratingData} = this.state;
        ratingData[rating_id] = option_id;
        this.setState({ratingData, ratingInvalid: false});
    };

    renderReviewStar(options, rating_id) {
        const {option_id, value} = options;
        const {ratingData} = this.state;
        const isChecked = !!ratingData[rating_id] && ratingData[rating_id] === option_id;

        return (
            <ReviewStar
                key={option_id}
                value={value}
                title={this.ratingTitleMap[value]}
                isChecked={isChecked}
                option_id={option_id}
                rating_id={rating_id}
                onStarRatingClick={this.onStarRatingClick}
            />
        );
    }

    renderReviewRating() {
        const {reviewRatings} = this.props;
        const {ratingInvalid} = this.state;

        return reviewRatings.map((rating) => {
            const {rating_id, rating_code, rating_options} = rating;

            return (
                <fieldset block="ProductReviewForm" elem="Rating" key={rating_id}>
                    <legend block="ProductReviewForm" elem="RatingLegend">
                        {__(rating_code)}
                    </legend>
                    <div block="ProductReviewForm" elem="RatingContent">
                        {rating_options
                            .sort(({value}, {value: nextValue}) => nextValue - value)
                            .map(option => this.renderReviewStar(option, rating_id))}
                    </div>
                  {ratingInvalid && <p className={'Field-Message'}>{__("This field is required!")}</p>}
                </fieldset>
            );
        });
    }

    renderReviewFormContent() {
        const {isLoading} = this.state;
        const {customer: {firstname: nickname}, isSignedIn} = this.props;
        return (
            <>
                <div block="ProductReviewForm" elem="FormContent">
                    <Field
                        type="text"
                        label={__("Name ")}
                        placeholder={__("Write a name")}
                        name="nickname"
                        id="nickname"
                        validation={['notEmpty']}
                        defaultValue={isSignedIn ? nickname : ''}
                    />
                    <Field
                        type="text"
                        label={__("Title")}
                        placeholder={__("Write a title")}
                        name="title"
                        id="title"
                        validation={['notEmpty']}
                    />
                    <Field
                        type="textarea"
                        label={__("Review")}
                        placeholder={__("Write a review ")}
                        name="detail"
                        id="detail"
                        rows={9}
                        validation={['notEmpty']}
                    />
                    {this.renderRecomendedButtons()}
                    <div className="terms">
                        <Field
                          type="checkbox"
                          label=''
                          name="terms"
                          id="terms"
                          validation={['checkbox']}
                        />
                        <span>{__("I agree to the")} <Link to={'/terms-of-contract'} target="_blank">{__("terms of the contract")}</Link></span>
                    </div>
                </div>
                <div block="ProductReviewForm" elem="Buttons">
                    <button
                      block="Button"
                    >
                        {__('Submit Review')}
                    </button>
                </div>
            </>
        );
    }

    renderHeading() {
        const {product: {name}} = this.props;

        return (
            <header block="ProductReviewForm" elem="FormHeading">
                <h3
                    block="ProductReviewForm"
                    elem="Title"
                    id="review-form"
                >
                    {__('Add a review')}
                </h3>
                {this.renderReviewRating()}
            </header>
        );
    }

    renderRecomendedButtons() {
        const {is_recommended} = this.state;
        return (
            <div block="ProductReviewForm" elem="Recommended">
                <span block="ProductReviewForm" elem="RecommendedTitle">{__('Would you recommend this product?')}</span>
                <button
                    block="Button"
                    className={is_recommended ? 'active' : ''}
                    onClick={event => {
                        event.preventDefault();
                        this.setState({is_recommended: true})
                    }}>{__('Yes')}</button>
                <button
                    block="Button"
                    className={!is_recommended ? 'active' : ''}
                    onClick={event => {
                        event.preventDefault();
                        this.setState({is_recommended: false})
                    }}>{__('No')}</button>
            </div>)
    }

    renderImage() {
        const {product: {name}, thumbnail} = this.props;
        const fullImageUrl = `${process.env.API_URL}${thumbnail}`;
        return (
            <div
                block="CartItem"
                elem="PictureWrapper"
            >
                <Image
                    src={fullImageUrl}
                    mix={{
                        block: 'CartItem',
                        elem: 'Picture'
                    }}
                    ratio="custom"
                    alt={`Product ${name} thumbnail.`}
                />
                <img
                    style={{display: 'none'}}
                    alt={name}
                    src={fullImageUrl}
                    itemProp="image"
                />
            </div>
        );
    }

    render() {
        const {isLoading} = this.state;

        return (
            <ContentWrapper
                mix={{block: 'ProductReviewForm'}}
                wrapperMix={{block: 'ProductReviewForm', elem: 'Wrapper'}}
                label={__('Product Review Form')}
            >
                {this.renderHeading()}
                {this.renderImage()}
                <Form
                    key="product-review"
                    mix={{block: 'ProductReviewForm', elem: 'Form'}}
                    ref={(el) => {
                        this.formRef = el;
                    }}
                    onSubmit={this.onReviewSubmitAttempt}
                    onSubmitSuccess={this.onReviewSubmitSuccess}
                    onSubmitError={this.onReviewSubmitAttempt}
                >
                    <Loader isLoading={isLoading}/>
                    {this.renderReviewFormContent()}
                </Form>
            </ContentWrapper>
        );
    }
}
