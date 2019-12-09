import {InstagramComponent} from "./Instagram.component";

const Instagram = (props) => {
    const params = {
        title: __('Subscribe to our instagram')
    };


    return <InstagramComponent
        {...props}
        {...params}
    />

};

Instagram.defaultProps = {
    slider: true,
    count: 6,
    settings: {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true
    }
};

export default Instagram