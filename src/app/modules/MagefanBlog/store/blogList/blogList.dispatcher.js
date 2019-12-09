import {showNotification} from "Store/Notification";
import {updateNoMatch} from "Store/NoMatch";
import {QueryDispatcher} from "Util/Request";
import {
    appendPage,
    updateBlogListItems,
    updateBlogLoadStatus
} from "Modules/MagefanBlog/store/blogList/blogList.action";
import BlogListQuery from "Modules/MagefanBlog/store/blogList/blogList.query";

class BlogListDispatcher extends QueryDispatcher {
    constructor() {
        super('BlogList');
    }

    onSuccess(data, dispatch, options) {
        const {
            blogSearch: {
                posts,
                totalCount,
            } = {}
        } = data;
        const {isNext, args: {currentPage: currentPageNext}, currentPage, isInfo} = options;

        const total_pages = Math.ceil(totalCount / 6);
        if (isNext) return dispatch(appendPage(posts, currentPage || currentPageNext));
        return dispatch(updateBlogListItems(posts, currentPage, totalCount, total_pages, isInfo));
    }

    onError(error, dispatch) {
        dispatch(showNotification('error', 'Error fetching Product List!', error));
        dispatch(updateNoMatch(true));
    }

    prepareRequest(options, dispatch) {
        const {isNext} = options;
        if (!isNext) dispatch(updateBlogLoadStatus(true));
        return BlogListQuery.getQuery(options);
    }
}

export default new BlogListDispatcher();