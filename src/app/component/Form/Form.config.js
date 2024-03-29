/* eslint-disable no-useless-escape */
/* eslint-disable max-len */

import {isValidPhoneNumber} from "react-phone-number-input";

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

export default {
    email: {
        validate: ({ value }) => value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
        message: __('Email is invalid.')
    },
    password: {
        validate: ({ value }) => value.match(/^((?=.*[A-Z])(?=.*[a-z])(?=.*\d)|(?=.*[a-z])(?=.*\d)(?=.*[\$\%\&])|(?=.*[A-Z])(?=.*\d)(?=.*[\$\%\&])|(?=.*[A-Z])(?=.*[a-z])(?=.*[\$\%\&])).{8,16}$/),
        message: __('Password should be at least 8 characters long, include at least on upper case letter, number and symbol!')
    },
    telephone: {
        validate: ({value}) => isValidPhoneNumber(value),
        message: __('Phone number is invalid!')
    },
    notEmpty: {
        validate: ({value}) => value.length > 0,
        message: __('This field is required!')
    },
    checkbox: {
        validate: (e) => e.checked,
        message: __('This field is required!')
    }
};
