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
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {history} from 'Route';
import {changeHeaderState, goToPreviousHeaderState} from 'Store/Header';
import {toggleOverlayByKey, hideActiveOverlay} from 'Store/Overlay';
import {setQueryParams} from 'Util/Url';
import {isSignedIn} from 'Util/Auth';
import isMobile from 'Util/Mobile';
import Header, {
    PDP,
    CATEGORY,
    CUSTOMER_ACCOUNT,
    HOME_PAGE,
    MENU,
    MENU_SUBCATEGORY,
    SEARCH,
    CART,
    CMS_PAGE,
    FILTER,
    CART_EDITING,
    CHECKOUT,
    CUSTOMER_ACCOUNT_PAGE,
    POPUP, CUSTOMER_ACCOUNT_PAGE_MENU
} from './Header.component';
import {MyAccountDispatcher} from "Store/MyAccount";
import {MY_ACCOUNT_URL} from "Route/MyAccount/MyAccount.container";

export const mapStateToProps = state => ({
    headerState: state.HeaderReducer.headerState,
    logoSrc: state.ConfigReducer.header_logo_src,
    storeInformation: state.ConfigReducer.storeInformation,
    cartTotals: state.CartReducer.cartTotals,
    windowSize: state.ResizeReducer.windowSize,
    isSignedIn: state.MyAccountReducer.isSignedIn
});

export const mapDispatchToProps = dispatch => ({
    showOverlay: overlayKey => dispatch(toggleOverlayByKey(overlayKey)),
    hideActiveOverlay: () => dispatch(hideActiveOverlay()),
    setHeaderState: stateName => dispatch(changeHeaderState(stateName)),
    goToPreviousHeaderState: () => dispatch(goToPreviousHeaderState()),
    logout: () => MyAccountDispatcher.logout(null, dispatch)
});

export class HeaderContainer extends PureComponent {
    static propTypes = {
        showOverlay: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
        headerState: PropTypes.shape({
            name: PropTypes.oneOf([
                PDP,
                CATEGORY,
                CUSTOMER_ACCOUNT,
                CUSTOMER_ACCOUNT_PAGE,
                CUSTOMER_ACCOUNT_PAGE_MENU,
                HOME_PAGE,
                MENU,
                MENU_SUBCATEGORY,
                SEARCH,
                FILTER,
                CART,
                CART_EDITING,
                CHECKOUT,
                CMS_PAGE,
                POPUP
            ]),
            title: PropTypes.string,
            onBackClick: PropTypes.func,
            onCloseClick: PropTypes.func,
            onEditClick: PropTypes.func,
            onOkClick: PropTypes.func,
            onCancelClick: PropTypes.func
        }).isRequired
    };

    state = {
        prevPathname: '',
        searchCriteria: '',
        isClearEnabled: false
    };

    routeMap = {
        '/': {name: HOME_PAGE},
        '/category': {name: CATEGORY, onBackClick: () => history.push('/')},
        '/my-account': {name: CUSTOMER_ACCOUNT_PAGE, onBackClick: () => history.push('/')},
        '/product': {name: PDP, onBackClick: () => history.goBack()},
        '/cart': {name: CART},
        '/page': {name: CMS_PAGE, onBackClick: () => history.goBack()}
    };

    containerFunctions = {
        onBackButtonClick: this.onBackButtonClick.bind(this),
        onCloseButtonClick: this.onCloseButtonClick.bind(this),
        onSearchBarClick: this.onSearchBarClick.bind(this),
        onMenuButtonClick: this.onMenuButtonClick.bind(this),
        onClearSearchButtonClick: this.onClearSearchButtonClick.bind(this),
        onMyAccountButtonClick: this.onMyAccountButtonClick.bind(this),
        onSearchBarChange: this.onSearchBarChange.bind(this),
        onClearButtonClick: this.onClearButtonClick.bind(this),
        onEditButtonClick: this.onEditButtonClick.bind(this),
        onMinicartButtonClick: this.onMinicartButtonClick.bind(this),
        onOkButtonClick: this.onOkButtonClick.bind(this),
        onCancelButtonClick: this.onCancelButtonClick.bind(this),
        onSearchOutsideClick: this.onSearchOutsideClick.bind(this),
        onMenuOutsideClick: this.onMenuOutsideClick.bind(this),
        onMinicartOutsideClick: this.onMinicartOutsideClick.bind(this),
        onSearchButtonClick: this.onSearchButtonClick.bind(this)
    };

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            ...this.onRouteChanged(history.location, true)
        };
    }

    componentDidMount() {
        history.listen(history => this.setState(this.onRouteChanged(history)));
    }

    onRouteChanged(history, isPrevPathnameNotRelevant = false) {
        const newState = {};

        const {
            prevPathname
        } = this.state;

        const {
            hideActiveOverlay,
            setHeaderState,
            headerState: {name}
        } = this.props;

        const {pathname, search} = history;

        if (!isMobile.any()) {
            setHeaderState(this.routeMap['/']);
            hideActiveOverlay();

            return {};
        }

        newState.isClearEnabled = new RegExp(['customFilters', 'priceMax', 'priceMin'].join('|')).test(search);

        if ((isPrevPathnameNotRelevant || prevPathname !== pathname)) {
            const newHeaderState = Object.keys(this.routeMap).reduce(
                (state, route) => ((pathname.includes(route))
                        ? this.routeMap[route]
                        : state
                ), {name: HOME_PAGE}
            );

            if (name !== newHeaderState.name) {
                setHeaderState(newHeaderState);
            }

            hideActiveOverlay();

            newState.prevPathname = pathname;
        }

        return newState;
    }

    onBackButtonClick() {
        const {headerState: {onBackClick}} = this.props;

        this.setState({searchCriteria: ''});

        if (onBackClick) onBackClick();
    }

    onCloseButtonClick() {
        const {hideActiveOverlay, goToPreviousHeaderState} = this.props;
        const {headerState: {onCloseClick}} = this.props;

        this.setState({searchCriteria: ''});

        if (onCloseClick) onCloseClick();

        hideActiveOverlay();
        goToPreviousHeaderState();
    }

    onSearchOutsideClick() {
        const {goToPreviousHeaderState, hideActiveOverlay, headerState: {name}} = this.props;

        if (name === SEARCH) {
            this.setState({searchCriteria: ''});

            hideActiveOverlay();
            goToPreviousHeaderState();
        }
    }

    onSearchButtonClick() {
        const {
            history
        } = this.props;
        history.push({pathname: `/search/${this.state.searchCriteria}`})
    }

    onSearchBarClick() {
        const {
            setHeaderState,
            goToPreviousHeaderState,
            showOverlay,
            headerState: {name}
        } = this.props;

        if (name === SEARCH) return;

        showOverlay(SEARCH);

        setHeaderState({
            name: SEARCH,
            onBackClick: () => {
                showOverlay(MENU);
                goToPreviousHeaderState();
            }
        });
    }

    onSearchBarChange({target: {value: searchCriteria}}) {
        this.setState({searchCriteria});
    }

    onClearSearchButtonClick() {
        this.setState({searchCriteria: ''});
    }

    onMenuButtonClick() {
        const {showOverlay, setHeaderState, headerState: {name}} = this.props;

        if (name !== MENU) {
            showOverlay(MENU);
            setHeaderState({name: MENU});
        }
    }

    onMenuOutsideClick() {
        const {goToPreviousHeaderState, hideActiveOverlay, headerState: {name}} = this.props;

        if (isMobile.any()) return;

        if (name === MENU || name === MENU_SUBCATEGORY) {
            if (name === MENU_SUBCATEGORY) goToPreviousHeaderState();
            goToPreviousHeaderState();
            hideActiveOverlay();
        }
    }

    onMyAccountButtonClick(e, state) {
        const {
            history
        } = this.props;

        if (isSignedIn() && !isMobile.any()) return;

        if (isSignedIn() && isMobile.any()) {
            history.push('/my-account/dashboard')
            return;
        }

        history.push({pathname: '/login', state: state})
    }

    onClearButtonClick() {
        setQueryParams({customFilters: '', priceMax: '', priceMin: ''}, history.location, history);
        this.setState({isClearEnabled: false});
    }

    onMinicartButtonClick() {
        const {cartTotals: {items_qty}} = this.props;

        if (!items_qty) return null

        return history.push('/cart');
    }

    onMinicartOutsideClick() {
        const {goToPreviousHeaderState, hideActiveOverlay, headerState: {name}} = this.props;

        if (isMobile.any() || name !== CART) return;

        goToPreviousHeaderState();
        hideActiveOverlay();
    }

    onEditButtonClick() {
        const {headerState: {onEditClick}} = this.props;

        if (onEditClick) onEditClick();
    }

    onOkButtonClick() {
        const {headerState: {onOkClick}, goToPreviousHeaderState} = this.props;

        if (onOkClick) onOkClick();
        goToPreviousHeaderState();
    }

    onCancelButtonClick() {
        const {headerState: {onCancelClick}, goToPreviousHeaderState} = this.props;

        if (onCancelClick) onCancelClick();
        goToPreviousHeaderState();
    }

    render() {
        return (
            <Header
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderContainer));
