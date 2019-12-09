import {Field} from "Util/Query";

class StoreInformationQuery {
    getStoreInformation() {
        return new Field('storeInformation')
            .addFieldList([
                'phone',
                'hours',
                'street_line1',
                'postcode',
                'region_id',
                'country_id',
                'city'
            ])
    }
}

export default new StoreInformationQuery()