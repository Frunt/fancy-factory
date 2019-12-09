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
import Overlay from 'Component/Overlay';
import ProductConfigurableAttributes from 'Component/ProductConfigurableAttributes';
import './CategoryFilterOverlay.style';

export default class CategoryFilterOverlay extends PureComponent {
    static propTypes = {
        availableFilters: PropTypes.objectOf(PropTypes.shape).isRequired,
        updatePriceRange: PropTypes.func.isRequired,
        priceValue: PropTypes.shape({
            min: PropTypes.number,
            max: PropTypes.number
        }).isRequired,
        minPriceValue: PropTypes.number.isRequired,
        maxPriceValue: PropTypes.number.isRequired,
        onSeeResultsClick: PropTypes.func.isRequired,
        customFiltersValues: PropTypes.objectOf(PropTypes.array).isRequired,
        toggleCustomFilter: PropTypes.func.isRequired,
        getFilterUrl: PropTypes.func.isRequired
    };

    renderFilters() {
        const {
            availableFilters,
            customFiltersValues,
            toggleCustomFilter,
            getFilterUrl,
            clearCustomFilter,
            updatePriceRange,
            priceValue,
            minPriceValue,
            maxPriceValue,
            maxLubricantValue,
            minLubricantValue,
            updateLubricantRange,
            lubricantValue,
            clearPriceRange,
            clearLubricantRange,
            windowSize
        } = this.props;

        const isLoaded = availableFilters && !!Object.keys(availableFilters).length;
        return (
            <ProductConfigurableAttributes
                mix={{block: 'CategoryFilterOverlay', elem: 'Attributes'}}
                isReady={isLoaded}
                configurable_options={availableFilters}
                getLink={getFilterUrl}
                clearCustomFilter={clearCustomFilter}
                parameters={customFiltersValues}
                updateConfigurableVariant={toggleCustomFilter}

                priceValue={priceValue}
                minPriceValue={minPriceValue}
                maxPriceValue={maxPriceValue}
                updatePriceRange={updatePriceRange}
                clearPriceRange={clearPriceRange}

                clearLubricantRange={clearLubricantRange}
                maxLubricantValue={maxLubricantValue}
                minLubricantValue={minLubricantValue}
                updateLubricantRange={updateLubricantRange}
                lubricantValue={lubricantValue}

                windowSize={windowSize}
            />
        );
    }

    renderSeeResults() {
        const {hideOverlay} = this.props;

        return (
            <button
                block="CategoryFilterOverlay"
                elem="SeeResults"
                mix={{block: 'Button'}}
                onClick={hideOverlay}
            >
                {__('See products')}
            </button>
        );
    }

    renderHeading() {
        const {hideOverlay} = this.props;
        return (
            <div block="CategoryFilterOverlay" elem="Heading">
                {__('Filters')}
                <div block="CategoryFilterOverlay" elem="Close" onClick={() => hideOverlay()}/>
            </div>
        );
    }

    renderFilterClearButton() {
        const {clearFilters} = this.props;

        return (
            <button
                block="CategoryFilterOverlay"
                elem="ClearFilters"
                onClick={clearFilters}
            >
                {__('Clear filters')}
            </button>
        );
    }

    render() {
        const {windowSize} = this.props;
        return (
            <Overlay mix={{block: 'CategoryFilterOverlay'}} id="category-filter">
                {(windowSize === 'mobile') && this.renderHeading()}
                {this.renderFilters()}
                {this.renderFilterClearButton()}
                {this.renderSeeResults()}
            </Overlay>
        );
    }
}
