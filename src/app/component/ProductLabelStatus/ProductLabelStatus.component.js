import React from "react";

const _checkDate = (to_data, from_date) => {
    const current = new Date();
    if (to_data && from_date) {
        const from = new Date(from_date);
        const to = new Date(to_data);
        return (current > from) && (current < to);
    } else if (from_date) {
        const from = new Date(from_date);
        return (current > from)
    } else if (to_data) {
        const to = new Date(to_data);
        return (current < to);
    }
    return false
};


const _checkNew = (product) => {
    const {new_to_date, new_from_date} = product;
    return _checkDate(new_to_date, new_from_date)
};

const _checkSale = (price) => {
    if (!price) return false;
    const {special_to_date, special_from_date} = price;
    return _checkDate(special_to_date, special_from_date)
};

const _checkStatus = (attributes) => {
    if (!attributes) return false;
    let hasStatus = false;
    try {
        attributes.forEach(({attribute_code, attribute_value}) => {
            if (attribute_code === 'additional_product_status' && attribute_value) {
                hasStatus = true;
            }
        });
    } catch (e) {
        // console.warn(e)
    }
    return hasStatus;
};

const _getStatus = (attributes) => {
    let status = '';
    const attrStatus = attributes.filter(({attribute_code}) => attribute_code === 'additional_product_status')[0];
    const {attribute_options, attribute_value} = attrStatus;
    attribute_options.forEach(({value, label}) => {
        if (attribute_value === value) {
            status = label
        }
    });
    return status;
};

const ProductLabelStatus = ({product}) => {
    const isNew = _checkNew(product);
    const isSale = _checkSale(product);
    if (isNew) {
        return <span block="ProductCard" elem="Label" className="label-new">{__('New')}</span>;
    } else if (isSale) {
        return <span block="ProductCard" elem="Label" className="label-sale">%</span>;
    } else {
        return ''
    }
};

export default ProductLabelStatus


export {_checkNew, _checkSale, _checkStatus, _getStatus}
