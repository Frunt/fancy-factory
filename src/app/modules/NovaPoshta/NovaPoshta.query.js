import {Field} from 'Util/Query';

class NovaPoshtaQuery {
    getCities() {
        const items = new Field('items').addFieldList(['description', 'description_ru', 'id']);
        const args = this._prepareFilter([{
            field: 'description_ru'
        }]);
        const query = new Field('npCities');
        query.addArgument('pageSize', 'Int', 10000);
        query.addArgument('filter', 'CityFilterInput', args.filter).addField(items);
        return query
    }

    getWarehouses(options) {
        const args = this._prepareFilter([{
            field: 'city_id',
            data: `city_id: { eq: ${options.city_id} }`
        }]);
        const items = new Field('items').addFieldList(['description', 'description_ru', 'city_id', 'id']);
        const query = new Field('npWarehouses');
        query.addArgument('filter', 'WarehouseFilterInput', args.filter).addField(items);
        return query
    }

    _prepareFilter(fields) {
        const filterList = [];
        const pushToList = (value, formatted) => {
            if (typeof value === 'object') {
                if (value && Object.keys(value).length) {
                    filterList.push(formatted);
                }
            } else if (value) {
                filterList.push(formatted);
            }
        };
        fields.forEach(item => {
            pushToList(item.field, item.data);
        });
        const args = {};
        args.filter = `{${filterList.join(',')}}`;
        return args
    }

    getCitiesOnline(cityName) {
        const query = new Field('npCitiesOnline')
            .addArgument('cityName', 'String', cityName)
            .addArgument('limit', 'Int', 100)
            .addField(new Field('items').addFieldList([
                'area',
                'id',
                'ref',
                'region',
                'mainDescription'
            ]));
        return query;
    }

    getAddressesOnline({streetName, settlementRef}) {
        const query = new Field('npAddressesOnline')
            .addArgument('streetName', 'String', streetName)
            .addArgument('settlementRef', 'String', settlementRef)
            .addArgument('limit', 'Int', 100)
            .addField(new Field('items').addFieldList([
                'present',
                'settlementRef',
                'settlementStreetDescription',
                'settlementStreetRef',
                'streetsType',
                'streetsTypeDescription'
            ]))

        return query;
    }

}

export default new NovaPoshtaQuery();