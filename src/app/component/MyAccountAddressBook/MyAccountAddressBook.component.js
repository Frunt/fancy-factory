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
import {customerType} from 'Type/Account';
import MyAccountAddressTable from 'Component/MyAccountAddressTable';
import MyAccountAddressPopup from 'Component/MyAccountAddressPopup';
import './MyAccountAddressBook.style';

class MyAccountAddressBook extends PureComponent {
    static propTypes = {
        customer: customerType.isRequired,
        getDefaultPostfix: PropTypes.func.isRequired,
        showCreateNewPopup: PropTypes.func.isRequired
    };

    renderNoAddresses() {
        return (
            <div>
                {this.renderActions()}
                <p>{__('You have no configured addresses.')}</p>
            </div>
        );
    }

    renderActions() {
        const {showCreateNewPopup} = this.props;
        return (
            <button
                block="MyAccountAddressBook"
                elem="Button"
                mix={{block: 'Button'}}
                onClick={showCreateNewPopup}
            >
                {__('Add address')}
            </button>
        );
    }

    renderAddressList() {
        const {customer: {addresses = []}} = this.props;
        if (!addresses.length) return this.renderNoAddresses();
        return <MyAccountAddressPopup/>;
    }

    render() {
        return (
            <div block="MyAccountAddressBook">
                <MyAccountAddressPopup block="MyAccountAddressBook" elem="CustomerData"/>
            </div>
        );
    }
}

export default MyAccountAddressBook;
