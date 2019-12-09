import {
    APPEND_BLOG_PAGE,
    UPDATE_BLOG_LIST_ITEMS,
    UPDATE_BLOG_LOAD_STATUS
} from "Modules/MagefanBlog/store/blogList/blogList.action";

export const initialState = {
    pages: {},
    totalItems: 0,
    totalPages: 0,
    isLoading: true
};

export const defaultConfig = {
    itemsPerPageCount: 12
};

const BlogListReducer = (state = initialState, action) => {
    const {
        type,
        posts: initialItems = [],
        total_pages: totalPages,
        total_count: totalItems,
        currentPage,
        isLoading
    } = action;
    switch (type) {
        case APPEND_BLOG_PAGE:
            console.log(action);
            return {
                ...state,
                pages: {
                    ...state.pages,
                    [currentPage]: initialItems
                }
            };

        case UPDATE_BLOG_LIST_ITEMS:
            return {
                ...state,
                isLoading: false,
                totalItems,
                totalPages,
                pages: { [currentPage]:initialItems }
            };

        case UPDATE_BLOG_LOAD_STATUS:
            return {
                ...state,
                isLoading
            };

        default:
            return state;
    }
};

export default BlogListReducer;