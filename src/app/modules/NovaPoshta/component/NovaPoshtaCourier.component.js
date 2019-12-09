import FormPortal from "Component/FormPortal";
import React, {useState} from "react";
import Field from "Component/Field/Field.container";
import PerfectScrollbar from "react-perfect-scrollbar";
import {fetchQuery} from "Util/Request";
import {NovaPoshtaQuery} from "Modules/NovaPoshta";

const NPCourierCity = (props) => {
    const {selectCity, formId} = props;
    const [stateCity, setStateCity] = useState({
        cityValue: '',
        npCitiesOnline: [],
        selectedCity: {},
        opened: false
    });

    const {cityValue, npCitiesOnline, selectedCity, opened} = stateCity;

    const getCity = (cityValue) => {
        fetchQuery(NovaPoshtaQuery.getCitiesOnline(cityValue))
            .then(res => {
                stateCity.npCitiesOnline = res.npCitiesOnline.items;
                stateCity.opened = true;
                setStateCity(Object.assign({}, stateCity))
            })
    };

    const cityAutocomplete = (value) => {
        stateCity.cityValue = value;
        setStateCity(stateCity);
        getCity(value);
    };

    const submit = (item) => {
        stateCity.selectedCity = item;
        stateCity.opened = false;
        stateCity.cityValue = item.mainDescription;
        selectCity(item);
        setStateCity(Object.assign({}, stateCity));
    };

    return (
        <FormPortal id={formId}>
            <Field name={'region'} id={'region'} type={'hidden'} value={selectedCity.area}/>
            <Field name={'np_city'} id={'np_city'} type={'hidden'} value={selectedCity.id}/>
            <Field name={'np_city_label'} id={'np_city_label'} type={'hidden'} value={selectedCity.mainDescription}/>
            <div className="dropdown-list">
                <Field
                    id={'city'}
                    label={__('City')}
                    name={'city'}
                    value={cityValue}
                    type={'text'}
                    validation={['notEmpty']}
                    onChange={value => cityAutocomplete(value)}
                />
                <PerfectScrollbar
                    className={'dropdown-list__content ' + ((npCitiesOnline.length > 0 && opened) ? 'opened' : '')}>
                    {(npCitiesOnline || []).map(item => <div className="dropdown-list__item" key={item.id}
                                                             onClick={() => submit(item)}>{item.mainDescription}</div>)}
                </PerfectScrollbar>
            </div>
        </FormPortal>)
};

const NPCourierStreet = (props) => {
    const {selectedCity, formId} = props;
    const {ref: settlementRef} = selectedCity;
    const [stateStreet, setStateStreet] = useState({
        streetName: '',
        npAddressesOnline: [],
        selectedAddress: {},
        opened: false
    });
    const {streetName, npAddressesOnline, opened} = stateStreet;
    const getStreet = (streetName) => {
        fetchQuery(NovaPoshtaQuery.getAddressesOnline({streetName, settlementRef}))
            .then(res => {
                stateStreet.npAddressesOnline = res.npAddressesOnline.items;
                stateStreet.opened = true;
                setStateStreet(Object.assign({}, stateStreet))
            })
    };

    const streetAutocomplete = (streetName) => {
        stateStreet.streetName = streetName;
        setStateStreet(stateStreet);
        getStreet(streetName)
    };

    const submit = (item) => {
        stateStreet.selectedAddress = item;
        stateStreet.opened = false;
        stateStreet.streetName = item.present;
        setStateStreet(Object.assign({}, stateStreet))
    };

    return (
        <FormPortal id={formId}>
            <div className="dropdown-list">
                <Field
                    id={'street'}
                    label={__('Street')}
                    name={'street'}
                    value={streetName}
                    type={'text'}
                    disabled={Object.keys(selectedCity).length === 0}
                    validation={['notEmpty']}
                    onChange={value => streetAutocomplete(value)}
                />
                <PerfectScrollbar
                    className={'dropdown-list__content ' + ((npAddressesOnline.length > 0 && opened) ? 'opened' : '')}>
                    {(npAddressesOnline || []).map(item => <div className="dropdown-list__item" key={item.id}
                                                                onClick={() => submit(item)}>{item.settlementStreetDescription}</div>)}
                </PerfectScrollbar>
            </div>
        </FormPortal>
    )

};

const NovaPoshtaCourierComponent = (props) => {
    const {id: formId} = props;
    const [state, setState] = useState({selectedCity: {}});
    const {selectedCity} = state;
    const selectCity = (selectedCity) => {
        setState({selectedCity})
    };
    return (<>
            <NPCourierCity formId={formId} selectCity={selectCity}/>
            <NPCourierStreet
                formId={formId}
                selectedCity={selectedCity}
            />
        </>
    )
};

export {
    NovaPoshtaCourierComponent
}