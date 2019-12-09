import {BreadcrumbsDispatcher} from "Store/Breadcrumbs";
import {connect} from "react-redux";
import {PureComponent} from "react";
import {MagefanBlogCategoryDispatcher} from "Modules/MagefanBlog";
import {convertQueryStringToKeyValuePairs, getQueryParam, getUrlParam, setQueryParams} from "Util/Url";
import MagefanBlogPageComponent from "./MagefanBlogPage.component";
import BlogListDispatcher from 'Modules/MagefanBlog/store/blogList/blogList.dispatcher';
import {updateBlogLoadStatus} from "Modules/MagefanBlog/store/blogList/blogList.action";
import {withRouter} from "react-router";

export const mapStateToProps = state => ({
    blogCategory: state.MagefanBlogCategoryReducer.blogCategory,
    windowSize: state.ResizeReducer.windowSize
});

export const mapDispatchToProps = dispatch => ({
    requestCategory: options => MagefanBlogCategoryDispatcher.handleData(dispatch, options),
    updateBreadcrumbs: breadcrumbs => BreadcrumbsDispatcher.update(breadcrumbs, dispatch),
    requestBlogList: options => BlogListDispatcher.handleData(dispatch, options),
    updateBlogLoadStatus: isLoading => dispatch(updateBlogLoadStatus(isLoading))
});

export class MagefanBlogPageContainer extends PureComponent {
    static defaultProps = {
        categoryIds: 0,
        isOnlyPlaceholder: false
    };

    config = {
        sortKey: 'date',
        sortDirection: 'DESC'
    };

    componentDidUpdate(prevProps) {
        const {blogCategory: {category_id}, categoryIds, location} = this.props;
        const {blogCategory: {category_id: prevId}, categoryIds: prevCategoryIds} = prevProps;

        // update breadcrumbs only if category has changed
        if (category_id !== prevId) this._onCategoryUpdate();

        // ComponentDidUpdate fires multiple times, to prevent getting same data we check that url has changed
        // getIsNewCategory prevents getting Category data, when sort or filter options have changed
        if ((this._urlHasChanged(location, prevProps) && this.getIsNewCategory()) || categoryIds !== prevCategoryIds) {
            this._requestCategoryWithPageList();
        }
    }

    containerFunctions = {
        onSortChange: this.onSortChange.bind(this),
        getIsNewCategory: this.getIsNewCategory.bind(this),
    };

    onSortChange(sortDirection, sortKey) {
        const {location, history} = this.props;

        setQueryParams({sortKey}, location, history);
        setQueryParams({sortDirection}, location, history);
    }

    componentDidMount() {
        const {updateBreadcrumbs, isOnlyPlaceholder, updateBlogLoadStatus} = this.props;

        if (isOnlyPlaceholder) updateBlogLoadStatus(true);

        // request data only if URL does not match loaded category
        if (this.getIsNewCategory()) {
            this._requestCategoryWithPageList();
            updateBreadcrumbs({});
        } else {
            this._onCategoryUpdate();
        }
    }

    _requestCategory() {
        const {categoryIds, requestCategory} = this.props;
        const categoryUrlPath = !categoryIds ? this._getCategoryUrlPath() : null;

        requestCategory({
            categoryUrlPath,
            categoryIds
        });
    }

    containerProps = () => ({
        search: this._getSearchParam(),
        onSortChange: this.onSortChange.bind(this),
        selectedSort: this._getSelectedSortFromUrl(),
    });

    _compareQueriesWithFilter(search, prevSearch, filter) {
        const currentParams = filter(convertQueryStringToKeyValuePairs(search));
        const previousParams = filter(convertQueryStringToKeyValuePairs(prevSearch));
        return JSON.stringify(currentParams) === JSON.stringify(previousParams);
    }

    onSortChange(sortDirection, sortKey) {
        const {location, history} = this.props;

        setQueryParams({sortKey}, location, history);
        setQueryParams({sortDirection}, location, history);
    }

    _compareQueriesWithoutPage(search, prevSearch) {
        return this._compareQueriesWithFilter(
            search, prevSearch, ({page, ...filteredParams}) => filteredParams
        );
    }

    _getSelectedSortFromUrl() {
        const {location} = this.props;
        const {sortKey: defaultSortKey, sortDirection: defaultSortDirection} = this.config;
        const sortDirection = getQueryParam('sortDirection', location) || defaultSortDirection;
        const sortKey = getQueryParam('sortKey', location) || defaultSortKey;
        return {sortDirection, sortKey};
    }

    _urlHasChanged(location, prevProps) {
        const {pathname, search} = location;
        const {location: {pathname: prevPathname, search: prevSearch}} = prevProps;
        const pathnameHasChanged = pathname !== prevPathname;
        const searchQueryHasChanged = !this._compareQueriesWithoutPage(search, prevSearch);

        return pathnameHasChanged || searchQueryHasChanged;
    }

    _requestCategoryWithPageList() {
        this._requestCategory();
        this._requestCategoryProductsInfo();
    }

    _requestCategoryProductsInfo() {
        const {requestBlogList} = this.props;
        requestBlogList(this._getProductListOptions(this._getPageFromUrl()));
    }

    _getPageFromUrl() {
        const {location} = this.props;
        return +(getQueryParam('page', location) || 1);
    }

    _getProductListOptions(currentPage) {
        const {categoryIds} = this.props;
        const categoryUrlPath = !categoryIds ? this._getCategoryUrlPath() : null;
        return {
            args: {
                filter: {
                    categoryUrlPath,
                    categoryIds,
                },
                query: this._getSearchParam(),
                currentPage
            },
            currentPage
        };
    }

    _getSearchParam() {
        const search = getQueryParam('search', location);
        return search ? decodeURIComponent(search) : '';
    }

    _updateBreadcrumbs() {
        const {blogCategory = {}, updateBreadcrumbs} = this.props;
        const blogBreadcrumbs = [{
            name: __('Home'),
            url: '/'
        }];
        (blogCategory.breadcrumbs || []).forEach(({category_name, category_url_key}) => {
            blogBreadcrumbs.push({name: category_name, url: '/' + (category_url_key || 'blog')})
        });
        updateBreadcrumbs(blogBreadcrumbs.reverse());
    }

    _onCategoryUpdate() {
        this._updateBreadcrumbs();
    }

    getIsNewCategory() {
        const {blogCategory: {url_path} = {}} = this.props;
        if (!url_path) return true;
        return url_path.replace('blog', '') !== this._getCategoryUrlPath();
    }

    _getCategoryUrlPath() {
        const {location, match} = this.props;
        const path = getUrlParam(match, location);
        return path.indexOf('search') === 0 ? null : path;
    }

    render() {

        return (
            <MagefanBlogPageComponent
                {...this.props}
                {...this.containerFunctions}
                {...this.containerProps()}
            />
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MagefanBlogPageContainer));