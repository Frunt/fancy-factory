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

import PropTypes from 'prop-types';
import {getUrlParam} from 'Util/Url';
import './SearchPage.style';
import {CategoryPageContainer} from "Route/CategoryPage/CategoryPage.container";
import CategoryPage from "Route/CategoryPage/CategoryPage.component";
import ContentWrapper from "Component/ContentWrapper";

export default class SearchPage extends CategoryPageContainer {
    static propTypes = {
        makeSearchRequest: PropTypes.func.isRequired,
        totalItems: PropTypes.number.isRequired
    };

    state = {
        sortKey: 'name',
        sortDirection: 'ASC',
        defaultPriceRange: {min: 0, max: 300},
        previousPage: 0,
        pageSize: 12
    };

    componentDidMount() {
        const {isOnlyPlaceholder, updateLoadStatus} = this.props;

        if (!isOnlyPlaceholder) {
            this.updateBreadcrumbs();
            this.makeSearchRequest()
        } else {
            updateLoadStatus(true);
        }
    }

    componentDidUpdate(prevProps) {
        const {location} = this.props;
        if (getUrlParam({path: 'search/'}, location) !== getUrlParam({path: 'search/'}, prevProps.location)) {
            this.updateBreadcrumbs();
            this.makeSearchRequest()
        }
    }

    _requestCategoryProductsInfo() {
        console.log('ops')
    }

    makeSearchRequest() {
        const {makeSearchRequest} = this.props;
        if (this.getSearchParam()) {
            makeSearchRequest({args: {search: decodeURIComponent(this.getSearchParam())}});
        }
    }

    getSearchParam() {
        const {location} = this.props;
        return getUrlParam({path: 'search/'}, location)
    }

    updateBreadcrumbs() {
        const {updateBreadcrumbs, location} = this.props;
        const search = getUrlParam({path: 'search/'}, location);
        updateBreadcrumbs([
            {
                name: 'Results'
            },
            {
                url: search,
                name: search
            },
            {
                name: 'Search'
            }
        ]);
    }


    render() {
        const {pageSize} = this.config;
        return (
            <SearchViewPage
                {...this.props}
                pageSize={pageSize}
                {...this.containerFunctions}
                {...this.containerProps()}
            />
        );
    }
}

class SearchViewPage extends CategoryPage {
    renderCategoryDetails() {
        const search = decodeURIComponent(getUrlParam({path: 'search/'}, location));

        return (
            <div block="SearchPage" elem="Description">
                <h1 block="SearchPage" elem="Heading">
                    {__('Search results for: ')}
                    <span>{search}</span>
                </h1>
            </div>
        );
    }

    render() {
        const {isOverlay} = this.state;

        return (
            <main block="SearchPage" mods={{isOverlay}}>
                <ContentWrapper
                    wrapperMix={{block: 'SearchPage', elem: 'Wrapper'}}
                    label="Search page"
                >
                    <div block="SearchPage" elem="Content">
                        {this.renderCategoryDetails()}
                        {this.renderCategoryProductList()}
                    </div>
                </ContentWrapper>
            </main>
        );
    }
}

