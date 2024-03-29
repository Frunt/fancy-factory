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

import {Field} from 'Util/Query';

/**
 * MyAccount Mutations
 * @class MyAccount
 */
export class MyAccountQuery {
    /**
     * Get ResetPassword mutation
     * @param {{token: String, password: String, password_confirmation: String}} options A object containing different aspects of query, each item can be omitted
     * @return {Field}
     * @memberof MyAccount
     */
    getResetPasswordMutation(options) {
        const {token, password, password_confirmation} = options;

        return new Field('resetPassword')
            .addArgument('token', 'String!', token)
            .addArgument('password', 'String!', password)
            .addArgument('password_confirmation', 'String!', password_confirmation)
            .addField('status');
    }

    /**
     * Get SignIn mutation
     * @param {{telephone: String, password: String}} options A object containing different aspects of query, each item can be omitted
     * @return {Field}
     * @memberof MyAccount
     */
    getSignInMutation(options) {
        const {telephone, password} = options;

        return new Field('generateCustomerToken')
            .addArgument('telephone', 'String!', telephone)
            .addArgument('password', 'String!', password)
            .addArgument('guest_quote_id', 'String!', this.addQuoteId())
            .addField('token');
    }

    addQuoteId() {
        let id = '';
        const quote_id = localStorage.getItem('guest_quote_id');
        if (quote_id) {
            id = JSON.parse(quote_id).data;
        }
        return id;
    }

    getUpdateInformationMutation(options) {
        return new Field('updateCustomer')
            .addArgument('input', 'CustomerInput!', options)
            .addField(this._getCustomerField());
    }

    getChangeCustomerPasswordMutation(options) {
        const {currentPassword, newPassword} = options;

        return new Field('changeCustomerPassword')
            .addArgument('currentPassword', 'String!', currentPassword)
            .addArgument('newPassword', 'String!', newPassword)
            .addField('id')
            .addField('email');
    }

    getCreateAddressMutation(options) {
        return new Field('createCustomerAddress')
            .addArgument('input', 'CustomerAddressInput!', options)
            .addFieldList(this._getAddressFields());
    }

    getDeleteAddressMutation(id) {
        return new Field('deleteCustomerAddress')
            .addArgument('id', 'Int!', id);
    }

    getUpdateAddressMutation(id, options) {
        return new Field('updateCustomerAddress')
            .addArgument('id', 'Int!', id)
            .addArgument('input', 'CustomerAddressInput!', options)
            .addFieldList(this._getAddressFields());
    }

    getCreateAccountMutation(options) {
        const {customer, password} = options;

        return new Field('createCustomer')
            .addArgument('input', 'CustomerInput!', {...customer, password})
            .addField(this._getCustomerField());
    }

    getCustomerQuery() {
        return this._getCustomerField();
    }

    _getCustomerField() {
        return new Field('customer')
            .addFieldList(this._getCustomerFields());
    }

    _getCustomerFields() {
        return [
            'created_at',
            'group_id',
            'prefix',
            'firstname',
            'middlename',
            'lastname',
            'suffix',
            'phone_number',
            'email',
            'dob',
            'default_billing',
            'default_shipping',
            'dob',
            'taxvat',
            'id',
            'is_subscribed',
            this._getAddressesField()
        ];
    }

    _getAddressesField() {
        return new Field('addresses')
            .addFieldList(this._getAddressFields());
    }

    _getRegionField() {
        return new Field('region')
            .addFieldList(this._getRegionFields());
    }

    _getRegionFields() {
        return [
            'region_code',
            'region',
            'region_id'
        ];
    }

    _getAddressFields() {
        return [
            'id',
            'customer_id',
            'country_id',
            'street',
            'company',
            'telephone',
            'fax',
            'postcode',
            'city',
            'firstname',
            'lastname',
            'middlename',
            'prefix',
            'suffix',
            'vat_id',
            'default_shipping',
            'default_billing',
            this._getRegionField()
        ];
    }

    /**
     * Get ForgotPassword mutation
     * @param {{email: String}} options
     * @returns {Field}
     * @memberof MyAccount
     */
    getForgotPasswordMutation(options) {
        const {email} = options;

        return new Field('forgotPassword')
            .addArgument('email', 'String!', email)
            .addField('status');
    }


    subscribeCustomerMutation(email) {
        return new Field('subscribeCustomer')
            .addArgument('input', ' SubscribeCustomerInput!', {email})
            .addFieldList(['subscribe_id', 'is_subscribed'])
    }
}

export default new MyAccountQuery();
