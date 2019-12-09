import {Field} from "Util/Query";

export const getLiqPayConfig = new Field('liqPayConfiguration')
        .addFieldList(['gateway_url', 'prefix', 'private_key', 'public_key', 'suffix'])