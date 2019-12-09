import ProductAttributeValue from "Component/ProductAttributeValue";

class ProductCustomizableOptionsValue extends ProductAttributeValue {
    getOptionLabel(value) {
        const {attribute: {attribute_options}} = this.props;
        if (attribute_options) {
            const optionValues = attribute_options.filter(a => a.option_type_id === value.option_type_id);
            if (optionValues.length > 0) return optionValues[0];
        }

        return {};
    }

    renderSelectAttribute() {
        const {attribute: {attribute_value}} = this.props;
        const attributeOption = this.getOptionLabel(attribute_value);
        const {title} = attributeOption;
        return this.renderStringValue(title || __('N/A'));
    }

    renderAttributeByType() {
        const {attribute: {__typename}} = this.props;

        switch (__typename) {
            case 'CustomizableDropDownOption':
            case 'CustomizableCheckboxOption':
                return this.renderSelectAttribute();
            case 'boolean':
                return this.renderBooleanAttribute();
            case 'text':
                return this.renderTextAttribute();
            case 'multiselect':
                return this.renderMultiSelectAttribute();
            default:
                return this.renderPlaceholder();
        }
    }
}

export default ProductCustomizableOptionsValue