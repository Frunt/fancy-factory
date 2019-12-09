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

import {customerType} from 'Type/Account';
import Loader from 'Component/Loader';
import './MyAccountDashboard.style';
import MyAccountCustomerPopup from 'Component/MyAccountCustomerPopup';

class MyAccountDashboard extends PureComponent {
    static propTypes = {
        customer: customerType.isRequired
    };

    renderCustomerTable() {
        return (
            <div block="MyAccountDashboard" elem="CustomerData">
                <MyAccountCustomerPopup/>
            </div>
        );
    }

    render() {
        const {customer: {id}} = this.props;

        return (
            <div block="MyAccountDashboard">
                <Loader isLoading={!id}/>
                {this.renderCustomerTable()}
            </div>
        );
    }
}

export default MyAccountDashboard;
