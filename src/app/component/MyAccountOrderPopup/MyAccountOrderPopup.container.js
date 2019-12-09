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
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {orderType} from 'Type/Account';
import {OrderDispatcher} from 'Store/Order';
import {showNotification} from 'Store/Notification';
import {getIndexedProducts} from 'Util/Product';
import {executeGet} from 'Util/Request';
import {prepareQuery} from 'Util/Query';
import {OrderQuery} from 'Query';

import MyAccountOrderPopup, {ORDER_POPUP_ID} from './MyAccountOrderPopup.component';
import {MyAccountOrderPopupTrackingComponent} from "Component/MyAccountOrderPopup/MyAccountOrderPopupTrackingComponent";

export const ONE_DAY_IN_SECONDS = 86400;

export const mapStateToProps = state => ({
    order: state.OrderReducer.order
});

export const mapDispatchToProps = dispatch => ({
    showNotification: (type, message) => dispatch(showNotification(type, message)),
    getOrder: orderId => OrderDispatcher.getOrderById(dispatch, orderId)
});

export class MyAccountOrderPopupContainer extends PureComponent {
    static propTypes = {
        showNotification: PropTypes.func.isRequired,
        getOrder: PropTypes.func.isRequired
    };

    state = {
        order: {},
        prevOrderId: 0,
        isLoading: true
    };

    static getDerivedStateFromProps(props, state) {
        const {singleOrderData: {increment_id: id}} = props;
        const {prevOrderId} = state;

        if (prevOrderId === id) return null;
        return {order: {}, isLoading: true, prevOrderId: id};
    }

    componentDidUpdate(prevProps) {
        const {singleOrderData: {increment_id: prevId}} = prevProps;
        const {singleOrderData: {increment_id: id}} = this.props;
        if (id !== prevId) {
            this.requestOrderDetails();
        }
    }

    componentDidMount() {
        this.requestOrderDetails();
    }


    containerProps = () => {
        const {order: stateOrder, isLoading} = this.state;
        const {singleOrderData: {order: payloadOrder}, hideOderData} = this.props;

        return {
            hideOderData,
            isLoading,
            order: {
                ...payloadOrder,
                ...stateOrder
            }
        };
    };

    requestOrderDetails() {
        const {singleOrderData: {order: {base_order_info: {id}}}} = this.props;
        const query = prepareQuery([OrderQuery.getOrderByIdQuery(id)]);

        executeGet(query, 'Order', ONE_DAY_IN_SECONDS).then(
            ({getOrderById: rawOrder}) => {
                const {order_products = []} = rawOrder;
                const indexedProducts = getIndexedProducts(order_products);
                const order = {...rawOrder, order_products: indexedProducts};
                this.setState({order, isLoading: false});
            },
            (err) => {
                showNotification('error', __('Error getting Order by ID!'));
                this.setState({isLoading: false});
            }
        );
    }

    renderInfoContainer() {
        const {singleOrderData: {type}} = this.props;
        const props = this.containerProps();
        const view = {
            'details': <MyAccountOrderPopup
                {...props}
            />,
            'tracking': <MyAccountOrderPopupTrackingComponent
                {...props}
            />,
        };
        return view[type] || null;
    }

    render() {
        return (
            <>
                <div className="button-prev" onClick={this.props.hideOderData}>{__('All orders')}</div>
                {this.renderInfoContainer()}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOrderPopupContainer);
