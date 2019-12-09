export const GET_STORES_DATA = 'GET_STORES_DATA';

const getStoreData = (storeData) => ({
    type: GET_STORES_DATA,
    storeData
});

export {
    getStoreData
}