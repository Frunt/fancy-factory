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

import {Component} from 'react';
import PropTypes from 'prop-types';
import ExpandableContent from 'Component/ExpandableContent';
import ProductAttributeValue from 'Component/ProductAttributeValue';
import {AttributeType} from 'Type/ProductList';
import {MixType} from 'Type/Common';
import './ProductConfigurableAttributes.style';
import RangeSelector from "Component/RangeSelector";

export default class ProductConfigurableAttributes extends Component {
    static propTypes = {
        isContentExpanded: PropTypes.bool,
        numberOfPlaceholders: PropTypes.arrayOf(PropTypes.number),
        configurable_options: PropTypes.objectOf(AttributeType).isRequired,
        getLink: PropTypes.func.isRequired,
        parameters: PropTypes.shape({}).isRequired,
        updateConfigurableVariant: PropTypes.func.isRequired,
        isReady: PropTypes.bool,
        mix: MixType,
        getIsConfigurableAttributeAvailable: PropTypes.func
    };

    static defaultProps = {
        isReady: true,
        mix: {},
        // eslint-disable-next-line no-magic-numbers
        numberOfPlaceholders: [6, 10, 7],
        isContentExpanded: false,
        getIsConfigurableAttributeAvailable: () => true
    };

    /**
     * Get URL link for attribute
     *
     * @param {{ attribute_code: String, attribute_value: String }} { attribute_code, attribute_value }
     * @returns {String}
     * @memberof ProductConfigurableAttributes
     */
    getLink = ({attribute_code, attribute_value}) => {
        const {getLink} = this.props;
        return getLink(attribute_code, attribute_value);
    };

    getSubHeading({attribute_values, attribute_code, attribute_options}) {
        return attribute_values.reduce((acc, attribute_value) => (
            this.isSelected({attribute_code, attribute_value})
                ? [...acc, attribute_options[attribute_value].label]
                : acc
        ), []).join(', ');
    }

    /**
     * Updates URL on click
     *
     * @param {{ attribute_code: String, attribute_value: String }} { attribute_code, attribute_value }
     * @memberof ProductConfigurableAttributes
     */
    handleOptionClick = ({attribute_code, attribute_value}) => {
        const {updateConfigurableVariant} = this.props;
        updateConfigurableVariant(attribute_code, attribute_value);
    };

    /**
     * Checks whether provided attribute were selected
     *
     * @param {{ attribute_code: String, attribute_value: String }} { attribute_code, attribute_value }
     * @returns {bool}
     * @memberof ProductConfigurableAttributes
     */
    isSelected({attribute_code, attribute_value}) {
        const {parameters = {}} = this.props;
        const parameter = parameters[attribute_code];

        if (parameter === undefined) return false;
        if (parameter.length !== undefined) return parameter.includes(attribute_value);
        return parameter === attribute_value;
    }

    renderConfigurableAttributeValue(attribute) {
        const {getIsConfigurableAttributeAvailable} = this.props;
        const {attribute_value} = attribute;

        return (
            <ProductAttributeValue
                key={attribute_value}
                attribute={attribute}
                isSelected={this.isSelected(attribute)}
                isAvailable={getIsConfigurableAttributeAvailable(attribute)}
                onClick={this.handleOptionClick}
                getLink={this.getLink}
            />
        );
    }

    renderPlaceholders() {
        const {numberOfPlaceholders, isContentExpanded} = this.props;

        return numberOfPlaceholders.map((length, i) => (
            <ExpandableContent
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                mix={{block: 'ProductConfigurableAttributes'}}
                isContentExpanded={isContentExpanded}
            >
                <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    block="ProductConfigurableAttributes"
                    elem="AttributesList"
                >
                    {Array.from({length}, (_, i) => (
                        <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            block="ProductConfigurableAttributes"
                            elem="Placeholder"
                        />
                    ))}
                </div>
            </ExpandableContent>
        ));
    }

    renderConfigurableAttributes() {
        const {configurable_options, isContentExpanded, windowSize} = this.props;
        return Object.values(configurable_options).map((option) => {
            const {attribute_values, attribute_label, attribute_code} = option;
            if (attribute_code === 'price') return null;
            return (
                <ExpandableContent
                    revert={true}
                    key={attribute_code}
                    heading={attribute_label}
                    subHeading={this.getSubHeading(option)}
                    mix={{block: 'ProductConfigurableAttributes', elem: 'Expandable', mods: {type: attribute_code}}}
                    isContentExpanded={isContentExpanded}
                >
                    <div block="ProductConfigurableAttributes" elem="AttributesList" mods={{type: attribute_code}}>
                        {(windowSize !== 'mobile') && this.renderSubheadingDataWithClearButton(option)}
                        {attribute_values.map(attribute_value => (
                            this.renderConfigurableAttributeValue({...option, attribute_value})
                        ))}
                    </div>
                </ExpandableContent>
            );
        });
    }

    renderLubricantRange() {
        const {
            updateLubricantRange,
            clearLubricantRange,
            lubricantValue,
            minLubricantValue,
            maxLubricantValue,
            windowSize
        } = this.props;

        if (!lubricantValue) return null;
        const {min, max} = lubricantValue;
        if (!(min && max)) return null;
        if (min === max) return null;

        return (
            <ExpandableContent
                heading={__('Lubricant')}
                subHeading={`From: ${min || minLubricantValue} to ${max || maxLubricantValue}`}
                isContentExpanded={false}
                mix={{
                    block: 'ProductConfigurableAttributes',
                    elem: 'Expandable',
                    mods: {type: 'price'}
                }}
            >
                {(windowSize !== 'mobile') && <div block="ProductConfigurableAttributes" elem="AttributesStatus">
                    <span>{__('Selected %s of %s', min, max)}</span>
                    <button onClick={clearLubricantRange}>{__('Clear')}</button>
                </div>}
                <RangeSelector
                    value={lubricantValue}
                    minValue={minLubricantValue || min}
                    maxValue={maxLubricantValue || max}
                    onChangeComplete={updateLubricantRange}
                />
            </ExpandableContent>
        );
    }

    renderPriceRange() {
        const {
            updatePriceRange,
            clearPriceRange,
            priceValue,
            minPriceValue,
            maxPriceValue,
            windowSize
        } = this.props;

        if (!priceValue) return null;
        const {min, max} = priceValue;
        if (min === max) return null;
        return (
            <ExpandableContent
                heading={__('Price')}
                subHeading={`From: ${min || minPriceValue} to ${max || maxPriceValue}`}
                isContentExpanded={false}
                mix={{
                    block: 'ProductConfigurableAttributes',
                    elem: 'Expandable',
                    mods: {type: 'price'}
                }}
            >
                {(windowSize !== 'mobile') && <div block="ProductConfigurableAttributes" elem="AttributesStatus">
                    <span>{__('Selected %s of %s', min, max)}</span>
                    <button onClick={clearPriceRange}>{__('Clear')}</button>
                </div>}
                <RangeSelector
                    value={priceValue}
                    minValue={minPriceValue || min}
                    maxValue={maxPriceValue || max}
                    onChangeComplete={updatePriceRange}
                />
            </ExpandableContent>
        );
    }

    renderAttributes() {
        return (
            <>
                {this.renderPriceRange()}
                {this.renderLubricantRange()}
                {this.renderConfigurableAttributes()}
            </>
        )
    }

    renderSubheadingDataWithClearButton({attribute_values, attribute_code}) {
        const {clearCustomFilter, parameters} = this.props;
        const selected = parameters[attribute_code] && parameters[attribute_code].length || 0;
        return <div block="ProductConfigurableAttributes" elem="AttributesStatus">
            <span>{__('Selected %s of %s', selected, attribute_values.length)}</span>
            <button onClick={() => clearCustomFilter(attribute_code)}>{__('Clear')}</button>
        </div>
    }

    render() {
        const {isReady, mix} = this.props;

        return (
            <div block="ProductConfigurableAttributes" mix={mix}>
                {isReady ? this.renderAttributes() : this.renderPlaceholders()}
            </div>
        );
    }
}
