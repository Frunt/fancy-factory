/* eslint-disable max-len */

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

import React, {PureComponent, Fragment, createRef} from 'react';
import PropTypes from 'prop-types';
import { isSignedIn } from 'Util/Auth';

import Link from 'Component/Link';
import MenuOverlay from 'Component/MenuOverlay';
import SearchOverlay from 'Component/SearchOverlay';
import ClickOutside from 'Component/ClickOutside';
import {TotalsType} from 'Type/MiniCart';
import './Header.style';
import CmsBlock from "Component/CmsBlock";
import {HeaderTopComponent} from "Component/Header/HeaderTop.component";
import ContentWrapper from "Component/ContentWrapper";
import Image from "Component/Image/Image.component";
import {STATE_CREATE_ACCOUNT} from "Component/MyAccountOverlay/MyAccountOverlay.component";
import {NavLink} from "react-router-dom";
import {DASHBOARD, MY_ORDERS} from "Type/Account";
import isMobile from "Util/Mobile";


export const PDP = 'pdp';
export const POPUP = 'popup';
export const CATEGORY = 'category';
export const CUSTOMER_ACCOUNT = 'customer_account';
export const CUSTOMER_ACCOUNT_PAGE = 'customer_account_page';
export const CUSTOMER_ACCOUNT_PAGE_MENU = 'customer_account_page_menu';
export const HOME_PAGE = 'home';
export const MENU = 'menu';
export const MENU_SUBCATEGORY = 'menu_subcategory';
export const SEARCH = 'search';
export const FILTER = 'filter';
export const CART = 'cart';
export const CART_EDITING = 'cart_editing';
export const CHECKOUT = 'checkout';
export const CMS_PAGE = 'cms-page';

export default class Header extends PureComponent {
    static propTypes = {
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
        }).isRequired,
        cartTotals: TotalsType.isRequired,
        onBackButtonClick: PropTypes.func.isRequired,
        onCloseButtonClick: PropTypes.func.isRequired,
        onSearchBarClick: PropTypes.func.isRequired,
        onMenuButtonClick: PropTypes.func.isRequired,
        onClearSearchButtonClick: PropTypes.func.isRequired,
        onMyAccountButtonClick: PropTypes.func.isRequired,
        onSearchBarChange: PropTypes.func.isRequired,
        onClearButtonClick: PropTypes.func.isRequired,
        onEditButtonClick: PropTypes.func.isRequired,
        onMinicartButtonClick: PropTypes.func.isRequired,
        onOkButtonClick: PropTypes.func.isRequired,
        onCancelButtonClick: PropTypes.func.isRequired,
        onSearchOutsideClick: PropTypes.func.isRequired,
        onMenuOutsideClick: PropTypes.func.isRequired,
        onMinicartOutsideClick: PropTypes.func.isRequired,
        isClearEnabled: PropTypes.bool.isRequired,
        searchCriteria: PropTypes.string.isRequired
    };

    stateMap = {
        [HOME_PAGE]: {
            logo: true,
            contacts: true,
            search: true,
            account: true,
            minicart: true
        }
    }

    stateMobileMap = {
        [MENU]: {
            logo: true,
            contacts: true,
            close: true,
            menu: true
        },
        [HOME_PAGE]: {
            logo: true,
            search: true,
            account: true,
            minicart: true,
            menu: true
        }
    };

    renderMap = {
        // cancel: this.renderCancelButton.bind(this),
        // back: this.renderBackButton.bind(this),
        // close: this.renderCloseButton.bind(this),
        // menu: this.renderMenuButton.bind(this),
        logo: this.renderLogo.bind(this),
        contacts: this.renderContacts.bind(this),
        search: this.renderSearchField.bind(this),
        // title: this.renderTitle.bind(this),
        account: this.renderAccountButton.bind(this),
        minicart: this.renderMinicartButton.bind(this),
        // clear: this.renderClearButton.bind(this),
        // edit: this.renderEditButton.bind(this),
        // ok: this.renderOkButton.bind(this)
    };


    renderMapMobile = {
        logo: this.renderLogo.bind(this),
        contacts: this.renderContacts.bind(this),
        search: this.renderSearchField.bind(this),
        account: this.renderAccountButton.bind(this),
        minicart: this.renderMinicartButton.bind(this),
        close: this.renderCloseButton.bind(this),
        menu: this.renderMenuButton.bind(this)
    }

    searchBarRef = createRef();

    onClearSearchButtonClick = this.onClearSearchButtonClick.bind(this);

    onClearSearchButtonClick() {
        const {onClearSearchButtonClick} = this.props;
        this.searchBarRef.current.focus();
        onClearSearchButtonClick();
    }

    renderBackButton(isVisible = false) {
        const {onBackButtonClick} = this.props;

        return (
            <button
                key="back"
                block="Header"
                elem="Button"
                mods={{type: 'back', isVisible}}
                onClick={onBackButtonClick}
                aria-label="Go back"
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
            />
        );
    }

    renderCloseButton(isVisible = false) {
        const {onCloseButtonClick} = this.props;


        return (
            <button
                key="close"
                block="Header"
                elem="Button"
                mods={{type: 'close', isVisible}}
                onClick={onCloseButtonClick}
                aria-label="Close"
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
            />
        );
    }

    renderMobileLogin() {
        const {onMyAccountButtonClick} = this.props;
        const state = STATE_CREATE_ACCOUNT;

        return (
            <div
                block="Header"
                elem="MobLoginBtns"
            >
                <button
                    block="Header"
                    elem="Button"
                    mods={{type: 'mobLogin'}}
                    onClick={e => onMyAccountButtonClick(e, state)}
                >
                    {__('Registration')}
                </button>
                <button
                    block="Header"
                    elem="Button"
                    mods={{type: 'mobLogin'}}
                    onClick={onMyAccountButtonClick}
                >
                    {__('Login')}
                </button>
            </div>
        )
    }

    renderMobileMenu() {

        return (
            <div
                block="Header"
                elem="MobileMenu"
            >
                <MenuOverlay/>
                {this.renderMobileLogin()}
                <HeaderTopComponent/>
            </div>
        )
    }

    renderMenuButton(isVisible = false) {
        const {onMenuOutsideClick, onMenuButtonClick} = this.props;

        return (
            <ClickOutside onClick={onMenuOutsideClick} key="menu">
                <div block="Header" elem="MenuWrapper">
                    <button
                        block="Header"
                        elem="Button"
                        mods={{isVisible, type: 'menu'}}
                        aria-label="Go to menu and search"
                        aria-hidden={!isVisible}
                        tabIndex={isVisible ? 0 : -1}
                        onClick={onMenuButtonClick}
                    />
                    {/*<MenuOverlay />*/}
                    {this.renderMobileMenu()}
                </div>
            </ClickOutside>
        );
    }

    renderSearchToggler() {
        const {onSearchBarClick} = this.props;

        return (
            <button
                key="searchToggle"
                block="Header"
                elem="Button"
                mods={{
                    type: 'searchToggle'
                }}
                onClick={onSearchBarClick}
            >
                <svg width="21" height="20" viewBox="0 0 21 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M20.7429 18.5796L15.6943 13.7714C16.9457 12.3184 17.7 10.4571 17.7 8.42857C17.7 3.77551 13.7357 0 8.85 0C3.96 0 0 3.77551 0 8.42857C0 13.0816 3.96 16.8571 8.85 16.8571C10.98 16.8571 12.93 16.1429 14.4557 14.951L19.5043 19.7551C19.8471 20.0816 20.4 20.0816 20.7429 19.7551C21.0857 19.4327 21.0857 18.902 20.7429 18.5796ZM8.85 15.1796C4.93714 15.1796 1.75714 12.151 1.75714 8.42857C1.75714 4.70612 4.93714 1.67347 8.85 1.67347C12.7586 1.67347 15.9429 4.70612 15.9429 8.42857C15.9429 12.151 12.7586 15.1796 8.85 15.1796Z"
                    />
                </svg>
            </button>
        )
    }

    renderSearchField(isSearchVisible = false) {
        const {
            searchCriteria, onSearchOutsideClick,
            onSearchBarClick, onSearchBarChange,
            onSearchButtonClick,
            windowSize
        } = this.props;

        return (
            <Fragment key="search">
                <ClickOutside onClick={onSearchOutsideClick}>
                    <button
                        block="Header"
                        elem="Button"
                        mods={{
                            type: 'searchToggle'
                        }}
                        onClick={onSearchBarClick}
                    >
                        <svg width="21" height="20" viewBox="0 0 21 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M20.7429 18.5796L15.6943 13.7714C16.9457 12.3184 17.7 10.4571 17.7 8.42857C17.7 3.77551 13.7357 0 8.85 0C3.96 0 0 3.77551 0 8.42857C0 13.0816 3.96 16.8571 8.85 16.8571C10.98 16.8571 12.93 16.1429 14.4557 14.951L19.5043 19.7551C19.8471 20.0816 20.4 20.0816 20.7429 19.7551C21.0857 19.4327 21.0857 18.902 20.7429 18.5796ZM8.85 15.1796C4.93714 15.1796 1.75714 12.151 1.75714 8.42857C1.75714 4.70612 4.93714 1.67347 8.85 1.67347C12.7586 1.67347 15.9429 4.70612 15.9429 8.42857C15.9429 12.151 12.7586 15.1796 8.85 15.1796Z"
                            />
                        </svg>
                    </button>
                    <div
                        block="Header"
                        elem="SearchWrapper"
                        aria-label="Search"
                    >
                        <button
                            onClick={onSearchOutsideClick}
                            block="Header"
                            elem="Button"
                            mods={{
                                type: 'searchClose'
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M1 1L19 19" stroke="#1E1E1E" strokeWidth="3"/>
                                <path d="M1 19L19 1" stroke="#1E1E1E" strokeWidth="3"/>
                            </svg>
                        </button>
                        <input
                            id="search-field"
                            ref={this.searchBarRef}
                            placeholder={__("Type a new search")}
                            block="Header"
                            elem="SearchField"
                            onClick={onSearchBarClick}
                            onChange={onSearchBarChange}
                            value={searchCriteria}
                            mods={{
                                isVisible: isSearchVisible,
                                type: 'searchField'
                            }}
                        />
                        <button
                            block={"Header"}
                            elem={"Button"}
                            onClick={onSearchButtonClick}
                            mods={{
                                type: 'searchBtn'
                            }}
                        >
                            <svg width="21" height="20" viewBox="0 0 21 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20.7429 18.5796L15.6943 13.7714C16.9457 12.3184 17.7 10.4571 17.7 8.42857C17.7 3.77551 13.7357 0 8.85 0C3.96 0 0 3.77551 0 8.42857C0 13.0816 3.96 16.8571 8.85 16.8571C10.98 16.8571 12.93 16.1429 14.4557 14.951L19.5043 19.7551C19.8471 20.0816 20.4 20.0816 20.7429 19.7551C21.0857 19.4327 21.0857 18.902 20.7429 18.5796ZM8.85 15.1796C4.93714 15.1796 1.75714 12.151 1.75714 8.42857C1.75714 4.70612 4.93714 1.67347 8.85 1.67347C12.7586 1.67347 15.9429 4.70612 15.9429 8.42857C15.9429 12.151 12.7586 15.1796 8.85 15.1796Z"
                                />
                            </svg>
                        </button>
                        <SearchOverlay
                            searchCriteria={searchCriteria}
                        />
                    </div>
                </ClickOutside>
            </Fragment>
        );
    }

    renderTitle(isVisible = false) {
        const {headerState: {title}} = this.props;

        return (
            <h2
                key="title"
                block="Header"
                elem="Title"
                mods={{isVisible}}
            >
                {title}
            </h2>
        );
    }

    renderLogo(isVisible = false) {
        const {logoSrc} = this.props;

        return (
            logoSrc && <Link
                to="/"
                aria-label="Go to homepage by clicking on Fancy Factory logo"
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
                block="Header"
                elem="Logo"
                mods={{isVisible}}
                key="logo"
                itemScope
                itemType="http://schema.org/Organization"
            >
                <Image src={'/media/logo/' + logoSrc} wrapperSize={{height: '114px'}} ratio={'16x9'}
                       alt="Fancy Factory"/>
            </Link>
        );
    }

    renderMyAccountLinks() {
        const {isSignedIn, logout} = this.props;
        if (!isSignedIn || isMobile.any()) return null;
        return (
            <ul className={'MyAccount-actions-dropdown'}>
                <li><NavLink to={`/my-account/${DASHBOARD}`}>{__('Account')}</NavLink></li>
                <li><NavLink to={`/my-account/${MY_ORDERS}`}>{__('Orders')}</NavLink></li>
                <li onClick={logout}>{__('Logout')}</li>
            </ul>
        )
    }

    renderAccountButton(isVisible = false) {
        const {onMyAccountButtonClick} = this.props;

        return (
            <button
                key="account"
                block="Header"
                elem="Button"
                mods={{isVisible, type: 'account'}}
                onClick={onMyAccountButtonClick}
                aria-label="Open my account"
            >
                <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.9858 6.62638C15.9858 9.36866 13.7558 11.5956 11.0001 11.5956C8.24438 11.5956 6.01436 9.36866 6.01436 6.62638C6.01436 3.8841 8.24438 1.65715 11.0001 1.65715C13.7558 1.65715 15.9858 3.8841 15.9858 6.62638ZM1.81966 21.4857C1.75827 21.4857 1.71079 21.4599 1.68223 21.4275C1.65636 21.3981 1.64876 21.3689 1.65508 21.3342C2.00941 19.3901 2.78848 17.7671 3.93159 16.6384C5.06226 15.522 6.59282 14.844 8.5617 14.844H13.4384C15.4073 14.844 16.9379 15.522 18.0685 16.6384C19.2117 17.7671 19.9907 19.3901 20.3451 21.3342C20.3514 21.3689 20.3438 21.3981 20.3179 21.4275C20.2893 21.4599 20.2419 21.4857 20.1805 21.4857H1.81966Z"
                        stroke="black" strokeWidth="1.6"/>
                </svg>
                {this.renderMyAccountLinks()}
            </button>
        );
    }

    renderMinicartButton(isVisible = false) {
        const {cartTotals: {items_qty}, onMinicartButtonClick} = this.props;

        return (
            <div block="Header" elem="Minicart" key="minicart">
                <button
                    block="Header"
                    elem="Button"
                    mods={{isVisible, type: 'minicart'}}
                    onClick={onMinicartButtonClick}
                    aria-label="Minicart"
                >
                    <span aria-label="Items in cart">{items_qty || '0'}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.73254 15.5158H7.73364C7.73456 15.5158 7.73547 15.5156 7.73639 15.5156H20.4844C20.7982 15.5156 21.0742 15.3074 21.1604 15.0057L23.9729 5.16193C24.0335 4.94971 23.991 4.72156 23.8583 4.54541C23.7253 4.36926 23.5175 4.26562 23.2969 4.26562H6.11096L5.60834 2.00372C5.53674 1.68201 5.25146 1.45312 4.92187 1.45312H0.703125C0.314758 1.45312 0 1.76788 0 2.15625C0 2.54462 0.314758 2.85938 0.703125 2.85938H4.35791C4.4469 3.26019 6.76318 13.6837 6.89648 14.2833C6.14923 14.6082 5.625 15.3532 5.625 16.2188C5.625 17.3818 6.57129 18.3281 7.73437 18.3281H20.4844C20.8727 18.3281 21.1875 18.0134 21.1875 17.625C21.1875 17.2366 20.8727 16.9219 20.4844 16.9219H7.73437C7.34674 16.9219 7.03125 16.6064 7.03125 16.2188C7.03125 15.8317 7.34564 15.5167 7.73254 15.5158ZM22.3647 5.67188L19.9539 14.1094H8.29834L6.42334 5.67188H22.3647Z"
                            fill="black"/>
                        <path
                            d="M7.03125 20.4375C7.03125 21.6006 7.97754 22.5469 9.14062 22.5469C10.3037 22.5469 11.25 21.6006 11.25 20.4375C11.25 19.2744 10.3037 18.3281 9.14062 18.3281C7.97754 18.3281 7.03125 19.2744 7.03125 20.4375ZM9.14062 19.7344C9.52826 19.7344 9.84375 20.0499 9.84375 20.4375C9.84375 20.8251 9.52826 21.1406 9.14062 21.1406C8.75299 21.1406 8.4375 20.8251 8.4375 20.4375C8.4375 20.0499 8.75299 19.7344 9.14062 19.7344Z"
                            fill="black"/>
                        <path
                            d="M16.9688 20.4375C16.9688 21.6006 17.915 22.5469 19.0781 22.5469C20.2412 22.5469 21.1875 21.6006 21.1875 20.4375C21.1875 19.2744 20.2412 18.3281 19.0781 18.3281C17.915 18.3281 16.9688 19.2744 16.9688 20.4375ZM19.0781 19.7344C19.4658 19.7344 19.7812 20.0499 19.7812 20.4375C19.7812 20.8251 19.4658 21.1406 19.0781 21.1406C18.6905 21.1406 18.375 20.8251 18.375 20.4375C18.375 20.0499 18.6905 19.7344 19.0781 19.7344Z"
                            fill="black"/>
                    </svg>
                </button>
            </div>
        );
    }

    renderClearButton(isVisible = false) {
        const {isClearEnabled, onClearButtonClick} = this.props;

        return (
            <button
                key="clear"
                block="Header"
                elem="Button"
                mods={{type: 'clear', isVisible, isDisabled: !isClearEnabled}}
                onClick={onClearButtonClick}
                aria-label="Clear"
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
            />
        );
    }

    renderEditButton(isVisible = false) {
        const {onEditButtonClick} = this.props;

        return (
            <button
                key="edit"
                block="Header"
                elem="Button"
                mods={{type: 'edit', isVisible}}
                onClick={onEditButtonClick}
                aria-label="Clear"
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
            />
        );
    }

    renderOkButton(isVisible = false) {
        const {onOkButtonClick} = this.props;

        return (
            <button
                key="ok"
                block="Header"
                elem="Button"
                mods={{type: 'ok', isVisible}}
                onClick={onOkButtonClick}
                aria-label="Save changes"
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
            >
                {__('OK')}
            </button>
        );
    }

    renderCancelButton(isVisible = false) {
        const {onCancelButtonClick} = this.props;

        return (
            <button
                key="cancel"
                block="Header"
                elem="Button"
                mods={{type: 'cancel', isVisible}}
                onClick={onCancelButtonClick}
                aria-label="Cancel changes"
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
            >
                {__('Cancel')}
            </button>
        );
    }

    renderContacts(isVisible = false) {
        const {storeInformation: {hours, phone}} = this.props;
        return (
            <div
                key="contacts"
                block="Header"
                elem="Contacts"
            >
                <a href={'tel:' + {phone}}>
                    {phone}
                </a>
                <div>
                    {hours}
                </div>
            </div>
        )
    }

    renderHeaderState() {
        const {headerState: {name}, windowSize} = this.props;

        if (windowSize === 'desktop') {

            return Object.entries(this.renderMap).map(
                ([key, renderFunction]) => renderFunction()
            )
        } else {

            return Object.entries(this.renderMapMobile).map(
                ([key, renderFunction]) => renderFunction()
            )
        }
    }

    renderDesktopTopHeader(windowSize) {
        if (windowSize !== 'desktop') return null;
        return <>
            <HeaderTopComponent/>
            <div block="Header" elem={"Middle"}>
                <ContentWrapper label={"Header top sale link"}>
                    <CmsBlock identifiers={['header-top-sale-link']} blocks={['header-top-sale-link']}/>
                </ContentWrapper>
            </div>
        </>
    }

    renderMobileTopHeader(windowSize) {
        const {headerState: {name}} = this.props;
        if (windowSize === 'desktop' || name === MENU) return null
        return <>
            <div block="Header" elem={"Middle"}>
                <ContentWrapper label={"Header top sale link"}>
                    <CmsBlock identifiers={['header-top-sale-link']} blocks={['header-top-sale-link']}/>
                </ContentWrapper>
            </div>
        </>
    }

    render() {
        const {headerState: {name}, windowSize} = this.props;
        return (
            <header block="Header" mods={{name}}>
                {this.renderDesktopTopHeader(windowSize)}
                <nav block="Header" elem="Nav">
                    {this.renderHeaderState()}
                </nav>
                {this.renderMobileTopHeader(windowSize)}
            </header>
        );
    }
}
