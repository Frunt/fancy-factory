import React from "react";
import MagefanBlogListContainer from 'Modules/MagefanBlog/components/MagefanBlogList/MagefanBlogList.container';
import Meta from "Component/Meta";
import ContentWrapper from "Component/ContentWrapper";
import './MagefanBlogPage.style';
import {MagefanBlogPageHeading} from "Modules/MagefanBlog/components/MagefanBlogPage/MagefanBlogPage.heading";

class MagefanBlogPageComponent extends React.PureComponent {
    renderCategoryBlogList() {
        const {
            search,
            selectedSort,
            getIsNewCategory
        } = this.props;
        return (
            <MagefanBlogListContainer
                search={search}
                sort={selectedSort}
                getIsNewCategory={getIsNewCategory}
            />
        );
    }

    renderBlogHeading() {
        return <MagefanBlogPageHeading
            {...this.props}
        />
    }

    render() {
        const {blogCategory} = this.props;
        return (
            <main block="BlogPage">
                {this.renderBlogHeading()}
                <ContentWrapper
                    wrapperMix={{block: 'BlogPage', elem: 'Wrapper'}}
                    label="Blog page"
                >
                    <Meta metaObject={blogCategory}/>
                    {this.renderCategoryBlogList()}
                </ContentWrapper>
            </main>
        )
    }
}

export default MagefanBlogPageComponent;