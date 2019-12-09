import {UPDATE_CURRENT_BLOG_CATEGORY} from "Modules/MagefanBlog/store/blogCategories/MagefanBlog.actions";

export const initialState = {
    blogCategory: {}
};

const MagefanBlogCategoryReducer = (state = initialState, { type, blogCategory }) => {
    switch (type) {
        case UPDATE_CURRENT_BLOG_CATEGORY:
            return {
                ...state,
                blogCategory
            };

        default:
            return state;
    }
};

export default MagefanBlogCategoryReducer;