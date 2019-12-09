import ProductConfigurableAttributes
    from "Component/ProductConfigurableAttributes/ProductConfigurableAttributes.component";
import ExpandableContent from "Component/ExpandableContent";
import TextPlaceholder from "Component/TextPlaceholder";

export default class ProductPageConfigurableAttributesComponent extends ProductConfigurableAttributes {
    renderConfigurableAttributes() {
        const {configurable_options, isProductCard} = this.props;
        return Object.values(configurable_options).map((option) => {
            const {attribute_values, attribute_label, attribute_code} = option;
            return isProductCard ? (
                <div block="ProductConfigurableAttributes" elem="Content" key={attribute_code}>
                    <h5 className="subtitle">{attribute_label}</h5>
                    <div block="ProductConfigurableAttributes" elem="AttributesList" mods={{type: attribute_code}}>
                        {attribute_values.map(attribute_value => (
                            this.renderConfigurableAttributeValue({...option, attribute_value})
                        ))}
                    </div>
                </div>
            ) : (
                <ExpandableContent
                    isContentExpanded={true}
                    block="ProductConfigurableAttributes"
                    closeOnClick={true}
                    key={attribute_code}
                    heading={attribute_label}
                >
                    <div block="ProductConfigurableAttributes" elem="AttributesList" mods={{type: attribute_code}}>
                        {attribute_values.map(attribute_value => (
                            this.renderConfigurableAttributeValue({...option, attribute_value})
                        ))}
                    </div>
                </ExpandableContent>
            );
        });
    }

    renderPlaceholders() {
        const {numberOfPlaceholders, isProductCard} = this.props;

        return isProductCard ? (numberOfPlaceholders.map((length, i) => (
            <div block="ProductConfigurableAttributes" elem="Content" key={i}>
                <h5 className="subtitle"><TextPlaceholder length={"short"}/></h5>
                <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    block="ProductConfigurableAttributes"
                    elem="AttributesList"
                >
                    {Array.from({length}, (_, i) => (
                        <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            block="ProductConfigurableAttributes"
                            elem="Placeholder"
                        />
                    ))}
                </div>
            </div>
        ))) : (numberOfPlaceholders.map((length, i) => (
            <ExpandableContent
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                mix={{block: 'ProductConfigurableAttributes'}}
                isContentExpanded={true}
            >
                <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    block="ProductConfigurableAttributes"
                    elem="AttributesList"
                >
                    {Array.from({length}, (_, i) => (
                        <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            block="ProductConfigurableAttributes"
                            elem="Placeholder"
                        />
                    ))}
                </div>
            </ExpandableContent>
        )));
    }

    renderAttributes() {
        return (
            <>
                {this.renderConfigurableAttributes()}
            </>
        )
    }
}

