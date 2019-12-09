import {PureComponent} from "react";
import CategoryPagination from "Component/CategoryPagination";
import {MagefanBlogCardComponent} from "Modules/MagefanBlog/components/MagefanBlogCard/MagefanBlogCard.component";
import './MagefanBlogList.style';

export const observerThreshold = 10;

class MagefanBlogListComponent extends PureComponent {
    static defaultProps = {
        mix: {},
        title: '',
        isInfiniteLoaderEnabled: true,
        isPaginationEnabled: true,
        numberOfPlaceholders: 4,
        selectedFilters: {},
        isLoading: false,
        updatePage: () => {
        },
        totalPages: 1,
        loadPage: () => {
        },
        requestPage: () => {
        },
        loadPrevPage: () => {
        },
        currentPage: 1,
        isShowLoading: true,
        isVisible: true
    };
    nodes = {};

    observedNodes = [];

    pagesIntersecting = [];

    componentDidUpdate() {
        const {isInfiniteLoaderEnabled} = this.props;
        if (isInfiniteLoaderEnabled) this.observePageChange();
    }

    componentWillUnmount() {
        if (this.observer && this.observer.disconnect) this.observer.disconnect();
        this.observer = null;
    }

    observePageChange() {
        const {updatePage, isLoading} = this.props;
        if (isLoading) this.pagesIntersecting = [];

        if (!this.observer && 'IntersectionObserver' in window) {
            const threshold = this._getThreshold();

            this.observer = new IntersectionObserver((entries) => {
                const {currentPage} = this.props;

                entries.forEach(({target, isIntersecting}) => {
                    const page = +Object.keys(this.nodes).find(node => this.nodes[node] === target);
                    const index = this.pagesIntersecting.indexOf(page);

                    if (isIntersecting && index === -1) {
                        this.pagesIntersecting.push(page);
                    }

                    if (!isIntersecting && index > -1) {
                        this.pagesIntersecting.splice(index, 1);
                    }
                });

                const minPage = Math.min(...this.pagesIntersecting);
                if (minPage < Infinity && minPage !== currentPage) updatePage(minPage);
            }, {
                rootMargin: '0px',
                threshold
            });
        }

        this.updateObserver();
    }

    updateObserver() {
        const currentNodes = Object.values(this.nodes);

        if (!this.observer || currentNodes.length <= 0) return;

        currentNodes.forEach((node) => {
            if (node && !this.observedNodes.includes(node)) {
                this.observer.observe(node);
                this.observedNodes.push(node);
            }
        });

        this.observedNodes = this.observedNodes.reduce((acc, node) => {
            if (!currentNodes.includes(node)) {
                this.observer.unobserve(node);
            } else {
                acc.push(node);
            }

            return acc;
        }, []);
    }

    _getThreshold() {
        const hundredPercent = 100;

        return Array.from(
            {length: (hundredPercent / observerThreshold) + 1},
            (_, i) => i * (observerThreshold / hundredPercent)
        );
    }

    renderLoadButton() {
        const {isShowLoading, isInfiniteLoaderEnabled, loadPrevPage} = this.props;
        if (!isShowLoading || !isInfiniteLoaderEnabled) return null;

        return (
            <div
                block="BlogList"
                elem="LoadButton"
                role="button"
                tabIndex="0"
                onKeyUp={loadPrevPage}
                onClick={loadPrevPage}
            >
                {__('Show previous')}
            </div>
        );
    }

    renderLoadButton2() {
        const {isShowLoading, isInfiniteLoaderEnabled, loadPage, totalPages, currentPage} = this.props;
        // if (!isShowLoading || !isInfiniteLoaderEnabled) return null;
        return (
          (totalPages !== currentPage) && <div
                block="BlogList"
                elem="LoadButton"
                role="button"
                tabIndex="0"
                onKeyUp={loadPage}
                onClick={loadPage}
            >
                {__('Show more')}
            </div>
        );
    }


    renderNoProducts() {
        return (
            <div
                block="BlogList"
                elem="ProductsMissing"
            >
                <h3>{__('Sorry, there were no articles found matching your request')}</h3>
                <p>{__('Please, try removing selected filters and try again!')}</p>
            </div>
        );
    }


    renderPages() {
        const {
            isLoading,
            pages,
            mix
        } = this.props;

        if (isLoading) return null;

        return Object.entries(pages).map(([pageNumber, posts = []]) => (
            <ul
                block="BlogList"
                elem="Page"
                mix={{...mix, elem: 'Page'}}
                key={pageNumber}
                ref={(node) => {
                    this.nodes[pageNumber] = node;
                }}
            >
                {posts.map(post => (
                    <MagefanBlogCardComponent
                        post={post}
                        key={post.post_id}
                    />
                ))}
            </ul>
        ));
    }

    renderPagination() {
        const {
            isLoading,
            totalPages,
            requestPage,
            isPaginationEnabled
        } = this.props;

        if (!isPaginationEnabled) return null;

        return (
            <CategoryPagination
                isLoading={isLoading}
                totalPages={totalPages}
                onPageSelect={requestPage}
            />
        );
    }

    renderTitle() {
        const {title} = this.props;
        if (!title) return null;

        return <h2>{title}</h2>;
    }

    render() {
        const {totalPages, isLoading, mix} = this.props;

        if (!isLoading && totalPages === 0) return this.renderNoProducts();

        return (
            <div
                block="BlogList"
                mods={{isLoading}}
                mix={mix}
            >
                {this.renderTitle()}
                {this.renderLoadButton()}
                {this.renderPages()}
                {this.renderPagination()}
                {this.renderLoadButton2()}
            </div>
        );
    }
}

export default MagefanBlogListComponent;
