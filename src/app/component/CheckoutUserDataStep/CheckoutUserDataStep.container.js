import {CheckoutUserDataStepComponent} from "./CheckoutUserDataStep.component";
import {connect} from "react-redux";
import {MyAccountDispatcher} from "Store/MyAccount";

const mapStateToProps = state => ({
    customer: state.MyAccountReducer.customer,
    isSignedIn: state.MyAccountReducer.isSignedIn
});

const mapDispatchToProps = dispatch => ({
    requestCustomerData: () => dispatch(MyAccountDispatcher.requestCustomerData)
});

class CheckoutUserDataStepContainer extends React.PureComponent {
    containerFunctions = {};

    state = {};

    componentDidMount() {
        const {requestCustomerData, isSignedIn} = this.props;
        if (isSignedIn) {
            requestCustomerData()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {firstStepData, customer} = this.props
        if (Object.keys(firstStepData).length === 0 && customer) {
            firstStepData.firstname = customer.firstname;
            firstStepData.lastname = customer.lastname;
            firstStepData.telephone = customer.telephone;
            firstStepData.email = customer.email;
            this.setState({firstStepData})
        }
    }

    render() {
        return (
            <>
                <h3 block="Checkout" elem="StepTitle">{__('Personal data')}</h3>
                <CheckoutUserDataStepComponent
                    {...this.props}
                    {...this.state}
                    {...this.containerFunctions}
                />
            </>
        )
    }
}

CheckoutUserDataStepContainer = connect(mapStateToProps, mapDispatchToProps)(CheckoutUserDataStepContainer);

export {CheckoutUserDataStepContainer}