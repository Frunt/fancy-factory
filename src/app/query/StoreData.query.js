import {Field} from "Util/Query";

class StoreDataQuery {
    getStoresData() {
        const query = new Field('storesData')
            .addField(this._getStoresDataItems());
        return query;
    }

    _getStoresDataItems() {
        return new Field('items').addFieldList(['store_code', 'store_group', 'name', 'locale']).addField(this._getStoresCurrencies())
    }

    _getStoresCurrencies() {
        return new Field('currency').addFieldList(['default_display_currency_code', 'default_display_currency_symbol'])
    }
}

export {StoreDataQuery};
export default new StoreDataQuery();