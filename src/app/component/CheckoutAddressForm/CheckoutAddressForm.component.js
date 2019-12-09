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
import FormPortal from 'Component/FormPortal';
import {debounce} from 'Util/Request';
import MyAccountAddressForm from 'Component/MyAccountAddressForm/MyAccountAddressForm.component';
import './CheckoutAddressForm.style';
import {NovaPoshta, NovaPoshtaCourier} from "Modules/NovaPoshta";
import React from "react";
import Field from "Component/Field";
import {
    getCourierFieldMap,
    getNpFieldMap,
    getStorePickupFieldMap,
    RenderFreeSippingFields
} from "Component/CheckoutAddressForm/helpers";
import Link from "Component/Link";

export const UPDATE_STATE_FREQUENCY = 1000; // (ms)

class CheckoutAddressForm extends MyAccountAddressForm {
    static propTypes = {
        ...MyAccountAddressForm.propTypes,
        id: PropTypes.string.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func
    };

    static defaultProps = {
        ...MyAccountAddressForm.defaultProps,
        onShippingEstimationFieldsChange: () => {
        }
    };

    onChange = debounce((key, value) => {
        this.setState(() => ({[key]: value}));
    }, UPDATE_STATE_FREQUENCY);

    constructor(props) {
        super(props);

        const {
            address: {region: {region = ''} = {}}
        } = this.props;

        // TODO: get from region data
        this.state = {
            ...this.state,
            region,
            city: '',
            postcode: ''
        };

        this.estimateShipping();
    }

    componentDidUpdate(_, prevState) {
        const {
            countryId,
            regionId,
            region,
            city,
        } = this.state;

        const {
            countryId: prevCountryId,
            regionId: prevRegionId,
            region: prevRegion,
            city: prevCity
        } = prevState;

        if (
            countryId !== prevCountryId
            || regionId !== prevRegionId
            || city !== prevCity
            || region !== prevRegion
        ) {
            this.estimateShipping();
        }
    }

    estimateShipping() {
        const {onShippingEstimationFieldsChange} = this.props;

        const {
            countryId,
            regionId,
            region,
            city
        } = this.state;

        onShippingEstimationFieldsChange({
            country_id: countryId,
            region_id: regionId,
            region,
            city
        });
    }

    get fieldMap() {
        const {countryId} = this.state;
        const {countries, address, selectedShippingMethod} = this.props;
        const {street = []} = address;
        const defaultFields = {
            country_id: {
                type: 'select',
                label: __('Country'),
                validation: ['notEmpty'],
                value: countryId,
                selectOptions: countries.map(({id, label}) => ({id, label, value: id})),
                onChange: this.onCountryChange
            },
            city: {
                label: __('City'),
                onChange: value => this.onChange('city', value),
                validation: ['notEmpty']
            },
            postcode: {
                label: __('Zip/Postal code'),
                validation: ['notEmpty']
            },
            street: {
                label: __('Street address'),
                value: street[0],
                validation: ['notEmpty']
            }
        };
        if (selectedShippingMethod) {
            const {method_code} = selectedShippingMethod;
            if (method_code === 'warehouse') {
                return getNpFieldMap(this, countryId, countries, method_code)
            } else if (method_code === 'freeshipping') {
                return getStorePickupFieldMap()
            } else if (method_code === 'courier') {
                return getCourierFieldMap(this, countryId, countries, method_code)
            } else {
                return defaultFields
            }
        }

        return defaultFields;
    }

    renderField = fieldEntry => {
        if (fieldEntry[1].isNovaPoshta) {
            return this.renderNovaPoshtaComponent()
        } else if (fieldEntry[1].isNovaPoshtaCourier) {
            return this.renderNovaPoshtaCourierComponent()
        } else if (fieldEntry[1].free_shipping) {
            return this.renderFreeSippingFields()
        } else {
            return <Field {...this.getDefaultValues(fieldEntry)} />
        }
    };

    renderFreeSippingFields() {
        const {id} = this.props;
        return <RenderFreeSippingFields
            id={id}
            key={id}
        />
    }

    renderNovaPoshtaComponent() {
        const {address: {city, np_city, np_warehouse_label}, id} = this.props;
        return (
            <NovaPoshta
                defaultCity={city}
                defaultCityId={np_city}
                id={id}
                key={id}
                defaultWarehouse={np_warehouse_label}
            />
        )
    }

    renderNovaPoshtaCourierComponent() {
        const {address: {city, np_city, street}, id} = this.props;
        return (<NovaPoshtaCourier
            defaultCity={city}
            key={id}
            // defaultStreet={street[0]}
            defaultCityId={np_city}
            id={id}
        />)
    }

    render() {
        const {id} = this.props;
        return (
            <FormPortal id={id}>
                <div
                    block="FieldForm"
                    mix={{block: 'CheckoutAddressForm'}}
                >
                    {this.renderFields()}
                    <Link block="FieldForm" elem="Link" to="/delivery" target="_blank">
                        {__('Shipping and payment information')}
                    </Link>
                </div>
            </FormPortal>
        );
    }
}

export default CheckoutAddressForm;
