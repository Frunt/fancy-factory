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
import {PureComponent} from 'react';

import {ordersType} from 'Type/Account';
import Loader from 'Component/Loader';
import MyAccountOrderPopup from 'Component/MyAccountOrderPopup';
import MyAccountOrderTableRow from 'Component/MyAccountOrderTableRow';

import './MyAccountMyOrders.style';
import ProductCard from "Component/ProductCard/ProductCard.container";

class MyAccountMyOrders extends PureComponent {
    static propTypes = {
        orderList: ordersType.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    renderNoOrders() {
        return (
            <div block="MyAccountMyOrders" elem="NoOrders">
                <p>{__('You have no orders.')}</p>
            </div>
        );
    }

    state = {
        singleOrderData: false
    };

    showOderData(singleOrderData) {
        const {toggleBackVisibility} = this.props;
        window.scrollTo(0, 0);
        toggleBackVisibility(!!singleOrderData);
        this.setState({singleOrderData})
    }

    renderOrderRow = (order) => {
        const {base_order_info: {id}} = order;
        return (
            <MyAccountOrderTableRow
                key={id}
                showOderData={singleOrderData => this.showOderData(singleOrderData)}
                order={order}
            />
        );
    };

    renderOrdersList() {
        const {orderList} = this.props;
        if (orderList.length === 0) return this.renderNoOrders();

        return <>
            <h5 block="MyAccountOrderTableRow" elem="Heading">{`${__('Ordered')} ${orderList.length}`}</h5>
            {orderList.map(this.renderOrderRow)}
        </>
    }

    render() {
        const {isLoading} = this.props;
        const {singleOrderData} = this.state;
        return (
            <>
                <div block="MyAccountMyOrders">
                    <Loader isLoading={isLoading}/>
                    {singleOrderData ? <MyAccountOrderPopup
                        singleOrderData={singleOrderData}
                        hideOderData={() => this.showOderData(false)}
                    /> : this.renderOrdersList()}
                </div>
            </>
        );
    }
}

export default MyAccountMyOrders;
