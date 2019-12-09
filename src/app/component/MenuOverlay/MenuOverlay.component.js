/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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
import Link from 'Component/Link';
import Image from 'Component/Image';
import Overlay from 'Component/Overlay';
import CmsBlock from 'Component/CmsBlock';
import {MENU_SUBCATEGORY} from 'Component/Header';
import {MenuType} from 'Type/Menu';
import './MenuOverlay.style';

export default class MenuOverlay extends PureComponent {
    static propTypes = {
        menu: MenuType.isRequired,
        hideActiveOverlay: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired,
        changeHeaderState: PropTypes.func.isRequired
    };

    state = {activeMenuItemsStack: []};

    closeMenuOverlay = this.closeMenuOverlay.bind(this);

    showSubCategory(e, activeSubcategory) {
        const {activeMenuItemsStack} = this.state;
        const {changeHeaderState, goToPreviousHeaderState} = this.props;
        const {item_id, title} = activeSubcategory;

        e.stopPropagation();
        // changeHeaderState({
        //     name: MENU_SUBCATEGORY,
        //     force: true,
        //     title,
        //     onBackClick: () => {
        //         this.setState(({activeMenuItemsStack}) => (
        //             {activeMenuItemsStack: activeMenuItemsStack.slice(1)}
        //         ));
        //         goToPreviousHeaderState();
        //     }
        // });

        if (!activeMenuItemsStack.includes(item_id)) {
            this.setState({activeMenuItemsStack: [item_id, ...activeMenuItemsStack]});
        } else {
            const index = activeMenuItemsStack.indexOf(item_id);
            activeMenuItemsStack.splice(index, 1);
            this.setState({activeMenuItemsStack: [...activeMenuItemsStack]});
        }
    }

    closeMenuOverlay(e) {
        const {hideActiveOverlay} = this.props;

        e.stopPropagation();

        this.setState({activeMenuItemsStack: []});
        hideActiveOverlay();
    }

    renderItemContent(item, mods = {}) {
        const {title, icon, item_class} = item;
        const itemMods = item_class === 'MenuOverlay-ItemFigure_type_banner' ? {type: 'banner'} : mods;

        return <span className={item_class}>{title}</span>;

        return (
            <figure block="MenuOverlay" elem="ItemFigure" mods={itemMods}>
                <Image
                    mix={{block: 'MenuOverlay', elem: 'Image', mods: itemMods}}
                    src={icon && `/media/${icon}`}
                    ratio="16x9"
                    arePlaceholdersShown
                />
                <figcaption
                    block="MenuOverlay"
                    elem="ItemCaption"
                    mods={itemMods}
                >
                    {title}
                </figcaption>
            </figure>
        );
    }

    renderSubLevel(category) {
        const {activeMenuItemsStack} = this.state;
        const {item_id, children} = category;
        const childrenArray = Object.values(children);
        const isVisible = activeMenuItemsStack.includes(item_id);
        const subcategoryMods = {type: 'subcategory'};

        return (
            <ul
                block="MenuOverlay"
                elem="ItemList"
                mods={{...subcategoryMods, isVisible}}
            >
                {childrenArray.map((item) => {
                    const {url, item_id, children} = item;
                    const childrenArray = Object.values(children);
                    const isActive = activeMenuItemsStack.includes(item_id);

                    return (
                        <li key={item_id} block="MenuOverlay" elem="Item" mods={{isActive}}>
                            <Link
                                to={url}
                                onClick={this.closeMenuOverlay}
                                block="MenuOverlay"
                                elem="Link"
                            >
                                {this.renderItemContent(item, subcategoryMods)}
                            </Link>
                            {!!childrenArray.length && <>
                                <div
                                    onClick={e => this.showSubCategory(e, item)}
                                    tabIndex="0"
                                    role="button"
                                    block="MenuOverlay"
                                    elem="arrow"
                                >
                                </div>
                                {this.renderSubLevel(item)}
                            </>}
                        </li>
                    );
                })}
            </ul>
        );
    }

    renderFirstLevel(itemList, itemMods) {
        return Object.values(itemList).map((item) => {
            const {item_id, children, url} = item;
            const childrenArray = Object.values(children);
            const {activeMenuItemsStack} = this.state;
            const isActive = activeMenuItemsStack.includes(item_id);

            return (
                <li key={item_id} block="MenuOverlay" elem="Item" mods={{isActive}}>
                    <Link
                        to={url}
                        onClick={this.closeMenuOverlay}
                        block="MenuOverlay"
                        elem="Link"
                    >
                        {this.renderItemContent(item, itemMods)}
                    </Link>
                    {!!childrenArray.length && <>
                        <div
                            onClick={e => this.showSubCategory(e, item)}
                            tabIndex="0"
                            role="button"
                            block="MenuOverlay"
                            elem="arrow"
                        >
                        </div>
                        {this.renderSubLevel(item)}
                    </>}
                </li>
            );
        });
    }

    renderTopLevel() {
        const {menu} = this.props;
        const categoryArray = Object.values(menu);

        if (!categoryArray.length) return null;
        const {
            0: {children: mainCategories, title: mainCategoriesTitle},
        } = categoryArray;
        const mainMods = {type: 'main'};

        return (
            <div block="MenuOverlay" elem="Menu">
                <div block={"MenuOverlay"} elem={"Heading"}>
                    <span>{__('Category')}</span>
                </div>
                <ul
                    block="MenuOverlay"
                    elem="ItemList"
                    mods={mainMods}
                    aria-label={mainCategoriesTitle}
                >
                    {this.renderFirstLevel(mainCategories, mainMods)}
                </ul>
            </div>
        );
    }

    render() {
        return (
            <div
                id="menu"
                mix={{block: 'MenuOverlay'}}
            >
                {this.renderTopLevel()}
            </div>
        );
    }
}
