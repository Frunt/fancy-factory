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
import MyAccountDashboard from 'Component/MyAccountDashboard';
import MyAccountMyOrders from 'Component/MyAccountMyOrders';
import MyAccountMyWishlist from 'Component/MyAccountMyWishlist';
import MyAccountAddressBook from 'Component/MyAccountAddressBook';
import MyAccountNeedHelp from "Component/MyAccountNeedHelp";
import MyAccountTabList from 'Component/MyAccountTabList';
import ContentWrapper from 'Component/ContentWrapper';
import Meta from 'Component/Meta';
import {
    activeTabType,
    tabMapType,
    DASHBOARD,
    MY_ORDERS,
    MY_WISHLIST,
    ADDRESS_BOOK,
    NEED_HELP
} from 'Type/Account';

import './MyAccount.style';
import isMobile from "Util/Mobile";

class MyAccount extends PureComponent {
    static propTypes = {
        activeTab: activeTabType.isRequired,
        tabMap: tabMapType.isRequired,
        changeActiveTab: PropTypes.func.isRequired
    };

    renderMap = {
        [DASHBOARD]: MyAccountDashboard,
        [MY_ORDERS]: MyAccountMyOrders,
        [MY_WISHLIST]: MyAccountMyWishlist,
        [NEED_HELP]: MyAccountNeedHelp,
        [ADDRESS_BOOK]: MyAccountAddressBook
    };

    render() {
        const {
            activeTab,
            tabMap,
            changeActiveTab,
            toggleMenu,
            menuOpen,
            toggleBackVisibility,
            backIsHidden,
            windowSize
        } = this.props;
        const TabContent = this.renderMap[activeTab];
        const {name} = tabMap[activeTab];
        const desktop = windowSize === 'desktop';

        return (
            <main block="MyAccount">
                <Meta metaObject={{title: 'My Account'}}/>
                <ContentWrapper
                    label={__('My Account page')}
                    wrapperMix={{block: 'MyAccount', elem: 'Wrapper'}}
                >
                    <MyAccountTabList
                        tabMap={tabMap}
                        activeTab={activeTab}
                        changeActiveTab={changeActiveTab}
                        isVisible={!!menuOpen}
                        toggleMenu={toggleMenu}
                    />
                    <div block="MyAccount" elem="TabContent">
                        <h1 block="MyAccount" elem="Heading">{name}</h1>
                        {(!desktop && !backIsHidden) && <div className="MyAccount-PrevButton button-prev" onClick={toggleMenu}>{__('Back')}</div>}
                        <TabContent toggleBackVisibility={toggleBackVisibility}/>
                    </div>
                </ContentWrapper>
            </main>
        );
    }
}

export default MyAccount;
