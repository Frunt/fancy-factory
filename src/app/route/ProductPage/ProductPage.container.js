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
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {ProductDispatcher} from 'Store/Product';
import {changeHeaderState} from 'Store/Header';
import {BreadcrumbsDispatcher} from 'Store/Breadcrumbs';
import {history} from 'Route';
import {PDP} from 'Component/Header';
import {getVariantIndex} from 'Util/Product';
import {
    getUrlParam,
    convertQueryStringToKeyValuePairs,
    updateQueryParamWithoutHistory,
    removeQueryParamWithoutHistory,
    objectToUri
} from 'Util/Url';

import {ProductType} from 'Type/ProductList';
import {LocationType, HistoryType, MatchType} from 'Type/Common';

import ProductPage from './ProductPage.component';
import {showPopup} from "Store/Popup";
import {ADDRESS_POPUP_ID} from "Component/MyAccountAddressPopup/MyAccountAddressPopup.component";
import {UrlRewritesDispatcher} from "Store/UrlRewrites";

export const mapStateToProps = state => ({
    product: state.ProductReducer.product,
    urlRewrite: state.UrlRewritesReducer.urlRewrite
});

export const mapDispatchToProps = dispatch => ({
    showPopup: payload => dispatch(showPopup('ReviewPopup', payload)),
    changeHeaderState: state => dispatch(changeHeaderState(state)),
    requestProduct: options => ProductDispatcher.handleData(dispatch, options),
    updateBreadcrumbs: breadcrumbs => BreadcrumbsDispatcher.updateWithProduct(breadcrumbs, dispatch),
    requestUrlRewrite: (options) => UrlRewritesDispatcher.handleData(dispatch, options),
    clearGroupedProductQuantity: () => ProductDispatcher.clearGroupedProductQuantity(dispatch)
});

export class ProductPageContainer extends PureComponent {
    static propTypes = {
        location: LocationType,
        isOnlyPlaceholder: PropTypes.bool,
        changeHeaderState: PropTypes.func.isRequired,
        updateBreadcrumbs: PropTypes.func.isRequired,
        requestProduct: PropTypes.func.isRequired,
        product: ProductType.isRequired,
        clearGroupedProductQuantity: PropTypes.func.isRequired,
        history: HistoryType.isRequired,
        match: MatchType.isRequired
    };

    static defaultProps = {
        location: {state: {}},
        isOnlyPlaceholder: false
    };

    state = {
        configurableVariantIndex: -1,
        isConfigurationInitialized: false,
        parameters: {}
    };

    containerFunctions = {
        updateConfigurableVariant: this.updateConfigurableVariant.bind(this),
        getLink: this.getLink.bind(this)
    };

    componentDidMount() {
        const {isOnlyPlaceholder} = this.props;
        if (!isOnlyPlaceholder) this._requestProduct();
        this._onProductUpdate();
    }

    componentDidUpdate({location: {pathname: prevPathname}}) {
        const {location: {pathname}} = this.props;

        if (pathname !== prevPathname) this._requestProduct();
        this._onProductUpdate();
    }


    componentWillUnmount() {
        const {product: {type_id}, clearGroupedProductQuantity} = this.props;

        if (type_id === 'grouped') return clearGroupedProductQuantity();

        return null;
    }

    static getDerivedStateFromProps(props) {
        const {
            product: {
                variants,
                configurable_options
            },
            location: {search}
        } = props;

        if (!configurable_options && !variants) return null;

        const parameters = Object.entries(convertQueryStringToKeyValuePairs(search))
            .reduce((acc, [key, value]) => {
                if (key in configurable_options) {
                    return {...acc, [key]: value};
                }

                return acc;
            }, {});

        if (Object.keys(parameters).length !== Object.keys(configurable_options).length) {
            return {parameters};
        }

        const configurableVariantIndex = getVariantIndex(variants, parameters);
        return {parameters, configurableVariantIndex};
    }

    getLink(key, value) {
        const {location: {search, pathname}} = this.props;
        const query = objectToUri({
            ...convertQueryStringToKeyValuePairs(search),
            [key]: value
        });

        return `${pathname}${query}`;
    }

    getIsConfigurableParameterSelected(parameters, key, value) {
        return Object.hasOwnProperty.call(parameters, key) && parameters[key] === value;
    }

    getNewParameters(key, value) {
        const {parameters} = this.state;

        // If value is already selected, than we remove the key to achieve deselection
        if (this.getIsConfigurableParameterSelected(parameters, key, value)) {
            const {[key]: oldValue, ...newParameters} = parameters;

            return newParameters;
        }

        return {
            ...parameters,
            [key]: value.toString()
        };
    }

    containerProps = () => ({
        productOrVariant: this._getProductOrVariant(),
        dataSource: this._getDataSource(),
        thumbnail: this._getProductThumbnail(),
        areDetailsLoaded: this._getAreDetailsLoaded()
    });

    _getProductThumbnail() {
        const product = this._getProductOrVariant();
        const {thumbnail: {path: thumbnail} = {}} = product;

        return thumbnail
            ? `/media/catalog/product${thumbnail}`
            : '';
    }

    updateConfigurableVariant(key, value) {
        const parameters = this.getNewParameters(key, value);
        this.setState({parameters});

        this.updateUrl(key, value, parameters);
        this.updateConfigurableVariantIndex(parameters);
    }

    updateUrl(key, value, parameters) {
        const {location, history} = this.props;

        const isParameterSelected = this.getIsConfigurableParameterSelected(parameters, key, value);

        if (isParameterSelected) {
            updateQueryParamWithoutHistory(key, value, history, location);
        } else {
            removeQueryParamWithoutHistory(key, history, location);
        }
    }

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

    _onProductUpdate() {
        const dataSource = this._getDataSource();

        if (Object.keys(dataSource).length) {
            this._updateBreadcrumbs(dataSource);
            this._updateHeaderState(dataSource);
        }
    }

    _getAreDetailsLoaded() {
        const {product} = this.props;
        return this._getDataSource() === product;
    }

    _getProductOrVariant() {
        const dataSource = this._getDataSource();
        const {variants} = dataSource;
        const currentVariantIndex = this._getConfigurableVariantIndex(variants);
        const variant = variants && variants[currentVariantIndex];
        return variant || dataSource;
    }

    _getConfigurableVariantIndex(variants) {
        const {configurableVariantIndex, parameters} = this.state;

        if (configurableVariantIndex >= 0) return configurableVariantIndex;
        if (variants) return getVariantIndex(variants, parameters);

        return -1;
    }

    _getDataSource() {
        const {product, location: {state}} = this.props;
        const productIsLoaded = Object.keys(product).length > 0;
        const locationStateExists = state && Object.keys(state.product).length > 0;

        // return nothing, if no product in url state and no loaded product
        if (!locationStateExists && !productIsLoaded) return {};

        // use product from props, if product is loaded and state does not exist, or state product is equal loaded product
        const useLoadedProduct = productIsLoaded && (
            (locationStateExists && (product.id === state.product.id))
            || !locationStateExists
        );

        return useLoadedProduct ? product : state.product;
    }

    requestRewrite() {
        const {requestUrlRewrite, match, location} = this.props;
        const urlParam = getUrlParam(match, location);
        requestUrlRewrite({urlParam}).then(() => this._requestProduct());
    }

    _requestProduct() {
        const {requestProduct, location, match, urlRewrite} = this.props;
        const {urlParam, url_key} = urlRewrite;
        if (urlParam !== getUrlParam(match, location)) {
            this.requestRewrite();
            return false
        }
        const options = {
            isSingleProduct: true,
            args: {
                filter: {
                    productUrlPath: url_key
                }
            }
        };

        this.setState({isConfigurationInitialized: false});
        requestProduct(options);
    }

    _updateHeaderState({name: title}) {
        const {changeHeaderState} = this.props;

        changeHeaderState({
            name: PDP,
            title,
            onBackClick: () => history.goBack()
        });
    }

    _updateBreadcrumbs(dataSource) {
        const {updateBreadcrumbs} = this.props;
        updateBreadcrumbs(dataSource);
    }

    render() {
        return (
            <ProductPage
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
                {...this.containerProps()}
            />
        );
    }
}

const ProductPageContainerWrapper = connect(mapStateToProps, mapDispatchToProps)(ProductPageContainer);
export default withRouter(ProductPageContainerWrapper);
