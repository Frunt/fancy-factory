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

import PropTypes from 'prop-types';

import {customerType} from 'Type/Account';
import FieldForm from 'Component/FieldForm';

class MyAccountCustomerForm extends FieldForm {
    static propTypes = {
        customer: customerType.isRequired,
        onSave: PropTypes.func.isRequired
    };

    onFormSuccess = (fields) => {
        const {onSave} = this.props;
        onSave(fields);
    };

    getDefaultValues(fieldEntry) {
        const [key] = fieldEntry;
        const {customer: {[key]: value}} = this.props;

        return {
            ...super.getDefaultValues(fieldEntry),
            value
        };
    }

    get fieldMap() {

        const { customer: { is_subscribed } } = this.props;
        return {
            firstname: {
                label: __('First name'),
                validation: ['notEmpty']
            },
            lastname: {
                label: __('Last name'),
                validation: ['notEmpty']
            },
            email: {
                label: __('Email *'),
                validation: ['notEmpty'],
                disabled: true
            },
            phone_number: {
                label: __('Phone *'),
                validation: ['notEmpty'],
                disabled: true
            },
            dob: {
                label: __('Day of birthday'),
                type: 'date',
            },
            currentPassword: {
                type: 'password',
                label: __('Password'),
                validation: ['notEmpty']
            },
            newPassword: {
                type: 'password',
                label: __('Change Password'),
                validation: ['notEmpty']
            },
            is_subscribed: {
                label: __('Subscribe to our newsletter'),
                type: 'checkbox',
                value: 'is_subscribed',
                checked: is_subscribed
            }
        };
    }

    renderActions() {
        return (
            <>
                <p className="disabled-text">* {__('impossible to edit')}</p>
                <button type="submit" block="Button">
                    {__('Save changes')}
                </button>
            </>
        );
    }
}

export default MyAccountCustomerForm;
