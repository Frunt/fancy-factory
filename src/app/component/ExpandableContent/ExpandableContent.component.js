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
import TextPlaceholder from 'Component/TextPlaceholder';
import {MixType, ChildrenType} from 'Type/Common';
import './ExpandableContent.style';
import ClickOutside from "Component/ClickOutside";

export default class ExpandableContent extends PureComponent {
    static propTypes = {
        isContentExpanded: PropTypes.bool,
        heading: PropTypes.string,
        revert: PropTypes.bool,
        subHeading: PropTypes.string,
        children: ChildrenType.isRequired,
        mix: MixType,
        onClick: (props, propName, componentName) => {
            const propValue = props[propName];
            if (propValue === null) return;
            if (typeof propValue === 'function') return;
            throw new Error(`${componentName} only accepts null or string`);
        }
    };

    static defaultProps = {
        revert: false,
        subHeading: '',
        heading: '',
        closeOnClick: false,
        isContentExpanded: false,
        onClick: null
    };

    constructor(props) {
        super(props);

        const {isContentExpanded} = this.props;
        this.state = {
            isContentExpanded,
            // eslint-disable-next-line react/no-unused-state
            prevIsContentExpanded: isContentExpanded,
            isContentRightAlign: false
        };
    }

    static getDerivedStateFromProps({isContentExpanded}, {prevIsContentExpanded}) {
        if (isContentExpanded !== prevIsContentExpanded) {
            return {
                prevIsContentExpanded: isContentExpanded,
                isContentExpanded
            };
        }

        return null;
    }

    toggleExpand = () => {
        const {onClick} = this.props;

        if (onClick) {
            onClick();
            return;
        }
        this.setState(({isContentExpanded}) => (
            {isContentExpanded: !isContentExpanded}
        ));
        this.setPosition()
    };

    setPosition = () => {
        const refBounds = this.contentRef.getBoundingClientRect();
        const wWidth = window.innerWidth;

        this.setState({isContentRightAlign: refBounds.right > wWidth})
    }

    renderButton() {
        const {isContentExpanded} = this.state;
        const {heading, subHeading, mix, revert} = this.props;

        return (
            <button
                block="ExpandableContent"
                elem="Button"
                mods={{isContentExpanded}}
                mix={{...mix, elem: 'ExpandableContentButton'}}
                onClick={this.toggleExpand}
            >
                {revert ? <>
                    <span
                        block="ExpandableContent"
                        elem="SubHeading"
                        mix={{...mix, elem: 'ExpandableContentSubHeading'}}
                    >
                        {subHeading}
                    </span>
                    <span
                        block="ExpandableContent"
                        elem="Heading"
                        mix={{...mix, elem: 'ExpandableContentHeading'}}
                    >
                    <TextPlaceholder content={heading}/>
                </span>
                </> : <>
                        <span
                            block="ExpandableContent"
                            elem="Heading"
                            mix={{...mix, elem: 'ExpandableContentHeading'}}
                        >
                    <TextPlaceholder content={heading}/>
                </span>
                    <span
                        block="ExpandableContent"
                        elem="SubHeading"
                        mix={{...mix, elem: 'ExpandableContentSubHeading'}}
                    >
                    {subHeading}
                </span>
                </>}
            </button>

        );
    }

    renderContent() {
        const {children, mix} = this.props;
        const {isContentExpanded, isContentRightAlign} = this.state;
        const mods = {isContentExpanded, isContentRightAlign};

        return (
            <div
                block="ExpandableContent"
                elem="Content"
                mods={mods}
                ref={el => this.contentRef = el}
                mix={{...mix, elem: 'ExpandableContentContent', mods}}
            >
                {children}
            </div>
        );
    }

    render() {
        const {mix, closeOnClick} = this.props;
        const {isContentExpanded} = this.state;

        return (
            <ClickOutside onClick={() => (isContentExpanded && !closeOnClick) ? this.toggleExpand() : false}>
                <article
                  block="ExpandableContent"
                  mix={mix}
                >
                    {this.renderButton()}
                    {this.renderContent()}
                </article>
            </ClickOutside>
        );
    }
}
