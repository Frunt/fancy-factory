import PropTypes from "prop-types";
import Link from "Component/Link";
import FieldForm from "Component/FieldForm";

export class CheckoutUserDataStepComponent extends FieldForm {
    static propTypes = {
        onSave: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.onFormSuccess = props.setUserData.bind(this);
    }

    getDefaultValues([key, props]) {
        const {firstStepData} = this.props;
        props.value = firstStepData[key] || '';
        return super.getDefaultValues([key, props])
    }

    get fieldMap() {
        return {
            firstname: {
                label: __('First name'),
                validation: ['notEmpty'],
            },
            lastname: {
                label: __('Last name'),
                validation: ['notEmpty']
            },
            telephone: {
                label: __('Phone number'),
                type: 'phone',
                validation: ['notEmpty', 'telephone']
            },
            email: {
                label: __('Email'),
                validation: ['notEmpty', 'email']
            }
        };
    }

    renderActions() {
        return (
            <div block="Checkout" elem="StepButtons">
                <Link to={'/cart'} className="button-prev">{__('Back to cart')}</Link>
                <button type="submit" block="Button">
                    {__('Next')}
                </button>
            </div>
        );
    }
}