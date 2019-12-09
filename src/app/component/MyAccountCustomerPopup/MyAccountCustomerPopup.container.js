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
import {connect} from 'react-redux';

import {MyAccountQuery} from 'Query';
import {fetchMutation} from 'Util/Request';
import BrowserDatabase from 'Util/BrowserDatabase';
import {showNotification} from 'Store/Notification';
import {updateCustomerDetails} from 'Store/MyAccount';
import {CUSTOMER} from 'Store/MyAccount/MyAccount.dispatcher';
import {ONE_MONTH_IN_SECONDS} from 'Util/Request/QueryDispatcher';

import MyAccountCustomerPopup from './MyAccountCustomerPopup.component';

const mapStateToProps = state => ({
    customer: state.MyAccountReducer.customer
});

export const mapDispatchToProps = dispatch => ({
    updateCustomer: customer => dispatch(updateCustomerDetails(customer)),
    showErrorNotification: error => dispatch(showNotification('error', error[0].message)),
    showSuccessNotification: message => dispatch(showNotification('success', message)),
});

export class MyAccountCustomerPopupContainer extends PureComponent {
    static propTypes = {
        updateCustomer: PropTypes.func.isRequired,
        showErrorNotification: PropTypes.func.isRequired,
        showSuccessNotification: PropTypes.func.isRequired
    };

    state = {
        isLoading: false
    };

    containerFunctions = {
        onCustomerSave: this.onCustomerSave.bind(this),
        onPasswordChange: this.onPasswordChange.bind(this)
    };

    onError = (error) => {
        const {showErrorNotification} = this.props;
        this.setState({isLoading: false});
        showErrorNotification(error);
    };

    onCustomerSave(customer) {
        const passwords = {
            currentPassword: customer.currentPassword,
            newPassword: customer.newPassword
        };
        delete customer.currentPassword;
        delete customer.newPassword;

        const {updateCustomer} = this.props;
        const mutation = MyAccountQuery.getUpdateInformationMutation(customer);
        this.setState({isLoading: true});

        return fetchMutation(mutation).then(
            ({updateCustomer: {customer}}) => {
                BrowserDatabase.setItem(customer, CUSTOMER, ONE_MONTH_IN_SECONDS);
                updateCustomer(customer);
                this.setState({isLoading: false},
                    () => this.onPasswordChange(passwords));
            },
            this.onError
        );
    }

    onPasswordChange(passwords) {
        const {showSuccessNotification} = this.props;
        const mutation = MyAccountQuery.getChangeCustomerPasswordMutation(passwords);
        this.setState({isLoading: true});

        return fetchMutation(mutation).then(
            () => {
                showSuccessNotification(__('Your password was successfully updated!'));
                this.setState({isLoading: false});
            },
            this.onError
        );
    }

    render() {
        return (
            <MyAccountCustomerPopup
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountCustomerPopupContainer);
