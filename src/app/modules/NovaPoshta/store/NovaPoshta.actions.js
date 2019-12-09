const GET_CITY = 'GET_CITY';
const GET_WAREHOUSES = 'GET_WAREHOUSES';

const getCity = city => ({
    type: GET_CITY,
    city

});

const getWarehouses = warehouses => ({
    type: GET_WAREHOUSES,
    warehouses
});

export {GET_CITY, GET_WAREHOUSES, getCity, getWarehouses}