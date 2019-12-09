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
import MyAccountAddressForm from 'Component/MyAccountAddressForm';
import './MyAccountAddressPopup.style';
import Loader from 'Component/Loader';

export const ADDRESS_POPUP_ID = 'MyAccountAddressPopup';

export const EDIT_ADDRESS = 'EDIT_ADDRESS';
export const DELETE_ADDRESS = 'DELETE_ADDRESS';
export const ADD_ADDRESS = 'ADD_ADDRESS';

class MyAccountAddressPopup extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        handleAddress: PropTypes.func.isRequired
    };

    renderAddressForm() {
        const { customer: { addresses }, handleAddress } = this.props;
        const address = addresses[0] || {};
        return (
            <MyAccountAddressForm
              address={ address }
              onSave={ handleAddress }
            />
        );
    }

    renderContent() {
        return this.renderAddressForm()
    }

    render() {
        const { isLoading } = this.props;

        return (
            <div block="MyAccountAddressPopup">
                <Loader isLoading={ isLoading } />
                { this.renderContent() }
            </div>
        );
    }
}

export default MyAccountAddressPopup;
