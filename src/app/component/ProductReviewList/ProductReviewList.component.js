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
import ContentWrapper from 'Component/ContentWrapper';
import TextPlaceholder from 'Component/TextPlaceholder';
import ProductReviewRating from 'Component/ProductReviewRating';
import './ProductReviewList.style';
import ReviewPagination from "Component/ProductReviewList/ReviewPagination.component";
import Field from "Component/Field/Field.component";

/**
 * @class ProductReviewList
 */
export default class ProductReviewList extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired
    };
    state = {
        reviewByPage: 3,
        currentPage: 1,
        sort: 'dateDesc'
    };

    renderReviewListItemRating(ratingVoteItem) {
        const {
            vote_id,
            rating_code,
            percent
        } = ratingVoteItem;

        return (
            <div
                key={vote_id}
                block="ProductReviewList"
                elem="RatingSummaryItem"
            >
                {percent
                    ? <ProductReviewRating summary={percent} code={rating_code}/>
                    : <ProductReviewRating placeholder/>}
            </div>
        );
    }

    renderReviewListItem(reviewItem) {
        const {
            review_id,
            nickname,
            title,
            detail,
            created_at,
            rating_votes
        } = reviewItem;

        return (
            <li
                key={review_id}
                block="ProductReviewList"
                elem="Item"
            >
                <div block="ProductReviewList" elem="RatingSummary">
                    {rating_votes
                        ? rating_votes.map(rating => this.renderReviewListItemRating(rating))
                        : this.renderReviewListItemRating({vote_id: null})}
                </div>
                <div block="ProductReviewList" elem="Date">
                    <TextPlaceholder
                        content={created_at ? `${new Date(created_at).toLocaleDateString()}` : ''}
                        length="medium"
                    />
                </div>
                <div block="ProductReviewList" elem="Author">
                    <TextPlaceholder
                        content={nickname ? `By ${nickname}` : ''}
                        length="medium"
                    />
                </div>
                <div block="ProductReviewList" elem="ReviewContent">
                    <p block="ProductReviewList" elem="ReviewDetails">
                        {detail
                        || (
                            <>
                                <TextPlaceholder length="long"/>
                                <TextPlaceholder length="long"/>
                                <TextPlaceholder length="long"/>
                            </>
                        )}
                    </p>
                </div>
            </li>
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

    reviewSort = (a, b) => {
        const {sort} = this.state;
        switch (sort) {
            case 'dateAsc':
                return new Date(a.created_at) < new Date(b.created_at) ? -1 : 1;
            case 'dateDesc':
                return new Date(a.created_at) > new Date(b.created_at) ? -1 : 1;
            case 'ratingAsc':
                return a.rating_votes[0].percent < b.rating_votes[0].percent ? -1 : 1;
            case 'ratingDesc':
                return a.rating_votes[0].percent > b.rating_votes[0].percent ? -1 : 1;
            default:
        }
    };

    reviewFilter = (item, index) => {
        const {reviewByPage, currentPage} = this.state;
        if ((index < reviewByPage * currentPage) &&
            (index >= reviewByPage * currentPage - reviewByPage)
        ) {
            return item
        }
    };

    containerFunctions = {
        nextPage: this.nextPage.bind(this),
        prevPage: this.prevPage.bind(this)
    };


    renderReviewSort() {
        const options = [{
            label: __('From old date'),
            value: 'dateAsc'
        }, {
            label: __('From new date'),
            value: 'dateDesc'
        }, {
            label: __('Lower rating'),
            value: 'ratingAsc'
        }, {
            label: __('Higher rating'),
            value: 'ratingDesc'
        }];

        return (
            <Field
                id={'reviewSort'}
                name={'reviewSort'}
                type={'select'}
                onChange={sort => this.setState({sort})}
                selectOptions={options}
                value={this.state.sort}
            />
        )
    }

    nextPage() {
        const {product: {reviews}} = this.props;
        let {currentPage, reviewByPage} = this.state;
        if (currentPage * reviewByPage >= reviews.length) return false;
        currentPage = ++currentPage;
        this.setState({currentPage})
    }

    prevPage() {
        let {currentPage} = this.state;
        currentPage = --currentPage;
        if (currentPage <= 0) return false;
        this.setState({currentPage})
    }

    render() {
        const {product, areDetailsLoaded} = this.props;
        const hasReviews = product.reviews && Object.keys(product.reviews).length > 0;
        const placeholderReviewList = [
            {review_id: 1},
            {review_id: 2},
            {review_id: 3}
        ];
        return (
            <>
                {areDetailsLoaded && hasReviews ?
                    <>
                        {this.renderReviewListRating()}
                        {this.renderReviewSort()}
                        <ul block="ProductReviewList" elem="List">
                            <h4>{__('Customer reviews')}</h4>
                            {(areDetailsLoaded ? product.reviews : placeholderReviewList).sort(this.reviewSort).filter(this.reviewFilter).map(
                                review => this.renderReviewListItem(review)
                            )}
                        </ul>
                        <ReviewPagination
                            {...this.state}
                            {...this.containerFunctions}
                            {...{reviews: product.reviews}}
                        />
                    </> :
                    <p block="ProductReviewList" elem="TitleNoProducts">
                        <TextPlaceholder
                            content={areDetailsLoaded ? __('There are no reviews for this product yet.') : ''}/>
                    </p>
                }
            </>
        );
    }
}
