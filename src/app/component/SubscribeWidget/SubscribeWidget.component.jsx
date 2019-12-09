import React from "react";
import {connect} from "react-redux";
import ContentWrapper from "Component/ContentWrapper";
import Form from "Component/Form";
import Field from "Component/Field";
import Loader from "Component/Loader";
import {SubscribeDispatcher} from 'Store/Subscribe'
import './SubscribeWidget.style.scss';

class SubscribeWidgetClass extends React.Component {
    state = {
        isLoading: false,
        success: false
    };

    onFormError() {
        this.setState({isLoading: false});
    }

    onSubscribeAttempt() {
        this.setState({isLoading: true, success: false});
    }

    onSubscribeSuccess(fields) {
        const {email} = fields;
        this.props.subscribe(email)
    }

    static getDerivedStateFromProps(props, state) {
        if (state.isLoading && props.subscribeCustomer) {
            return {
                isLoading: false,
                success: true
            }
        }
        return null
    }

    render() {
        const {isLoading, success} = this.state;
        return (
            <div
                mix={{block: 'Subscribe'}}
            >
                <ContentWrapper block="Subscribe" elem="Content" label={__('Website subscribe content')}>
                    <div
                        block={"Subscribe"}
                        elem={"Caption"}
                    >
                        <h2>{__('Dress your mailbox')}</h2>
                        <p dangerouslySetInnerHTML={{__html: __('Subscribe to our newsletter to find out about new product releases, %s self-reminders and a 15% discount %s on your next order', '<strong>', '</strong>')}}/>
                    </div>
                    <Form
                        key="forgot-password"
                        onSubmit={() => this.onSubscribeAttempt()}
                        onSubmitSuccess={fields => this.onSubscribeSuccess(fields)}
                        onSubmitError={() => this.onFormError()}
                    >
                        <Loader isLoading={isLoading}/>
                        <Field
                          type="text"
                          id="email"
                          name="email"
                          placeholder={__('Your e-mail')}
                          validation={['notEmpty', 'email']}/>
                        {success && <p className="Field-Message success">{__('Subscribed successfully')}</p>}
                        <button
                          type="submit"
                          className={"Subscribe-Button"}>
                            {__('Subscribe')}
                        </button>
                    </Form>
                </ContentWrapper>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    subscribe: (email) => SubscribeDispatcher.subscribeToNewsLater(dispatch, email)
});

const mapStateToProps = state => ({
    subscribeCustomer: state.SubscribeReducer.subscribeCustomer
});

const SubscribeWidget = connect(mapStateToProps, mapDispatchToProps)(SubscribeWidgetClass);
export {SubscribeWidgetClass};
export default SubscribeWidget;
