import React, {Component} from 'react';
import TextPlaceholder from 'Component/TextPlaceholder';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {CategoryTreeType} from 'Type/Category';
import {getUrlParam} from 'Util/Url';
import './CategoriesList.style';
import {connect} from "react-redux";

/**
 * List of all categories and subcategories
 * @class CategoriesList
 */
class CategoriesList extends Component {
    state = {
        active: false,
        opened: []
    };

    renderCategoryLabel(label, link) {
        const {match: {path}} = this.props;
        return (
            <Link to={`${path}/${link}`} onClick={() => window.scrollTo(0, 0)}>
                {label}
            </Link>
        );
    }

    renderSubCategory({
                          id,
                          name,
                          url_path,
                          children
                      }) {
        const {location, match} = this.props;
        const {opened} = this.state;
        const currentPath = getUrlParam(match, location);
        const isSelected = (opened.includes(id) || currentPath === url_path);
        const isParentExpanded = (currentPath.indexOf(url_path) === 0) || opened.includes(id);

        return (
            <li
                block="CategoriesList"
                elem="Category"
                key={id}
                mods={{isSelected}}
            >
                {this.renderCategoryLabel(name, url_path)}
                {(children && children.length > 0) && <div block="CategoriesList" elem="MenuToggler" onClick={() => this.handleMenuToggle(id)}/>}
                {isParentExpanded && children && (
                    <ul>
                        {children.map(child => this.renderSubCategory(child))}
                    </ul>
                )}
            </li>
        );
    }

    handleMenuToggle(id) {
        const {opened} = this.state;
        if (opened.indexOf(id) === -1) {
            opened.push(id)
        } else {
            const index = opened.indexOf(id);
            opened.splice(index, 1);
        }
        this.setState({opened})
    }

    renderCategories() {
        const {category: {children}} = this.props;

        if (!children || !children.length) return null;
        return (
            <ul
                block="CategoriesList"
                elem="Main"
            >
                {children.map(child => this.renderSubCategory(child))}
            </ul>
        );
    }

    render() {
        return (
            <div block="CategoriesList" className={this.state.active ? 'active' : ''}>
                <h4 onClick={() => this.setState({active: !this.state.active})}><TextPlaceholder
                    content={__('Categories')}/></h4>
                {this.renderCategories()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    category: state.ConfigReducer.category
});
CategoriesList.propTypes = {
    currentCategory: CategoryTreeType,
    match: PropTypes.shape({
        path: PropTypes.string.isRequired
    }).isRequired
};
CategoriesList = withRouter(connect(mapStateToProps)(CategoriesList));

export default CategoriesList;
