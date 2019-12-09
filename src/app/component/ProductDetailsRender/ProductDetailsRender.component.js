import TextPlaceholder from "Component/TextPlaceholder";

const excludeConfigurableOptions = (attributes, configurable_options) => {
    if(!configurable_options) return Object.values(attributes)
    Object.keys(configurable_options).forEach(key => {
        delete attributes[key]
    });
    return Object.values(attributes)
};

const attrRender = ({attribute_code, attribute_value, attribute_label, attribute_options}) => {
    const label = attribute_options[attribute_value];
    if (!label) return null;
    return <div key={attribute_code}><span>{attribute_label} :</span> {label.label}</div>
};

const ProductDetailsRender = ({product: {attributes, configurable_options}, product, loaded}) => {
    if (!loaded || Object.keys(product).length === 0) return <TextPlaceholder length={"block"}/>;
    const attr = excludeConfigurableOptions(attributes, configurable_options);
    return <div className="ProductCharacteristics">
        {attr.map(attribute => attrRender(attribute))}
    </div>
};

export default ProductDetailsRender