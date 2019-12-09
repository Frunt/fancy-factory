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

import {connect} from 'react-redux';
import {PureComponent} from 'react';
import {ProductType, FilterType} from 'Type/ProductList';
import {CartDispatcher} from 'Store/Cart';
import {getVariantIndex, getVariantsIndexes} from 'Util/Product';
import {objectToUri} from 'Util/Url';
import ProductCard from './ProductCard.component';

export const mapDispatchToProps = dispatch => ({
    addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class ProductCardContainer extends PureComponent {
    static propTypes = {
        product: ProductType,
        selectedFilters: FilterType
    };

    static defaultProps = {
        product: {},
        selectedFilters: {}
    };

    state = {
        configurableVariantIndex: -1
    };

    containerFunctions = {
        getAttribute: this.getAttribute.bind(this),
        updateConfigurableVariantIndex: this.updateConfigurableVariantIndex.bind(this),
        getIsConfigurableAttributeAvailable: this.getIsConfigurableAttributeAvailable.bind(this)
    };

    getAttribute(code) {
        const {product: {attributes = []}} = this.props;
        return attributes[code];
    }

    containerProps = () => ({
        availableVisualOptions: this._getAvailableVisualOptions(),
        currentVariantIndex: this._getCurrentVariantIndex(),
        productOrVariant: this._getProductOrVariant(),
        thumbnail: this._getThumbnail(),
        linkTo: this._getLinkTo()
    });

    updateConfigurableVariantIndex(parameters) {
        const {product: {variants, configurable_options}} = this.props;
        const {configurableVariantIndex} = this.state;

        const newIndex = Object.keys(parameters).length === Object.keys(configurable_options).length
            ? getVariantIndex(variants, parameters)
            // Not all parameters are selected yet, therefore variantIndex must be invalid
            : -1;

        if (configurableVariantIndex !== newIndex) {
            this.setState({configurableVariantIndex: newIndex});
        }
    }

    _getLinkTo() {
        const {product: {url_rewrites}, product} = this.props;
        const url_key = (url_rewrites && url_rewrites.length ) ? url_rewrites[0].url : null;
        if (!url_key) return undefined;
        const {parameters} = this._getConfigurableParameters();
        return {
            pathname: `/${url_key}`,
            state: {product},
            search: objectToUri(parameters)
        };
    }

    _getCurrentVariantIndex() {
        const {index} = this._getConfigurableParameters();
        return index >= 0 ? index : 0;
    }

    _getConfigurableParameters() {
        const {product: {variants = []}, selectedFilters = {}} = this.props;
        const filterKeys = Object.keys(selectedFilters);

        if (filterKeys.length < 0) return {indexes: [], parameters: {}};

        const indexes = getVariantsIndexes(variants, selectedFilters);
        const [index] = indexes;

        if (!variants[index]) return {indexes: [], parameters: {}};
        const {attributes} = variants[index];

        const parameters = Object.entries(attributes)
            .reduce((parameters, [key, {attribute_value}]) => {
                if (filterKeys.includes(key)) return {...parameters, [key]: attribute_value};
                return parameters;
            }, {});

        return {indexes, index, parameters};
    }

    _isThumbnailAvailable(path) {
        return path && path !== 'no_selection';
    }

    _getThumbnail() {
        const product = this._getProductOrVariant();
        const {thumbnail: {path} = {}} = product;
        if (this._isThumbnailAvailable(path)) return path;
        // If thumbnail is, missing we try to get image from parent
        const {product: {thumbnail: {path: parentPath} = {}}} = this.props;
        if (this._isThumbnailAvailable(parentPath)) return parentPath;

        return '';
    }

    _getProductOrVariant() {
        const {product: {type_id, variants}, product} = this.props;
        const {configurableVariantIndex} = this.state;
        return (type_id === 'configurable' && variants !== undefined && variants[configurableVariantIndex]
                ? variants[configurableVariantIndex]
                : product
        ) || {};
    }

    _getAvailableVisualOptions() {
        const {product: {configurable_options = []}} = this.props;

        return Object.values(configurable_options).reduce((acc, {attribute_options = {}, attribute_values}) => {
            const visualOptions = Object.values(attribute_options).reduce(
                (acc, {swatch_data: {type, value}, label, value: attrValue}) => {
                    if (type === '1' && attribute_values.includes(attrValue)) acc.push({value, label});
                    return acc;
                }, []
            );

            if (visualOptions.length > 0) return [...acc, ...visualOptions];
            return acc;
        }, []);
    }

    getIsConfigurableAttributeAvailable({attribute_code, attribute_value}) {
        const {parameters, product: {variants}} = this.props;

        const isAttributeSelected = Object.hasOwnProperty.call(parameters, attribute_code);

        // If value matches current attribute_value, option should be enabled
        if (isAttributeSelected && parameters[attribute_code] === attribute_value) return true;

        const parameterPairs = Object.entries(parameters);

        const selectedAttributes = isAttributeSelected
            // Need to exclude itself, otherwise different attribute_values of the same attribute_code will always be disabled
            ? parameterPairs.filter(([key]) => key !== attribute_code)
            : parameterPairs;

        return variants
            .some(({stock_status, attributes}) => stock_status === 'IN_STOCK'
                // Variant must have currently checked attribute_code and attribute_value
                && attributes[attribute_code].attribute_value === attribute_value
                // Variant must have all currently selected attributes
                && selectedAttributes.every(([key, value]) => attributes[key].attribute_value === value));
    }

    render() {
        return (
            <ProductCard
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
                {...this.containerProps()}
            />
        );
    }
}


export default connect(null, mapDispatchToProps)(ProductCardContainer);
