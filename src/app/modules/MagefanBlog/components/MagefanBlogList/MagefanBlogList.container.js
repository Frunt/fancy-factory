import React, {PureComponent} from "react";
import {getQueryParam, setQueryParams} from "Util/Url";
import MagefanBlogListComponent from "Modules/MagefanBlog/components/MagefanBlogList/MagefanBlogList.component";
import BlogListDispatcher from 'Modules/MagefanBlog/store/blogList/blogList.dispatcher';
import {connect} from "react-redux";
import {updateBlogLoadStatus} from "Modules/MagefanBlog/store/blogList/blogList.action";
import {withRouter} from "react-router";

export const mapStateToProps = state => ({
    pages: state.BlogListReducer.pages,
    isLoading: state.BlogListReducer.isLoading,
    totalItems: state.BlogListReducer.totalItems,
    totalPages: state.BlogListReducer.totalPages
});

export const mapDispatchToProps = dispatch => ({
    requestBlogList: options => BlogListDispatcher.handleData(dispatch, options),
    updateLoadStatus: isLoading => dispatch(updateBlogLoadStatus(isLoading))
});

class MagefanBlogListContainer extends PureComponent {
    static defaultProps = {
        pageSize: 6,
        filter: {},
        search: '',
        selectedFilters: {},
        sort: undefined,
        isPaginationEnabled: true,
        isInfiniteLoaderEnabled: true
    };

    state = {pagesCount: 1};

    containerFunctions = {
        loadPrevPage: this.loadPage.bind(this, false),
        loadPage: this.loadPage.bind(this),
        updatePage: this.updatePage.bind(this),
        requestPage: this.requestPage.bind(this)
    };

    componentDidMount() {
        const {pages, getIsNewCategory} = this.props;
        const {pagesCount} = this.state;
        const pagesLength = Object.keys(pages).length;
        if (pagesCount !== pagesLength) {
            this.setState({pagesCount: pagesLength});
        }
        // Is true when category is changed. This check prevents making new requests when navigating back to PLP from PDP
        if (getIsNewCategory()) {
            this.requestPage(this._getPageFromUrl());
        }
    }

    componentDidUpdate(prevProps) {
        const {sort, search, filter} = this.props;
        const {sort: prevSort, search: prevSearch, filter: prevFilter} = prevProps;
        if (search !== prevSearch
            || JSON.stringify(sort) !== JSON.stringify(prevSort)
            || JSON.stringify(filter) !== JSON.stringify(prevFilter)
        ) this.requestPage(this._getPageFromUrl());
    }

    containerProps = () => ({
        currentPage: this._getPageFromUrl(),
        isShowLoading: this._isShowLoading(),
        isVisible: this._isVisible()
    });

    _getPageFromUrl() {
        const {location} = this.props;
        return +(getQueryParam('page', location) || 1);
    }

    _getPagesBounds() {
        const {pages, totalItems, pageSize} = this.props;
        const keys = Object.keys(pages);
        return {
            maxPage: Math.max(...keys),
            minPage: Math.min(...keys),
            totalPages: Math.ceil(totalItems / pageSize),
            loadedPagesCount: keys.length
        };
    }

    _isShowLoading() {
        const {isLoading} = this.props;
        const {minPage} = this._getPagesBounds();
        return minPage > 1 && !isLoading;
    }

    _isVisible() {
        const {maxPage, totalPages} = this._getPagesBounds();
        return maxPage < totalPages;
    }

    loadPage(next = true) {
        const {pagesCount} = this.state;
        const {isLoading} = this.props;
        const {
            minPage,
            maxPage,
            totalPages,
            loadedPagesCount
        } = this._getPagesBounds();
        const isUpdatable = totalPages > 0;
        const shouldUpdateList = next ? maxPage < totalPages : minPage > 1;
        if (isUpdatable && shouldUpdateList && !isLoading) {
            this.setState({pagesCount: pagesCount + 1});
            this.requestPage(next ? maxPage + 1 : minPage - 1, true);
        }
    }

    updatePage(pageNumber) {
        const {location, history} = this.props;

        setQueryParams({
            page: pageNumber === 1 ? '' : pageNumber
        }, location, history);
    }

    requestPage(currentPage = 1, isNext = false) {
        const {
            sort,
            search,
            filter,
            pageSize,
            requestBlogList
        } = this.props;

        if (!isNext) window.scrollTo(0, 0);

        const options = {
            isNext,
            args: {
                sort,
                filter,
                query: search,
                pageSize,
                currentPage
            }
        };

        requestBlogList(options);
    }

    render() {
        return (
            <MagefanBlogListComponent
                {...this.props}
                {...this.containerFunctions}
                {...this.containerProps()}
            />
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MagefanBlogListContainer))