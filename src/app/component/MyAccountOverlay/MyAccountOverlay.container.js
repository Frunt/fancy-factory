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

import {MyAccountDispatcher} from 'Store/MyAccount';
import {showNotification} from 'Store/Notification';
import {isSignedIn} from 'Util/Auth';
import {history} from 'Route';

import MyAccountOverlay, {
    STATE_SIGN_IN,
    STATE_FORGOT_PASSWORD,
    STATE_FORGOT_PASSWORD_SUCCESS,
    STATE_CREATE_ACCOUNT,
    STATE_LOGGED_IN
} from './MyAccountOverlay.component';

export const mapStateToProps = state => ({
    isSignedIn: state.MyAccountReducer.isSignedIn,
    customer: state.MyAccountReducer.customer,
    isPasswordForgotSend: state.MyAccountReducer.isPasswordForgotSend
});

export const mapDispatchToProps = dispatch => ({
    forgotPassword: options => MyAccountDispatcher.forgotPassword(options, dispatch),
    createAccount: options => MyAccountDispatcher.createAccount(options, dispatch),
    signIn: options => MyAccountDispatcher.signIn(options, dispatch),
    showNotification: (type, message) => dispatch(showNotification(type, message)),
});

export class MyAccountOverlayContainer extends PureComponent {
    static propTypes = {
        forgotPassword: PropTypes.func.isRequired,
        signIn: PropTypes.func.isRequired,
        isPasswordForgotSend: PropTypes.bool.isRequired,
        showNotification: PropTypes.func.isRequired,
        createAccount: PropTypes.func.isRequired
    };

    containerFunctions = {
        onSignInSuccess: this.onSignInSuccess.bind(this),
        onSignInAttempt: this.onSignInAttempt.bind(this),
        onCreateAccountAttempt: this.onCreateAccountAttempt.bind(this),
        onCreateAccountSuccess: this.onCreateAccountSuccess.bind(this),
        onForgotPasswordSuccess: this.onForgotPasswordSuccess.bind(this),
        onForgotPasswordAttempt: this.onForgotPasswordAttempt.bind(this),
        onFormError: this.onFormError.bind(this),
        handleForgotPassword: this.handleForgotPassword.bind(this),
        handleForgotPasswordSuccess: this.handleForgotPasswordSuccess.bind(this),
        handleSignIn: this.handleSignIn.bind(this),
        handleCreateAccount: this.handleCreateAccount.bind(this),
        manualSetState: this.manualSetState.bind(this)
    };

    constructor(props) {
        super(props);

        const {isPasswordForgotSend} = props;

        this.state = {
            state: isSignedIn() ? STATE_LOGGED_IN : STATE_SIGN_IN,
            // eslint-disable-next-line react/no-unused-state
            isPasswordForgotSend,
            isLoading: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        const {
            isSignedIn,
            isPasswordForgotSend,
            showNotification,
        } = props;

        const {
            isPasswordForgotSend: currentIsPasswordForgotSend,
            state: myAccountState
        } = state;

        const stateToBeUpdated = {};

        // if (!isSignedIn) {
        //     stateToBeUpdated.state = STATE_SIGN_IN;
        // } else {
        //     stateToBeUpdated.state = STATE_LOGGED_IN;
        // }

        if (myAccountState !== STATE_LOGGED_IN && isSignedIn) {
            stateToBeUpdated.isLoading = false;
            showNotification('success', __('You are successfully logged in!'));
            stateToBeUpdated.state = STATE_LOGGED_IN;
        }

        if (myAccountState === STATE_LOGGED_IN && !isSignedIn) {
            stateToBeUpdated.state = STATE_SIGN_IN;
            showNotification('success', __('You are successfully logged out!'));
        }

        if (isPasswordForgotSend !== currentIsPasswordForgotSend) {
            stateToBeUpdated.isLoading = false;
            stateToBeUpdated.isPasswordForgotSend = isPasswordForgotSend;
            showNotification('success', __(`If there is an account associated with the provided address you will receive an email with a link to reset your password.`));
            stateToBeUpdated.state = STATE_SIGN_IN;
        }

        return Object.keys(stateToBeUpdated).length ? stateToBeUpdated : null;
    }

    componentDidUpdate(prevProps, prevState) {
        const {state: oldMyAccountState} = prevState;
        const {state: newMyAccountState} = this.state;

        if (oldMyAccountState === newMyAccountState) return;

        if (newMyAccountState === STATE_LOGGED_IN) {
            history.push({pathname: '/my-account/dashboard'});
        }
    }

    async onSignInSuccess(fields) {
        const {signIn, showNotification} = this.props;

        try {
            await signIn(fields);
        } catch (e) {
            this.setState({isLoading: false});
            showNotification('error', e.message);
        }
    }

    onSignInAttempt() {
        this.setState({isLoading: true});
    }

    onCreateAccountAttempt(_, invalidFields) {
        const {showNotification} = this.props;

        if (invalidFields) {
            showNotification('error', __('Incorrect data! Please resolve all field validation errors.'));
        }

        this.setState({isLoading: !invalidFields});
    }

    onCreateAccountSuccess(fields) {
        const {createAccount} = this.props;
        const {
            password,
            email,
            firstname,
            phone_number,
            lastname,
            is_subscribed,
            dob
        } = fields;

        const customerData = {
            customer: {
                firstname,
                dob,
                lastname,
                phone_number,
                email,
                is_subscribed
            },
            password
        };

        createAccount(customerData);
    }

    onForgotPasswordSuccess(fields) {
        const {forgotPassword} = this.props;
        forgotPassword(fields);
    }

    onForgotPasswordAttempt() {
        this.setState({isLoading: true});
    }

    onFormError() {
        this.setState({isLoading: false});
    }

    handleForgotPassword(e) {
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({state: STATE_FORGOT_PASSWORD});
    }

    handleForgotPasswordSuccess() {
        this.setState({state: STATE_FORGOT_PASSWORD_SUCCESS});
    }

    handleSignIn(e) {
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({state: STATE_SIGN_IN});
    }

    handleCreateAccount(e) {
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({state: STATE_CREATE_ACCOUNT});
    }

    manualSetState(state) {
        this.setState({state: state})
    }

    render() {
        return (
            <MyAccountOverlay
                {...this.props}
                {...this.state}
                {...this.containerFunctions}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountOverlayContainer);
