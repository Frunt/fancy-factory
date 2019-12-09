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

import {addressType} from 'Type/Account';
import {countriesType} from 'Type/Config';
import FieldForm from 'Component/FieldForm';

export const DEFAULT_COUNTRY_ID = 'UA';

class MyAccountAddressForm extends FieldForm {
    static propTypes = {
        address: addressType.isRequired,
        countries: countriesType.isRequired,
        onSave: PropTypes.func
    };

    static defaultProps = {
        onSave: () => {
        }
    };

    constructor(props) {
        super(props);
        const {
            countries,
            address: {country_id, region: {region_id} = {}}
        } = props;

        const countryId = country_id || DEFAULT_COUNTRY_ID;
        const country = countries.find(({id}) => id === countryId);
        const {available_regions: availableRegions} = country;
        const regions = availableRegions || [{}];
        const regionId = regions[0].id || region_id;

        this.state = {
            countryId,
            availableRegions,
            regionId
        };
    }

    onFormSuccess = (fields) => {
        if (fields.hasOwnProperty('street_1') || fields.hasOwnProperty('street_2')) {
            const street = [];
            street.push(fields.street);
            street.push(fields.street_1 || "");
            street.push(fields.street_2 || "");
            fields.street = street;
            delete fields.street_1;
            delete fields.street_2;
        }
        const {onSave} = this.props;
        const {region_id, region_string: region, ...newAddress} = fields;
        newAddress.region = {region_id, region};
        onSave(newAddress);
    };

    getRegionFields() {
        const {address: {region: {region} = {}}} = this.props;
        const {availableRegions, regionId} = this.state;

        if (!availableRegions || !availableRegions.length) {
            return {
                region_string: {
                    label: __('State/Province'),
                    value: region
                }
            };
        }

        return {
            region_id: {
                label: __('State/Province'),
                type: 'select',
                selectOptions: availableRegions.map(({id, name}) => ({id, label: name, value: id})),
                onChange: regionId => this.setState({regionId}),
                value: regionId
            }
        };
    }

    onCountryChange = (countryId) => {
        const {countries} = this.props;
        const country = countries.find(({id}) => id === countryId);
        const {available_regions} = country;

        this.setState({
            countryId,
            availableRegions: available_regions || []
        });
    };

    get fieldMap() {
        const {countryId} = this.state;
        const {countries, address} = this.props;
        const {street = []} = address;

        return {
            firstname: {
                label: __('First name'),
                validation: ['notEmpty']
            },
            lastname: {
                label: __('Last name'),
                validation: ['notEmpty']
            },
            telephone: {
                label: __('Phone number'),
                validation: ['notEmpty']
            },
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
                validation: ['notEmpty']
            },
            street: {
                label: __('Street address'),
                value: street[0],
                validation: ['notEmpty']
            },
            street_1: {
                label: __('House number'),
                value: street[1],
            },
            street_2: {
                label: __('Apartment'),
                value: street[2],
            },
            postcode: {
                label: __('Zip/Postal code'),
                validation: ['notEmpty']
            }
        };
    }

    getDefaultValues(fieldEntry) {
        const [key, {value}] = fieldEntry;
        const {address: {[key]: addressValue}} = this.props;

        return {
            ...super.getDefaultValues(fieldEntry),
            value: value !== undefined ? value : addressValue
        };
    }

    renderActions() {
        return (
            <button type="submit" block="Button">
                {__('Save changes')}
            </button>
        );
    }
}

export default MyAccountAddressForm;
