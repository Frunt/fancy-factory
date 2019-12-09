import * as React from "react";
import {connect} from "react-redux";
import {toggleBreadcrumbs} from "Store/Breadcrumbs";
import MyAccountOverlay from "Component/MyAccountOverlay";

class LoginPageComponent extends React.Component {
    componentDidMount() {
        this.props.updateBreadcrumbs()
    }

    renderContent() {
        return <MyAccountOverlay isOverlayVisible={true}/>
    }

    render() {
        const isBreadcrumbsActive = false;
        const page_width = '';
        return <main
            block="CmsPage"
            mods={{isBreadcrumbsHidden: !isBreadcrumbsActive}}
        >
            <div block="CmsPage" elem="Wrapper" mods={{page_width}}>
                <div block="CmsPage" elem="Content">
                    {this.renderContent()}
                </div>
            </div>
        </main>
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    updateBreadcrumbs: () => dispatch(toggleBreadcrumbs(false))
});
const LoginPage = connect(mapStateToProps, mapDispatchToProps)(LoginPageComponent);
export default LoginPage