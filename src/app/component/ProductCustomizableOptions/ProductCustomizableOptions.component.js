import ExpandableContent from "Component/ExpandableContent";
import ProductCustomizableOptionsValue from "Component/ProductCustomizableOptions/ProductCustomizableOptionsValue";

const renderAttributes = (attribute, handleOptionClick, customizable_options) => {
    const {attribute_value} = attribute;

    const isSelected = (value) => {
        return customizable_options[attribute.option_id].value_string === value.option_type_id
    };
    return <ProductCustomizableOptionsValue
        key={attribute_value.option_type_id}
        attribute={attribute}
        isSelected={isSelected(attribute_value)}
        isAvailable={true}
        onClick={handleOptionClick}
        getLink={() => {
        }}
    />
};

const renderOptions = (option, handleOptionClick, customizable_options, setCustomizableOptions) => {
    const {option_id, title, value} = option;
    option.attribute_options = value;
    if (!customizable_options[option_id]) {
        setCustomizableOptions({id: option_id, value_string: option.value[0].option_type_id});
    }
    return <ExpandableContent
        isContentExpanded={true}
        block="ProductConfigurableAttributes"
        closeOnClick={true}
        key={option_id}
        heading={title}
    >
        <div block="ProductConfigurableAttributes" elem="AttributesList">
            {value.map(attribute_value => renderAttributes({
                ...option,
                attribute_value
            }, handleOptionClick, customizable_options))}
        </div>
    </ExpandableContent>
};

const ProductCustomizableOptionsComponent = ({options, setCustomizableOptions, customizable_options}) => {
    if (!options) return null;
    const handleOptionClick = ({option_id, attribute_value: {option_type_id}}) => {
        setCustomizableOptions({id: option_id, value_string: option_type_id})
    };
    return <div className={'ProductActions-Attributes'}>{
        options.map(option => renderOptions(
            option,
            handleOptionClick,
            customizable_options,
            setCustomizableOptions
        ))
    }</div>
};

export {
    ProductCustomizableOptionsComponent
}