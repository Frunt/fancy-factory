export const UPDATE_CURRENT_BLOG_CATEGORY = 'UPDATE_CURRENT_BLOG_CATEGORY';

/**
 * Update Current Category
 * @return {void}
 * @param blogCategory
 */
export const updateCurrentBlogCategory = blogCategory => ({
    type: UPDATE_CURRENT_BLOG_CATEGORY,
    blogCategory
});
