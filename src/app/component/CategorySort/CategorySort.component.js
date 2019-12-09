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

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextPlaceholder from 'Component/TextPlaceholder';
import './CategorySort.style';
import Overlay from 'Component/Overlay';

/**
 * Product Sort
 * @class ProductSort
 */
export default class CategorySort extends PureComponent {
    static propTypes = {
        onSortChange: PropTypes.func.isRequired,
        sortKey: PropTypes.string.isRequired,
        sortDirection: PropTypes.string.isRequired,
        selectOptions: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),
            disabled: PropTypes.bool,
            label: PropTypes.string
        })).isRequired,
        sortFields: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.string,
                label: PropTypes.string
            }))
        ])
    };

    static defaultProps = {
        sortFields: []
    };

    onChange = (value) => {
        const { onSortChange } = this.props;
        const [direction, ...key] = value.split(' ');

        onSortChange(direction, key);
    };

    renderPlaceholder() {
        return (
            <p block="CategorySort" elem="Placeholder">
                <TextPlaceholder length="short" />
            </p>
        );
    }

    renderSortField() {
        const {
            sortKey, sortDirection, sortFields, selectOptions
        } = this.props;

        if (!sortFields.length) return this.renderPlaceholder();

        return (selectOptions || []).map(option => <div
          block="CategorySort"
          elem="Option"
          key={option.id}
          className={`${sortDirection} ${sortKey}` === option.value ? 'active' : ''}
          onClick={()=> this.onChange(option.value)}
        >{option.label}</div>)
    }

    renderHeading() {
        const {hideOverlay} = this.props;
        return (
          <div block="CategorySort" elem="Heading">
              {__('Sort')}
              <div block="CategorySort" elem="Close" onClick={() => hideOverlay()}/>
          </div>
        );
    }

    renderSortList() {
        return(
          <div block="CategorySort" elem="List">{this.renderSortField()}</div>
        )
    }

    renderSortClearButton() {
        const {onSortChange} = this.props;

        return (
          <button
            block="CategorySort"
            elem="ClearSort"
            onClick={() => onSortChange('', '')}
          >
              {__('Clear filters')}
          </button>
        );
    }

    render() {
        return (
          <Overlay mix={{block: 'CategorySort'}} id="category-sort">
              { this.renderHeading() }
              { this.renderSortClearButton() }
              { this.renderSortList() }
          </Overlay>
        );
    }
}
