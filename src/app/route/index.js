/* eslint-disable no-console */
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

import {PureComponent, cloneElement} from 'react';

import {Route, Switch} from 'react-router-dom';
import {Router} from 'react-router';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createBrowserHistory} from 'history';

import CategoryPage from 'Route/CategoryPage';
import SearchPage from 'Route/SearchPage';
import ProductPage from 'Route/ProductPage';
import CmsPage from 'Route/CmsPage';
import CartPage from 'Route/CartPage';
import MyAccount from 'Route/MyAccount';
import Checkout from 'Route/Checkout';
import {MagefanBlog, MagefanBlogPost} from 'Modules/MagefanBlog'
import PasswordChangePage from 'Route/PasswordChangePage';
import NoMatchHandler from 'Route/NoMatchHandler';
import UrlRewrites from 'Route/UrlRewrites';

import Header from 'Component/Header';
import Footer from 'Component/Footer';
import Breadcrumbs from 'Component/Breadcrumbs';
import NotificationList from 'Component/NotificationList';

import Store from 'Store';

import {HeaderAndFooterDispatcher} from 'Store/HeaderAndFooter';
import {ConfigDispatcher} from 'Store/Config';
import {CartDispatcher} from 'Store/Cart';
import {WishlistDispatcher} from 'Store/Wishlist';
import SomethingWentWrong from 'Route/SomethingWentWrong';
import {Resize} from "redux-resize-props";
import {connect} from "react-redux";
import HomePage from "Route/HomePage";
import LoginPage from "Route/LoginPage";

export const BEFORE_ITEMS_TYPE = 'BEFORE_ITEMS_TYPE';
export const SWITCH_ITEMS_TYPE = 'SWITCH_ITEMS_TYPE';
export const AFTER_ITEMS_TYPE = 'AFTER_ITEMS_TYPE';

export const history = createBrowserHistory({basename: '/'});

class AppRouter extends PureComponent {
    [BEFORE_ITEMS_TYPE] = [
        {
            component: <NotificationList/>,
            position: 10
        },
        {
            component: <Header/>,
            position: 20
        },
        {
            component: <Breadcrumbs/>,
            position: 30
        }
    ];

    [SWITCH_ITEMS_TYPE] = [
        {
            component: <Route path="/" exact component={HomePage}/>,
            position: 10
        },
        {
            component: <Route path="/category" component={CategoryPage}/>,
            position: 20
        },
        {
            component: <Route path="/search/:query/" component={SearchPage}/>,
            position: 25
        },
        {
            component: <Route path="/blog" component={MagefanBlog}/>,
            position: 42
        },
        {
            component: <Route path="/post" component={MagefanBlogPost}/>,
            position: 43
        },
        {
            component: <Route path="/cart" exact component={CartPage}/>,
            position: 50
        },
        {
            component: <Route path="/checkout/:step?" component={Checkout}/>,
            position: 55
        },
        {
            component: <Route path="/login" component={LoginPage}/>,
            position: 59
        },
        {
            component: <Route path="/:account*/createPassword/" component={PasswordChangePage}/>,
            position: 60
        },
        {
            component: <Route path="/my-account/:tab?" component={MyAccount}/>,
            position: 70
        },
        {
            component: <Route component={UrlRewrites}/>,
            position: 1000
        }
    ];

    [AFTER_ITEMS_TYPE] = [
        {
            component: <Footer/>,
            position: 10
        }
    ];

    state = {
        hasError: false,
        errorDetails: {}
    };

    constructor(props) {
        super(props);

        this.dispatchActions();
        Resize(props.dispatch, [{
            mode: 'mobile',
            width: 767
        }, {
            mode: 'tablet',
            width: 1024
        }])
    }

    getHeaderAndFooterOptions() {
        return {
            menu: {identifier: 'menu-main'},
            footer: {identifiers: ['header-top-sale-link', 'footer-bottom', 'header-top-menu', 'social-links']}
        };
    }

    getSortedItems(type) {
        const items = this[type].reduce((acc, {component, position}) => {
            if (!component) {
                console.warn('There is an item without a component property declared in main router.');
                return acc;
            }

            if (acc[position]) {
                console.warn(`There is already an item with ${position} declared in main router.`);
                return acc;
            }

            return {...acc, [position]: component};
        }, {});

        return items;
    }

    handleErrorReset = () => {
        this.setState({hasError: false});
    };

    componentDidCatch(err, info) {
        this.setState({
            hasError: true,
            errorDetails: {err, info}
        });
    }

    dispatchActions() {
        WishlistDispatcher.updateInitialWishlistData(Store.dispatch);
        CartDispatcher.updateInitialCartData(Store.dispatch);
        ConfigDispatcher.handleData(Store.dispatch);
        HeaderAndFooterDispatcher.handleData(Store.dispatch, this.getHeaderAndFooterOptions());
    }

    renderItemsOfType(type) {
        return Object.entries(this.getSortedItems(type)).map(
            ([key, component]) => cloneElement(component, {key})
        );
    }

    renderErrorRouterContent() {
        const {errorDetails} = this.state;

        return (
            <SomethingWentWrong
                onClick={this.handleErrorReset}
                errorDetails={errorDetails}
            />
        );
    }

    renderDefaultRouterContent() {
        return (
            <>
                {this.renderItemsOfType(BEFORE_ITEMS_TYPE)}
                <NoMatchHandler>
                    <Switch>
                        {this.renderItemsOfType(SWITCH_ITEMS_TYPE)}
                    </Switch>
                </NoMatchHandler>
                {this.renderItemsOfType(AFTER_ITEMS_TYPE)}
            </>
        );
    }

    renderRouterContent() {
        const {hasError} = this.state;
        if (hasError) return this.renderErrorRouterContent();
        return this.renderDefaultRouterContent();
    }

    render() {
        return (
            <Router history={history}>
                {this.renderRouterContent()}
            </Router>
        );
    }
}

AppRouter = connect()(AppRouter);
export default AppRouter;
