import {connect} from "react-redux";
import React from "react";
import {CmsPageContainer} from "Route/CmsPage/CmsPage.container";
import CmsPage from "Route/CmsPage/CmsPage.component";
import Html from "Component/Html";
import {CmsPageDispatcher, updateCmsPage} from "Store/CmsPage";
import {BreadcrumbsDispatcher, toggleBreadcrumbs} from "Store/Breadcrumbs";
import {changeHeaderState} from "Store/Header";
import MenuOverlay from "Component/MenuOverlay";
import HomeSlider from 'Component/SliderWidget';
import './HomePage.style'
import SubscribeWidget from "Component/SubscribeWidget";
import AdditionalTypeProducts from "Modules/additionalTypeProducts";
import Instagram from "Modules/Instagram";
import TextPlaceholder from "Component/TextPlaceholder";
import ContentWrapper from "Component/ContentWrapper";

class HomePageComponent extends CmsPage {
    renderContent() {
        const {isLoading, page: {content}} = this.props;

        if (!isLoading && !content) return null;

        if (!content) {
            return (
                <>
                    <div block="CmsPage" elem="SectionPlaceholder"/>
                    <div block="CmsPage" elem="SectionPlaceholder"/>
                    <div block="CmsPage" elem="SectionPlaceholder"/>
                </>
            );
        }

        return <>
            {this.renderAdditionalContent()}
            <Html content={content}/>
            <SubscribeWidget/>
        </>;
    }

    renderAdditionalContent = () => {
        const {windowSize} = this.props;

        return <>
            <div block={"TopScreen"}>
                {(windowSize === 'desktop') && <MenuOverlay menu={'menu-main'}/>}
                <HomeSlider sliderId={1}/>
            </div>
            <ContentWrapper
                mix={{block: 'BrandsSlider'}}
                wrapperMix={{block: 'BrandsSlider', elem: 'Wrapper'}}
                label={__('Brands slider')}
            >
                <h2>{__("Brands")}</h2>
                <HomeSlider sliderId={2}/>
            </ContentWrapper>
            <AdditionalTypeProducts additionalType={'new'} label={__('New Products')}/>
            <AdditionalTypeProducts additionalType={"featured"} label={__('Featured Products')}/>
            <AdditionalTypeProducts additionalType={"sale"} label={__('Sale Products')}/>
            <Instagram slider={true}/>
        </>
    }
}


class HomePageContainer extends CmsPageContainer {
    render() {
        this.props.page.content_heading = false;
        return (
            <HomePageComponent
                {...this.props}
                isBreadcrumbsActive={false}
            />
        );
    }
}

const mapStateToProps = state => ({
    urlKey: state.ConfigReducer.cms_home_page,
    page: state.CmsPageReducer.page,
    isLoading: state.CmsPageReducer.isLoading,
    windowSize: state.ResizeReducer.windowSize
});

const mapDispatchToProps = dispatch => ({
    requestPage: options => CmsPageDispatcher.handleData(dispatch, options),
    updateBreadcrumbs: () => dispatch(toggleBreadcrumbs(false)),
    setHeaderState: stateName => dispatch(changeHeaderState(stateName)),
    updateCmsPage: (...[cmsPage, isLoading]) => dispatch(updateCmsPage(cmsPage, isLoading)),
    toggleBreadcrumbs: (isActive) => {
        BreadcrumbsDispatcher.update([], dispatch);
        dispatch(toggleBreadcrumbs(isActive));
    }
});

mapDispatchToProps.updateBreadcrumbs = () => dispatch(toggleBreadcrumbs(false));
HomePageContainer = connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);
export {HomePageContainer}