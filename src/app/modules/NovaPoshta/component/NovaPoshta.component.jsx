import {connect} from 'react-redux';
import React from 'react';
import {NovaPoshtaDispatcher} from 'Modules/NovaPoshta';
import Field from 'Component/Field';
import Loader from 'Component/Loader';
import PropTypes from "prop-types";
import FormPortal from "Component/FormPortal";

class NovaPoshtaComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            warehouse: false,
            isLoading: false,
        };
    }


    componentDidMount() {
        const {getCity} = this.props;
        getCity()
    }

    getWarehouses(city_id) {
        const {getWarehouses} = this.props;
        getWarehouses({city_id});
        const value = this.getCityDataSource().find(ss => ss.value == city_id).label;
        this.setState({
            isLoading: true,
            value,
            city_id,
        });
    }

    getDataSource() {
        const {npWarehouses: {items}} = this.props;
        const options = [];
        items.forEach(item => options.push({
            value: item.id,
            label: item.description_ru
        }));
        return options;
    }

    componentWillUnmount() {
        this.props.clearWarehouses()
    }

    getCityDataSource() {
        const {npCities: {items}} = this.props;
        const options = [];
        items.forEach(item => options.push({
            value: item.id,
            label: item.description_ru
        }));
        return options;
    }

    onGetKey(warehouse) {
        const {getNpWarehouse} = this.props;
        const getWarehouseLabel = (id) => {
            return this.getDataSource().find(ss => ss.value === parseInt(id)).label;
        };
        if (getNpWarehouse) getNpWarehouse(warehouse);
        this.setState({warehouse, warehouseLabel: getWarehouseLabel(warehouse)});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.npWarehouses.items !== prevProps.npWarehouses.items) {
            if (this.value) {
                this.setState({value: this.value})
            }
            if (this.props.defaultWarehouse) {
                const current = this.props.npWarehouses.items.filter(ss => ss.description_ru === this.props.defaultWarehouse);
                if (current.length === 0) {
                    this.onGetKey(current[0])
                } else {
                    this.onGetKey(this.props.npWarehouses.items[0].id);
                }
            } else {
                this.onGetKey(this.props.npWarehouses.items[0].id);
            }
            this.setState({isLoading: false});
        }
    }

    render() {
        const {id: formId} = this.props;
        const {value, isLoading, warehouse, city_id, warehouseLabel} = this.state;
        const options = this.getDataSource();

        return (<FormPortal id={formId}>
            <Field name={'np_city'} id={'np_city'} type={'hidden'} value={city_id}/>
            <Field name={'city'} id={'city'} type={'hidden'} value={value}/>
            <Field name={'region'} id={'region'} type={'hidden'} value={value}/>
            <Field name={'street'} id={'street'} type={'hidden'} value={warehouseLabel}/>
            <Field name={'np_warehouse_label'} id={'np_warehouse_label'} type={'hidden'}
                   value={warehouseLabel}/>
            <Field
                block="ProductSort"
                elem="Select"
                label={__('City')}
                name={'np_city_label'}
                validation={['notEmpty']}
                placeholder={__('Select city')}
                onChange={e => this.getWarehouses(e)}
                type="select"
                value={city_id}
                selectOptions={this.getCityDataSource()}
                id="np_city_label"
            />
            <Field
                block="ProductSort"
                elem="Select"
                label={__('Warehouses')}
                name={'np_warehouse'}
                validation={['notEmpty']}
                placeholder={__('Select Warehouses')}
                onChange={e => this.onGetKey(e)}
                value={warehouse}
                type="select"
                selectOptions={options}
                id="np_warehouse"
            />
            <Loader isLoading={isLoading}/>
        </FormPortal>);
    }
}


const mapDispatchToProps = dispatch => ({
    getCity: options => NovaPoshtaDispatcher.getCity(dispatch, options),
    getWarehouses: options => NovaPoshtaDispatcher.getWarehouses(dispatch, options),
    clearWarehouses: () => NovaPoshtaDispatcher.clearWarehouses(dispatch)
});

const mapStateToProps = state => ({
    npCities: state.NovaPoshtaReducer.npCities,
    npWarehouses: state.NovaPoshtaReducer.npWarehouses
});


const NovaPoshta = connect(mapStateToProps, mapDispatchToProps)(NovaPoshtaComponent);
NovaPoshta.propTypes = {
    getNpSelectedCity: PropTypes.func,
    getNpWarehouse: PropTypes.func
};
export {NovaPoshtaComponent, NovaPoshta};