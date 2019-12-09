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
import {PureComponent} from 'react';
import CategoryFilterOverlay from 'Component/CategoryFilterOverlay';
import CategoryProductList from 'Component/CategoryProductList';
import CategoryDetails from 'Component/CategoryDetails';
import ContentWrapper from 'Component/ContentWrapper';
import CategorySort from 'Component/CategorySort';
import {CategoryTreeType} from 'Type/Category';
import {FilterType, FilterInputType} from 'Type/ProductList';
import Meta from 'Component/Meta';
import './CategoryPage.style';
import CategoriesList from "Component/CategoriesList";

export default class CategoryPage extends PureComponent {
    static propTypes = {
        category: CategoryTreeType.isRequired,
        minPriceRange: PropTypes.number.isRequired,
        maxPriceRange: PropTypes.number.isRequired,
        getIsNewCategory: PropTypes.func.isRequired,
        filters: PropTypes.objectOf(PropTypes.shape).isRequired,
        sortFields: PropTypes.shape({
            options: PropTypes.array
        }).isRequired,
        selectedSort: PropTypes.shape({
            sortDirection: PropTypes.oneOf([
                'ASC',
                'DESC'
            ]),
            sortKey: PropTypes.string
        }).isRequired,
        selectedPriceRange: PropTypes.shape({
            min: PropTypes.number,
            max: PropTypes.number
        }).isRequired,
        getFilterUrl: PropTypes.func.isRequired,
        onSortChange: PropTypes.func.isRequired,
        updateFilter: PropTypes.func.isRequired,
        updatePriceRange: PropTypes.func.isRequired,
        toggleOverlayByKey: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        selectedFilters: FilterType.isRequired,
        filter: FilterInputType.isRequired,
        search: PropTypes.string.isRequired
    };

    state = {
        isOverlay: false
    }

    hideOverlay = this.hideOverlay.bind(this);
    showOverlay = this.showOverlay.bind(this);


    onFilterButtonClick() {
        const {toggleOverlayByKey, changeHeaderState} = this.props;

        toggleOverlayByKey('category-filter');
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        changeHeaderState({name: 'filter', title: __('Filters')});
    }

    onSortButtonClick() {
        const {toggleOverlayByKey, changeHeaderState} = this.props;

        toggleOverlayByKey('category-sort');
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        changeHeaderState({name: 'filter', title: __('Filters')});
    }

    showOverlay(id) {
        const {toggleOverlayByKey} = this.props;
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        toggleOverlayByKey(id);
        this.setState({isOverlay: true});
    }

    hideOverlay() {
        const {hideActiveOverlay} = this.props;
        hideActiveOverlay();
        document.getElementsByTagName('body')[0].style.overflow = '';
        this.setState({isOverlay: false});
    }

    renderCategoryDetails() {
        const {category} = this.props;

        return (
            <CategoryDetails
                category={category}
            />
        );
    }

    renderFilterButton() {
        return (
            <div
                block="CategoryPage"
                elem="Filter"
                onClick={() => this.showOverlay('category-filter')}
            >
                {__('Filters')}
            </div>
        );
    }

    renderSortButton() {
        return (
            <div
                block="CategoryPage"
                elem="Sort"
                onClick={() => this.showOverlay('category-sort')}
            >
                {__('To sort')}
            </div>
        )
    }

    renderFilterOverlay() {
        const {
            minPriceRange,
            maxPriceRange,
            minLubricantRange,
            maxLubricantRange,
            filters,
            selectedFilters,
            selectedPriceRange,
            selectedLubricantRange,
            updatePriceRange,
            updateLubricantRange,
            updateFilter,
            getFilterUrl,
            clearFilters,
            windowSize
        } = this.props;

        return (
            <CategoryFilterOverlay
                getFilterUrl={getFilterUrl}

                updateLubricantRange={updateLubricantRange}
                lubricantValue={selectedLubricantRange}
                minLubricantValue={minLubricantRange}
                maxLubricantValue={maxLubricantRange}

                availableFilters={filters}
                customFiltersValues={selectedFilters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}

                updatePriceRange={updatePriceRange}
                priceValue={selectedPriceRange}
                minPriceValue={minPriceRange}
                maxPriceValue={maxPriceRange}

                windowSize={windowSize}
                hideOverlay={this.hideOverlay}
            />
        );
    }

    renderCategorySort() {
        const {sortFields, selectedSort, onSortChange, windowSize} = this.props;
        const {options = {}} = sortFields;
        const updatedSortFields = Object.values(options).map(({value: id, label}) => ({id, label}));
        const {sortDirection, sortKey} = selectedSort;

        return (
            <CategorySort
                onSortChange={onSortChange}
                sortFields={updatedSortFields}
                sortKey={sortKey}
                sortDirection={sortDirection}
                windowSize={windowSize}
                hideOverlay={this.hideOverlay}
            />
        );
    }

    renderCategoryProductList() {
        const {
            filter,
            search,
            selectedSort,
            selectedFilters,
            getIsNewCategory
        } = this.props;

        return (
            <CategoryProductList
                filter={filter}
                search={search}
                sort={selectedSort}
                selectedFilters={selectedFilters}
                getIsNewCategory={getIsNewCategory}
            />
        );
    }

    render() {
        const {category, windowSize} = this.props;
        const {isOverlay} = this.state;

        return (
            <main block="CategoryPage" mods={{isOverlay}}>
                <ContentWrapper
                    wrapperMix={{block: 'CategoryPage', elem: 'Wrapper'}}
                    label="Category page"
                >
                    <Meta metaObject={category}/>
                    {(windowSize === 'desktop') && <aside block="CategoryPage" elem="Aside">
                        <CategoriesList/>
                    </aside>}
                    <div block="CategoryPage" elem="Content">
                        {this.renderCategoryDetails()}
                        {this.renderFilterOverlay()}
                        {(windowSize === 'mobile') && this.renderCategorySort()}
                        {(windowSize === 'mobile') &&
                        <div block="CategoryPage" elem="MobActions">
                            {this.renderSortButton()}
                            {this.renderFilterButton()}
                        </div>
                        }
                        {this.renderCategoryProductList()}
                    </div>
                </ContentWrapper>
            </main>
        );
    }
}
