export const UPDATE_BLOG_LOAD_STATUS = 'UPDATE_BLOG_LOAD_STATUS';
export const APPEND_BLOG_PAGE = 'APPEND_BLOG_PAGE';
export const UPDATE_BLOG_LIST_ITEMS = 'UPDATE_BLOG_LIST_ITEMS';


export const appendPage = (posts, currentPage) => ({
    type: APPEND_BLOG_PAGE,
    posts,
    currentPage
});


export const updateBlogListItems = (posts, currentPage, total_count, total_pages, isInfo) => ({
    type: UPDATE_BLOG_LIST_ITEMS,
    posts,
    currentPage,
    total_pages,
    total_count,
    isInfo
});

/**
 * Update loading status
 * @param {Boolean} status Loading indication boolean
 * @return {void}
 */
export const updateBlogLoadStatus = status => ({
    type: UPDATE_BLOG_LOAD_STATUS,
    isLoading: status
});
