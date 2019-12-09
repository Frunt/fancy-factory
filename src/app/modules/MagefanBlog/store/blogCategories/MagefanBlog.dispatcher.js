import {QueryDispatcher} from 'Util/Request';
import {updateNoMatch} from "Store/NoMatch";
import {showNotification} from "Store/Notification";
import MagefanBlogCategoryQuery from 'Modules/MagefanBlog/store/blogCategories/MagefanBlog.query';
import {updateCurrentBlogCategory} from "Modules/MagefanBlog/store/blogCategories/MagefanBlog.actions";

class Magefan_BlogCategoryDispatcher extends QueryDispatcher {
    constructor() {
        super('BlogCategory');
    }

    onSuccess(data, dispatch, {isSearchPage}) {
        const {blogCategory = {}, blogCategory: {category_id}} = data;
        // if (!category_id && !isSearchPage) dispatch(updateNoMatch(true));
        dispatch(updateCurrentBlogCategory(blogCategory));
    }

    onError(error, dispatch, {isSearchPage}) {
        if (!isSearchPage) {
            dispatch(updateNoMatch(true));
            dispatch(showNotification('error', 'Error fetching Category!', error));
        } else {
            dispatch(updateCurrentBlogCategory({id: 'all-products'}));
        }
    }

    prepareRequest(options) {
        return MagefanBlogCategoryQuery.getQuery(options);
    }
}

export default new Magefan_BlogCategoryDispatcher()