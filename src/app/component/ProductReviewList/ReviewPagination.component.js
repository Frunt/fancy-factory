const ReviewPagination = (props) => {
    const {reviews, reviewByPage, currentPage, nextPage, prevPage} = props;
    if (!(reviews && reviews.length > reviewByPage)) return null;
    const getCurrentState = () => {
        const reviewCount = currentPage * reviewByPage;
        if (reviewCount > reviews.length) return reviews.length;
        return reviewCount
    };
    return (
        <div block="ReviewPagination">
            <span block="ReviewPagination" elem="Qty">{(getCurrentState()) + __(' of ') + reviews.length}</span>
            <div block="ReviewPagination" elem="Buttons">
                <div className="button-arrow-prev" onClick={() => prevPage()}>prev</div>
                <div className="button-arrow-next" onClick={() => nextPage()}>next</div>
            </div>
        </div>
    )
};

export default ReviewPagination;