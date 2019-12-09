import {Field} from "Util/Query";

class MagefanBlogCategoryQuery {
    constructor() {
        this.options = {};
    }

    getQuery(options = {}) {
        this.options = options;

        return new Field('blogCategory')
            .addArgument(...this._getConditionalArguments())
            .addFieldList(this._getDefaultFields())
            .addField(this._getChildrenFields());
    }

    _getConditionalArguments() {
        // const {categoryUrlPath, categoryIds} = this.options;
        // if (categoryUrlPath) return ['url_key', 'String!', categoryUrlPath];
        // if (categoryIds) return ['id', 'Int!', categoryIds];
        return ['url_key', 'String!', ''];
        // throw new Error(__('Can not query category without ID/URL_PATH not specified.'));
    }

    _getChildrenFields() {
        return new Field('children')
            .addFieldList(this._getDefaultFields());
    }

    _getPostsFields(){
        return new Field('posts').addField('totalCount')
    }

    _getBreadcrumbsField() {
        return new Field('breadcrumbs')
            .addFieldList(this._getBreadcrumbFields());
    }

    _getBreadcrumbFields() {
        return [
            'category_name',
            'category_url_key'
        ];
    }

    _getDefaultFields() {
        return [
            'category_id',
            'content',
            'meta_title',
            'url',
            'url_path',
            'title',
            'meta_title',
            'meta_keyword',
            'meta_description',
            this._getPostsFields(),
            this._getBreadcrumbsField()
        ];
    }
}

export default new MagefanBlogCategoryQuery()