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

import {
    createStore, combineReducers, applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';
import {CmsBlocksAndSliderReducer} from 'Store/CmsBlocksAndSlider';
import {CmsPageReducer} from 'Store/CmsPage';
import {CategoryReducer} from 'Store/Category';
import {NotificationReducer} from 'Store/Notification';
import {BreadcrumbsReducer} from 'Store/Breadcrumbs';
import {ProductReducer} from 'Store/Product';
import {ProductListReducer} from 'Store/ProductList';
import {ProductListInfoReducer} from 'Store/ProductListInfo';
import {HeaderAndFooterReducer} from 'Store/HeaderAndFooter';
import {CartReducer} from 'Store/Cart';
import {WishlistReducer} from 'Store/Wishlist';
import {NoMatchReducer} from 'Store/NoMatch';
import {RelatedProductsReducer} from 'Store/RelatedProducts';
import {SearchBarReducer} from 'Store/SearchBar';
import {UrlRewritesReducer} from 'Store/UrlRewrites';
import {MyAccountReducer} from 'Store/MyAccount';
import {HeaderReducer} from 'Store/Header';
import {OverlayReducer} from 'Store/Overlay';
import {PopupReducer} from 'Store/Popup';
import {ConfigReducer} from 'Store/Config';
import {ResizeReducer} from "redux-resize-props";
import {StoreDataReducer} from "Store/StoreData";
import SubscribeReducer from "Store/Subscribe/Subscribe.reducer";
import {NovaPoshtaReducer} from "Modules/NovaPoshta";
import {OrderReducer} from "Store/Order";
import {MagefanBlogCategoryReducer, BlogListReducer, PostReducer} from "Modules/MagefanBlog";

export const reducers = {
    CmsBlocksAndSliderReducer,
    CmsPageReducer,
    CategoryReducer,
    NotificationReducer,
    BreadcrumbsReducer,
    ProductReducer,
    ProductListReducer,
    ProductListInfoReducer,
    HeaderAndFooterReducer,
    CartReducer,
    WishlistReducer,
    NoMatchReducer,
    RelatedProductsReducer,
    SearchBarReducer,
    MyAccountReducer,
    HeaderReducer,
    OverlayReducer,
    PopupReducer,
    UrlRewritesReducer,
    ResizeReducer,
    ConfigReducer,
    StoreDataReducer,
    SubscribeReducer,
    NovaPoshtaReducer,
    OrderReducer,
    BlogListReducer,
    MagefanBlogCategoryReducer,
    PostReducer
};

const store = createStore(
    combineReducers(reducers),
    applyMiddleware(thunk)
);

export default store;
