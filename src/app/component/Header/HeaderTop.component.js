import React from "react";
import CmsBlock from "Component/CmsBlock";
import ContentWrapper from "Component/ContentWrapper";
import StoreSwitcher from "Component/StoreSwitcher";

export const HeaderTopComponent = ({hideTopMenu = false}) => {
    return <>
        <div block="Header" elem={'top'}>
            <ContentWrapper label={"Header top menu"}>
                <CmsBlock identifiers={['social-links']} blocks={['social-links']}/>
                {!hideTopMenu && <CmsBlock identifiers={['header-top-menu']} blocks={['header-top-menu']}/>}
                <StoreSwitcher/>
            </ContentWrapper>
        </div>
    </>
};

