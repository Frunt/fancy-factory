import {Field} from "Util/Query";

class Mageplaza_BetterPopupQuery {
    getPopupData() {
        const query = new Field('PopupData');
        query.addField('is_enable');
        query.addField(this.what_to_show());
        query.addField(this.when_to_show());
        query.addField(this.where_to_show());
        return query
    }

    what_to_show() {
        return new Field('what_to_show')
            .addFieldList([
                'background_color',
                'text_color',
                'show_congratulation_fireworks'
            ])
            .addField(new Field('popup_content')
                .addFieldList(['coupon_code', 'popup_content', 'success_content']))
            .addField(new Field('is_responsive')
                .addFieldList(['height', 'is_enable', 'width']))
    }

    when_to_show() {
        return new Field('when_to_show')
            .addFieldList(['button_label', 'floating_button', 'popup_appears', 'scroll_x', 'time_x_seconds', 'will_show_again'])
    }

    where_to_show() {
        return new Field('where_to_show')
            .addFieldList(['exclude_page_urls', 'include_page_urls', 'which_page_to_show'])
    }
}

export default new Mageplaza_BetterPopupQuery()