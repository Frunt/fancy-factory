import {connect} from "react-redux";
import {oneOf, string} from "prop-types";
import {ProductListDispatcher} from "Store/ProductList";
import ProductCard from "Component/ProductCard";
import React from "react";
import TextPlaceholder from "Component/TextPlaceholder";
import './AdditionalTypeProducts.style';
import ContentWrapper from "Component/ContentWrapper";

class AdditionalTypeProductsContainer extends React.Component {
    static propTypes = {
        label: string,
        additionalType: oneOf([
            'new',
            'sale',
            'featured'
        ]).isRequired
    };

    componentDidMount() {
        const {requestProductList, additionalType} = this.props;
        const request = {
            additionalType,
            args: {
                filter: {sku: ''}
            }
        };
        if (additionalType !== 'featured') {
            request.args.additionalType = additionalType;
        } else {
            request.args.filter.is_featured = 1
        }
        requestProductList(request)
    }

    renderProduct = (product, index) => {
        return <ProductCard
            product={product}
            key={product.id || index}
            selectedFilters={{}}
            arePlaceholdersShown
        />
    };

    render() {
        const {additionalType, widget, label} = this.props;
        const placeholder = [{}, {}, {}, {}];
        return (
            <div block='AdditionalTypeProducts' elem={additionalType}>
                <ContentWrapper
                    mix={{block: 'AdditionalTypeProducts'}}
                    wrapperMix={{block: 'AdditionalTypeProducts', elem: 'Wrapper'}}
                    label={__('Additional Type Products')}
                >
                    <h2 block={'AdditionalTypeProducts'} elem={'Label'}><TextPlaceholder length={"short"}
                                                                                         content={label}/></h2>
                    <div block={'AdditionalTypeProducts'} elem={'Items'}>
                        {(widget[additionalType] || placeholder).map(this.renderProduct)}
                    </div>
                </ContentWrapper>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    widget: state.ProductListReducer.widget
});


export const mapDispatchToProps = dispatch => ({
    requestProductList: options => ProductListDispatcher.handleWidgetData(dispatch, options),
});
AdditionalTypeProductsContainer = connect(mapStateToProps, mapDispatchToProps)(AdditionalTypeProductsContainer);
export default AdditionalTypeProductsContainer