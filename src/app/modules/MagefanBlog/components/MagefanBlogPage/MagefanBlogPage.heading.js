import Field from "Component/Field";
import React, {useState} from "react";
import StoreSwitcher from "Component/StoreSwitcher";
import Form from "Component/Form";
import {setQueryParams} from "Util/Url";
import ContentWrapper from "Component/ContentWrapper";

const BlogCategories = ({blogCategory, history, location}) => {
    if (!blogCategory) return null;
    const categories = [];
    (blogCategory.children || []).forEach(category =>
        categories.push({label: category.title, value: category.url_path})
    );
    const getValue = () => {
        return location.pathname.substring(1)
    };
    if (categories.length === 0) return null;
    return <Field
        block="ProductSort"
        elem="Select"
        name={'blogCategory'}
        validation={['notEmpty']}
        onChange={e => history.push('/' + e)}
        value={getValue()}
        placeholder={__('Select category')}
        type="select"
        selectOptions={categories}
        id="blogCategory"
    />
};

const ClearFiltersButton = (history) => {
    return <button onClick={() => history.push('/blog')}>{__('Clear filters')}</button>
};

const BlogSort = (props) => {
    const {selectedSort, onSortChange, windowSize} = props;
    const options = [
        {label: __('New publications first'), value: 'DESC'},
        {label: __('Old publications first'), value: 'ASC'}
    ];
    return <Field
        block="BlogSort"
        elem="Select"
        name={'blogSort'}
        validation={['notEmpty']}
        onChange={e => onSortChange(e, selectedSort.sortKey)}
        value={(windowSize !== 'mobile') ? selectedSort.sortDirection : ''}
        placeholder={__('Sort')}
        type="select"
        selectOptions={options}
        id="blogSort"
    />
};

const BlogSearch = ({defaultSearch, location, history}) => {
    const [search, setSearch] = useState(defaultSearch);
    const onSubmit = () => {
        setQueryParams({search}, location, history);
    };
    console.log(search);
    return <Form
        onSubmitSuccess={onSubmit}
        id={'blogSearchForm'}
    >
        <Field
            id={'blogSearch'}
            value={defaultSearch ? search : ''}
            type={'text'}
            key={'ss'}
            onChange={setSearch}
            name={'blogSearch'}
            placeholder={__('Search...')}
        />
        <button type="submit">Submit</button>
    </Form>
};

export const MagefanBlogPageHeading = (props) => {
    const {blogCategory, history, selectedSort, onSortChange, search, location, windowSize} = props;
    return <div block="BlogPageHeading">
        <ContentWrapper
            wrapperMix={{block: 'BlogPageHeading', elem: 'Wrapper'}}
            label="Blog page heading"
        >
            <h1>{blogCategory.title}</h1>
            <div block="LanguageChanger" elem="Buttons"><StoreSwitcher/></div>
            <div block="BlogPageHeading" elem="Filters">
                <div block="BlogPageHeading" elem="Search">
                    <BlogSearch
                        location={location}
                        history={history}
                        defaultSearch={search}
                    />
                </div>
                <BlogSort
                    selectedSort={selectedSort}
                    onSortChange={onSortChange}
                    windowSize={windowSize}
                />
                <BlogCategories
                    blogCategory={blogCategory}
                    history={history}
                    location={location}
                />
                <div block="BlogPageHeading" elem="ClearFilters">
                    <ClearFiltersButton
                      {...history}
                    />
                </div>
            </div>
        </ContentWrapper>
    </div>
};