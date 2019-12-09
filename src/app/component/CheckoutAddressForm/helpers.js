import FormPortal from "Component/FormPortal";
import React from "react";
import Field from "Component/Field/Field.container";
import {connect} from "react-redux";

const getFieldsByShipment = () => {

};

const getStorePickupFieldMap = () => {
    return {
        free_shipping: {
            free_shipping: true
        },
    }
};

const getCourierFieldMap = (_this, countryId, countries, method_code) => {
    return {
        country_id: {
            type: 'select',
            label: __('Country'),
            validation: ['notEmpty'],
            value: countryId,
            selectOptions: countries.map(({id, label}) => ({id, label, value: id})),
            onChange: _this.onCountryChange
        },
        NovaPoshtaCourier: {
            isNovaPoshtaCourier: method_code,
        },
        street_1: {
            label: __('House number'),
            type: 'text',
            validation: ['notEmpty']
        },
        street_2: {
            label: __('Apartment'),
            type: 'text',
            validation: ['notEmpty', 'number']
        },
        postcode: {
            label: __('Zip/Postal code'),
            validation: ['notEmpty']
        },
    }
};

const getNpFieldMap = (_this, countryId, countries, method_code) => {
    return {
        country_id: {
            type: 'select',
            label: __('Country'),
            validation: ['notEmpty'],
            value: countryId,
            selectOptions: countries.map(({id, label}) => ({id, label, value: id})),
            onChange: _this.onCountryChange
        },
        NovaPoshta: {
            isNovaPoshta: method_code,
        },
        postcode: {
            label: __('Zip/Postal code'),
            validation: ['notEmpty']
        },
    }
};

let RenderFreeSippingFields = (props) => {
    const {
        id, storeInformation: {
            street_line1,
            hours,
            country_id, city, postcode, region_id
        }
    } = props;
    return (<>
        <div block="FieldForm" elem="FieldsText">
            <span>
                {__('You can pick up your order at our store:')}
            </span>
            <span>
                {city} {street_line1}
            </span>
            <span>{hours} {__('including weekends and holidays.')}</span>
        </div>
        <FormPortal id={id}>
            <Field name={'city'} id={'city'} type={'hidden'} value={city}/>
            <Field name={'street'} id={'street'} type={'hidden'} value={street_line1}/>
            <Field name={'country_id'} id={'country_id'} type={'hidden'} value={country_id}/>
            <Field name={'postcode'} id={'postcode'} type={'hidden'} value={postcode}/>
            <Field name={'region'} id={'region'} type={'hidden'} value={region_id}/>
        </FormPortal>
    </>)
};
const mapStateToProps = state => ({
    storeInformation: state.ConfigReducer.storeInformation,
});
RenderFreeSippingFields = connect(mapStateToProps)(RenderFreeSippingFields)

export {
    getStorePickupFieldMap,
    RenderFreeSippingFields,
    getFieldsByShipment,
    getNpFieldMap,
    getCourierFieldMap
}