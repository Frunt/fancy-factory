import {UPDATE_POST_DETAILS} from "Modules/MagefanBlog/store/post/post.action";

const initialState = {
    post: {}
};

const PostReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_POST_DETAILS:
            const {post} = action;
            return {
                ...state,
                post
            };
        default:
            return state;
    }

};

export default PostReducer;