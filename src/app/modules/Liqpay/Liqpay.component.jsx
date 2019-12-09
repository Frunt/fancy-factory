import React from "react";
import * as sha1 from 'js-sha1';
import {Field} from "Util/Query";
import {fetchMutation} from "Util/Request";
import {connect} from "react-redux";

const scriptId = 'liqpay-paymant-card';

class LiqpayComponent extends React.Component {
    submit(data) {
        this.props.submit(data);
        this.setState({readyToPay: false}, () =>
            document.getElementById(scriptId).remove()
        )
    }

    scriptLoaded = () => {
        const {
            checkoutTotals: {base_currency_code, grand_total, id, increment_id},
            liqPayConfiguration: {prefix, suffix, public_key, private_key},
            mode,
            orderID
        } = this.props;
        const json_string = {
            "version": "3",
            public_key,
            private_key,
            "action": 'pay',
            "amount": grand_total,
            "currency": base_currency_code || 'UAH',
            "description": 'FancyFactory Products',
            "order_id": prefix + (id || orderID) + suffix
        };

        let data = new Buffer(JSON.stringify(json_string)).toString('base64');
        const sign_string = json_string.private_key + data + json_string.private_key;
        let signature = new Buffer(sha1.digest(sign_string)).toString('base64');
        const _this = this;
        LiqPayCheckout.init({
            signature,
            data,
            embedTo: ".liqpay_checkout",
            language: "ru",
            mode
        }).on("liqpay.callback", (data) => _this.sendToken(data).then(() => _this.submit(data))
        ).on("liqpay.ready", function (data) {
            // ready
        }).on("liqpay.close", function (data) {
            _this.setState({readyToPay: false}, () =>
                document.getElementById(scriptId) && document.getElementById(scriptId).remove()
            )
        });
    };

    componentDidMount() {
        const {mode} = this.props;
        if (mode === 'embed') {
            this.renderScript()
        }
    }

    sendToken(data) {
        const {submit, orderID, checkoutTotals: {id}} = this.props;
        let order_id = '';
        if (id) {
            order_id = id.toString();
        } else {
            order_id = orderID
        }
        const mutation = new Field('saveLiqPayPaymentInformationToOrder')
            .addArgument('response', 'String!', JSON.stringify(data))
            .addArgument('order_id', 'String!', order_id)
            .addFieldList(['message', 'success']);
        return fetchMutation(mutation).then(res => submit(res))
    }

    renderScript() {
        const s = document.createElement("script");
        s.src = 'https://static.liqpay.ua/libjs/checkout.js';
        s.id = scriptId;
        document.body.append(s);
        s.onload = this.scriptLoaded;
    }

    componentWillUnmount() {
        document.getElementById(scriptId) ? document.getElementById(scriptId).remove() : null;
    }

    openWidget(e) {
        e.preventDefault();
        this.setState({readyToPay: true}, () => this.renderScript())
    }

    render() {
        const {mode} = this.props;
        return (
            <>
                {mode !== 'embed' && <button className={'Button CheckoutBilling-Button'}
                                             onClick={e => this.openWidget(e)}>{__('Pay')}</button>}
                <div className="liqpay_checkout"/>
            </>
        )
    }
}


const mapStateToProps = state => ({
    liqPayConfiguration: state.ConfigReducer.liqPayConfiguration
});

LiqpayComponent = connect(mapStateToProps)(LiqpayComponent);
LiqpayComponent.defaultProps = {
    mode: 'embed'
};
export {LiqpayComponent}