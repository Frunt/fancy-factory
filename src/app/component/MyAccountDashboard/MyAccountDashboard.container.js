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
import { connect } from 'react-redux';

import { customerType } from 'Type/Account';

import MyAccountDashboard from './MyAccountDashboard.component';

export const mapStateToProps = state => ({
    customer: state.MyAccountReducer.customer
});

export class MyAccountDashboardContainer extends PureComponent {
    static propTypes = {
        customer: customerType.isRequired
    };

    render() {
        return (
            <MyAccountDashboard
              { ...this.props }
            />
        );
    }
}

export default connect(mapStateToProps, null)(MyAccountDashboardContainer);
