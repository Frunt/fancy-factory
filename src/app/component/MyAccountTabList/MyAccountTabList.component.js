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
import {activeTabType, tabMapType} from 'Type/Account';
import MyAccountTabListItem from 'Component/MyAccountTabListItem';
import './MyAccountTabList.style';
import isMobile from "Util/Mobile";
import {HeaderTopComponent} from "Component/Header/HeaderTop.component";

class MyAccountTabList extends PureComponent {
    static propTypes = {
        tabMap: tabMapType.isRequired,
        activeTab: activeTabType.isRequired,
        logout: PropTypes.func.isRequired,
        changeActiveTab: PropTypes.func.isRequired
    };

    state = {
        isContentExpanded: true
    };

    toggleExpandableContent = () => {
        this.setState(({isContentExpanded}) => ({isContentExpanded: !isContentExpanded}));
    };

    onTabClick = (key) => {
        const {changeActiveTab} = this.props;
        // this.toggleExpandableContent();
        changeActiveTab(key);
    };

    renderTabListItem = (tabEntry) => {
        const {activeTab} = this.props;
        const [key] = tabEntry;

        return (
            <MyAccountTabListItem
                key={key}
                isActive={activeTab === key}
                changeActiveTab={this.onTabClick}
                tabEntry={tabEntry}
            />
        );
    };

    renderLogoutTab() {
        const {logout} = this.props;

        return (
            <li
                key="logout"
                block="MyAccountTabListItem"
            >
                <button
                    block="MyAccountTabListItem"
                    elem="Button"
                    onClick={logout}
                    role="link"
                >
                    {__('Logout')}
                </button>
            </li>
        );
    }

    render() {
        const {tabMap, isVisible, toggleMenu, windowSize} = this.props;

        const tabs = [
            ...Object.entries(tabMap).map(this.renderTabListItem),
            this.renderLogoutTab()
        ];

        const isNoDesktop = windowSize !== 'desktop';

        return (
            <div
                heading={__('Account')}
                mix={{block: 'MyAccountTabList', mods: {isVisible: isVisible}}}
            >
                <div
                    block="MyAccountTabList"
                    elem="Heading"
                >
                    {__('Account')}
                    {isMobile.any() && <span block="MyAccountTabList" elem="Close" onClick={() => toggleMenu()}/>}
                </div>
                <ul>
                    {tabs}
                </ul>
                {isNoDesktop && <HeaderTopComponent hideTopMenu={true}/>}
            </div>
        );
    }
}

export default MyAccountTabList;
