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
import MyAccountCustomerForm from 'Component/MyAccountCustomerForm';
import Loader from 'Component/Loader';

export const CUSTOMER_POPUP_ID = 'MyAccountCustomerPopup';

export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const EDIT_CUSTOMER = 'EDIT_CUSTOMER';

class MyAccountCustomerPopup extends PureComponent {
    static propTypes = {
        onCustomerSave: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderCustomerForm() {
        const {customer, onCustomerSave} = this.props;

        return (
            <MyAccountCustomerForm
                customer={customer}
                onSave={onCustomerSave}
            />
        );
    }

    renderContent() {
        return <>
            {this.renderCustomerForm()}
        </>
    }

    render() {
        const {isLoading} = this.props;

        return (
            <div
            >
                <Loader isLoading={isLoading}/>
                {this.renderContent()}
            </div>
        );
    }
}

export default MyAccountCustomerPopup;
