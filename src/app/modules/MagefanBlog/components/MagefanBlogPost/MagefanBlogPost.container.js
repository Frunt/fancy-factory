import {connect} from "react-redux";
import MagefanBlogPostComponent from "./MagefanBlogPost.component";
import {getUrlParam} from "Util/Url";
import {withRouter} from "react-router";
import PostDispatcher from "Modules/MagefanBlog/store/post/post.dispatcher";
import {BreadcrumbsDispatcher} from 'Store/Breadcrumbs';

const mapDispatchToProps = dispatch => ({
    requestPost: options => PostDispatcher.handleData(dispatch, options),
    updateBreadcrumbs: breadcrumbs => BreadcrumbsDispatcher.update(breadcrumbs, dispatch),
});

const mapStateToProps = state => ({
    post: state.PostReducer.post
});

class MagefanBlogPostContainer extends React.PureComponent {
    static defaultProps = {
        location: {state: {}},
        isOnlyPlaceholder: false
    };

    state = {};

    componentDidMount() {
        const {isOnlyPlaceholder} = this.props;
        if (!isOnlyPlaceholder) this._requestPost();
        this._onPostUpdate();
    }

    componentDidUpdate({location: {pathname: prevPathname}}) {
        const {location: {pathname}} = this.props;

        if (pathname !== prevPathname) this._requestProduct();
        this._onPostUpdate();
    }

    _getDataSource() {
        const {post, location: {state}} = this.props;
        const productIsLoaded = Object.keys(post).length > 0;
        const locationStateExists = state && Object.keys(state.post).length > 0;

        // return nothing, if no product in url state and no loaded product
        if (!locationStateExists && !productIsLoaded) return {};

        // use product from props, if product is loaded and state does not exist, or state product is equal loaded product
        const useLoadedProduct = productIsLoaded && (
            (locationStateExists && (post.post_id === state.post.post_id))
            || !locationStateExists
        );

        return useLoadedProduct ? post : state.post;
    }

    _onPostUpdate() {
        const dataSource = this._getDataSource();
        if (Object.keys(dataSource).length) {
            this._updateBreadcrumbs(dataSource);
        }
    }

    _requestPost() {
        const {requestPost, location, match} = this.props;
        const options = {
            isSinglePost: true,
            args: {
                filter: {
                    post_url: getUrlParam(match, location)
                }
            }
        };
        requestPost(options);
    }

    _updateBreadcrumbs({breadcrumbs}) {
        const {updateBreadcrumbs} = this.props;
        const postBreadcrumbs = [{
            name: __('Home'),
            url: '/'
        }];
        breadcrumbs.forEach(({category_name, category_url_key}) => {
            postBreadcrumbs.push({name: category_name, url: '/' + (category_url_key || 'blog')})
        });
        updateBreadcrumbs(postBreadcrumbs.reverse());
    }


    render() {
        return <MagefanBlogPostComponent
            {...this.props}
        />
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MagefanBlogPostContainer))