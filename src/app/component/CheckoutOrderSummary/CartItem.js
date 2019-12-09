import Loader from "Component/Loader";
import CartItem from "Component/CartItem/CartItem.component";
import Link from "Component/Link";

class CheckoutCartItemComponent extends CartItem {
    renderContent() {
        const {
            linkTo,
            item: {
                product: {
                    name
                }
            }
        } = this.props;

        const renderItem = () => <figure
            block="CartItem"
            elem="Content"
        >
            {this.renderImage()}
            <figcaption
                block="CartItem"
                elem="Description"
            >
                <p
                    block="CartItem"
                    elem="Heading"
                    itemProp="name"
                >
                    {name}
                </p>
            </figcaption>
        </figure>

        return (
            linkTo ? <Link to={linkTo} block="CartItem" elem="Link">
                {renderItem()}
            </Link> : <div block="CartItem" elem="Link">
                {renderItem()}
            </div>
        );
    }

    render() {
        const {isLoading} = this.props;

        return (
            <li
                block="CartItem"
                itemScope
                itemType="https://schema.org/Product"
            >
                <Loader isLoading={isLoading || false}/>
                {this.renderContent()}
            </li>
        );
    }
}

export class CheckoutCartItem extends React.Component {
    containerProps = () => ({
        thumbnail: this._getProductThumbnail()
    });

    _getVariantIndex() {
        const {
            item: {
                sku: itemSku,
                product: {variants = []}
            }
        } = this.props;

        return variants.findIndex(({sku}) => sku === itemSku);
    }

    getCurrentProduct() {
        const {item: {product}} = this.props;
        const variantIndex = this._getVariantIndex();

        return variantIndex < 0
            ? product
            : product.variants[variantIndex];
    }

    _getProductThumbnail() {
        const product = this.getCurrentProduct();
        const {thumbnail: {path: thumbnail} = {}} = product;

        return thumbnail
            ? `/media/catalog/product${thumbnail}`
            : '';
    }

    render() {
        return <CheckoutCartItemComponent
            {...this.props}
            {...this.containerProps()}
        />
    }
}