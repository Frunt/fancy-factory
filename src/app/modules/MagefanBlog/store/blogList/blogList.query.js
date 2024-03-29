import {Field, Fragment} from 'Util/Query';

/**
 * Product List Query
 * @class ProductListQuery
 */
export class BlogListQuery {
    constructor() {
        this.options = {};
    }

    getQuery(options) {
        if (!options) throw new Error('Missing argument `options`');

        this.options = options;

        return this._getProductsField();
    }

    _getProductsField() {
        const products = new Field('blogSearch')
            .addFieldList(this._getProductFields());

        this._getProductArguments().forEach(arg => products.addArgument(...arg));

        return products;
    }

    _getFilterArgumentMap() {
        return {
            post_url: url => [`post_url: ${url}`],
            categoryIds: id => [`category_id: { eq: ${id} }`],
            categoryUrlPath: url => [`category_url_key: ${url}`],
            productUrlPath: url => [`url_key: { eq: ${url}}`],
            customFilters: (filters = {}) => Object.entries(filters).reduce((acc, [key, attribute]) => (
                attribute.length ? [...acc, `${key}: { in: [ ${attribute.join(',')} ] } `] : acc
            ), []),
            query: query => [`query:${query}`],
            newToDate: date => [`news_to_date: { gteq: ${date} }`],
            conditions: conditions => [`conditions: { eq: ${conditions} }`]
        };
    }

    _getArgumentsMap() {
        const {requireInfo} = this.options;
        const filterArgumentMap = this._getFilterArgumentMap();

        return {
            currentPage: {type: 'Int!'},
            pageSize: {
                type: 'Int!',
                handler: option => (requireInfo ? 1 : option)
            },
            query: {
                type: 'String!',
                handler: option => encodeURIComponent(option)
            },
            sort: {
                type: 'SortEnum!',
                handler: ({sortDirection}) => `${sortDirection || 'DESC'}`
            },
            filter: {
                type: 'blogFilter!',
                handler: (options = {}) => `{${Object.entries(options).reduce(
                    (acc, [key, option]) => ((option && filterArgumentMap[key])
                            ? [...acc, ...filterArgumentMap[key](option)]
                            : acc
                    ), []
                ).join(',')}}`
            }
        };
    }

    _getProductArguments() {
        const {args} = this.options;
        const argumentMap = this._getArgumentsMap();

        return Object.entries(args).reduce((acc, [key, arg]) => {
            if (!arg) return acc;
            const {type, handler = option => option} = argumentMap[key];
            return [...acc, [key, type, handler(arg)]];
        }, []);
    }

    _getProductFields() {
        const {requireInfo} = this.options;

        // if (requireInfo) {
        //     return [
        //         this._getSortField(),
        //         this._getFiltersField()
        //     ];
        // }

        return [
            'totalCount',
            this._getItemsField(),
            // this._getPageInfoField()
        ];
    }

    _getRelatedPosts() {
        return new Field('related_posts').addFieldList(['title', 'url_key'])
    }

    _getProductInterfaceFields() {
        const {isSinglePost} = this.options;

        return [
            'post_id',
            'short_content',
            'media_gallery',
            'title',
            'url_key',
            'featured_img',
            'publish_time',
            this._getCategoriesField(),
            ...(isSinglePost
                ? [
                    'meta_title',
                    'meta_keyword',
                    'content',
                    'meta_description',
                    this._getBreadcrumbsField(),
                    this._getRelatedPosts(),
                ] : [])
        ]
    }

    _getItemsField() {
        return new Field('posts')
            .addFieldList(this._getProductInterfaceFields());
    }

    _getProductField() {
        return new Field('product')
            .addFieldList(this._getProductInterfaceFields(true));
    }

    _getShortDescriptionFields() {
        return [
            'html'
        ];
    }

    _getShortDescriptionField() {
        return new Field('short_description')
            .addFieldList(this._getShortDescriptionFields());
    }

    _getBreadcrumbFields() {
        return [
            'category_name',
            'category_url_key'
        ];
    }

    _getBreadcrumbsField() {
        return new Field('breadcrumbs')
            .addFieldList(this._getBreadcrumbFields());
    }

    _getCategoryFields() {
        return [
            'title',
            'url_path',
            this._getBreadcrumbsField()
        ];
    }

    _getCategoriesField() {
        return new Field('categories')
            .addFieldList(this._getCategoryFields());
    }

    _getAmountFields() {
        return [
            'value',
            'currency'
        ];
    }

    _getAmountField() {
        return new Field('amount')
            .addFieldList(this._getAmountFields());
    }

    _getMinimalPriceFields() {
        return [
            this._getAmountField()
        ];
    }

    _getMinimalPriceField() {
        return new Field('minimalPrice')
            .addFieldList(this._getMinimalPriceFields());
    }

    _getRegularPriceFields() {
        return [
            this._getAmountField()
        ];
    }

    _getRegularPriceField() {
        return new Field('regularPrice')
            .addFieldList(this._getRegularPriceFields());
    }

    _getPriceFields() {
        return [
            this._getMinimalPriceField(),
            this._getRegularPriceField()
        ];
    }

    _getPriceField() {
        return new Field('price')
            .addFieldList(this._getPriceFields());
    }

    _getThumbnailFields() {
        return [
            'url',
            'path',
            'label'
        ];
    }

    _getThumbnailField() {
        return new Field('thumbnail')
            .addFieldList(this._getThumbnailFields());
    }

    _getAttributeOptionField() {
        return [
            'label',
            'value',
            this._getSwatchDataField()
        ];
    }

    _getAttributeOptionsField() {
        return new Field('attribute_options')
            .addFieldList(this._getAttributeOptionField());
    }

    _getAttributeFields(isVariant) {
        return [
            'attribute_id',
            'attribute_value',
            'attribute_code',
            'attribute_type',
            'attribute_label',
            ...(!isVariant
                    ? [
                        this._getAttributeOptionsField()
                    ]
                    : []
            )
        ];
    }

    _getAttributesField(isVariant) {
        return new Field('attributes')
            .addFieldList(this._getAttributeFields(isVariant));
    }

    _getMediaGalleryFields() {
        return [
            'id',
            'file',
            'label',
            'position',
            'disabled',
            'media_type',
            'types'
        ];
    }

    _getMediaGalleryField() {
        return new Field('media_gallery_entries')
            .addFieldList(this._getMediaGalleryFields());
    }

    _getProductLinksField() {
        return new Field('product_links')
            .addFieldList(this._getProductLinkFields());
    }

    _getDescriptionFields() {
        return [
            'html'
        ];
    }

    _getDescriptionField() {
        return new Field('description')
            .addFieldList(this._getDescriptionFields());
    }

    _getProductLinkFields() {
        return [
            'position',
            'link_type',
            'linked_product_sku'
        ];
    }

    _getRatingVoteFields() {
        return [
            'vote_id',
            'rating_code',
            'percent'
        ];
    }

    _getRatingVotesField() {
        return new Field('rating_votes')
            .addFieldList(this._getRatingVoteFields());
    }

    _getReviewFields() {
        return [
            'review_id',
            'nickname',
            'title',
            'detail',
            'created_at',
            this._getRatingVotesField()
        ];
    }

    _getReviewsField() {
        return new Field('reviews')
            .addFieldList(this._getReviewFields());
    }

    _getReviewSummaryFields() {
        return [
            'rating_summary',
            'review_count'
        ];
    }

    _getReviewSummaryField() {
        return new Field('review_summary')
            .addFieldList(this._getReviewSummaryFields());
    }

    _getValueFields() {
        return [
            'value_index'
        ];
    }

    _getValuesField() {
        return new Field('values')
            .addFieldList(this._getValueFields());
    }

    _getConfigurableOptionFields() {
        return [
            'attribute_code',
            this._getValuesField()
        ];
    }

    _getConfigurableOptionsField() {
        return new Field('configurable_options')
            .addFieldList(this._getConfigurableOptionFields());
    }

    _getVariantFields() {
        return [
            this._getProductField()
        ];
    }

    _getVariantsField() {
        return new Field('variants')
            .addFieldList(this._getVariantFields());
    }

    _getConfigurableProductFragmentFields() {
        return [
            this._getConfigurableOptionsField(),
            this._getVariantsField()
        ];
    }

    _getConfigurableProductFragment() {
        return new Fragment('ConfigurableProduct')
            .addFieldList(this._getConfigurableProductFragmentFields());
    }

    _getSortOptionFields() {
        return [
            'value',
            'label'
        ];
    }

    _getSortOptionsField() {
        return new Field('options')
            .addFieldList(this._getSortOptionFields());
    }

    _getSortFields() {
        return [
            this._getSortOptionsField()
        ];
    }

    _getSortField() {
        return new Field('sort_fields')
            .addFieldList(this._getSortFields());
    }

    _getSwatchDataFields() {
        return [
            'type',
            'value'
        ];
    }

    _getSwatchDataField() {
        return new Field('swatch_data')
            .addFieldList(this._getSwatchDataFields());
    }

    _getFilterItemSwatchFragmentFields() {
        return [
            'label',
            this._getSwatchDataField()
        ];
    }

    _getFilterItemSwatchFragment() {
        return new Fragment('SwatchLayerFilterItem')
            .addFieldList(this._getFilterItemSwatchFragmentFields());
    }

    _getFilterItemFields() {
        return [
            'label',
            'value_string',
            this._getFilterItemSwatchFragment()
        ];
    }

    _getFilterItemsField() {
        return new Field('filter_items')
            .addFieldList(this._getFilterItemFields());
    }

    _getFilterFields() {
        return [
            'name',
            'request_var',
            this._getFilterItemsField()
        ];
    }

    _getFiltersField() {
        return new Field('filters')
            .addFieldList(this._getFilterFields());
    }

    _getPageInfoField() {
        return new Field('page_info')
            .addField('current_page')
            .addField('total_pages');
    }
}

export default new BlogListQuery();
