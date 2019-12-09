import QueryDispatcher from "Util/Request/QueryDispatcher";
import {updateNoMatch} from "Store/NoMatch";
import BlogListQuery from "Modules/MagefanBlog/store/blogList/blogList.query";
import {updatePostDetails} from "Modules/MagefanBlog/store/post/post.action";

export class PostDispatcher extends QueryDispatcher {
    constructor() {
        super('Posts');
    }

    onSuccess(data, dispatch) {
        const {blogSearch: {posts}} = data;
        if (!(posts && posts.length > 0)) return dispatch(updateNoMatch(true));

        return dispatch(updatePostDetails(posts[0]));

    }

    onError(_, dispatch) {
        dispatch(updateNoMatch(true));
    }

    prepareRequest(options) {
        return BlogListQuery.getQuery(options);
    }

}

export default new PostDispatcher();