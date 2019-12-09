import TextPlaceholder from "Component/TextPlaceholder";
import Html from "Component/Html";

const renderBanner = ({attribute_value, attribute_code}) => {
    return attribute_value ? <div
        className={attribute_code}
    >
        <Html content={attribute_value}/>
    </div> : null
};
const ProductBannersComponent = ({attributes}) => {
    if (!attributes) return <>
        <TextPlaceholder length={"block"}/>
        <TextPlaceholder length={"paragraph"}/>
    </>;
    if (attributes.hasOwnProperty('top_banner')) {
        renderBanner(attributes.top_banner)
    }


    return <>
        {attributes.hasOwnProperty('top_baner') && renderBanner(attributes.top_baner)}
        {attributes.hasOwnProperty('top_description') && renderBanner(attributes.top_description)}
    </>
};

export {ProductBannersComponent}