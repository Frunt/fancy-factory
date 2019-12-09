import {connect} from "react-redux";
import {useState} from "react";
import Slider from "react-slick";
import Image from "Component/Image";
import './Instagram.style';
import ContentWrapper from "Component/ContentWrapper";

const renderItem = (item) => {
    const {url, height, width} = item.images.low_resolution;
    return <div key={item.id}>
        <a href={item.link} title={item.user.username}>
            <Image src={url} alt={item.user.username}/>
        </a>
    </div>
};

const renderSlider = (items = [], settings) => {
    return <Slider
        {...settings}
    >
        {items.map(renderItem)}
    </Slider>
};

const renderList = (items = []) => {
    return items.map(renderItem)
};

let InstagramComponent = (props) => {
    const {
        instagram_info: {api_key, is_enabled},
        slider,
        count,
        settings,
        title
    } = props;
    if (!is_enabled) return null;
    const accessToken = api_key || '541000971.1677ed0.dead39f92d5043bdbc02fe258aedd717';
    const [{items}, setInstaItems] = useState({items: []});
    if (items.length === 0) {
        fetch('https://api.instagram.com/v1/users/self/media/recent/?access_token=' + accessToken + '&count=' + count)
            .then(res => res.json())
            .then(res => setInstaItems({items: res.data}));
    }
    return (
        <div block="Instagram"
        >
            <h3 block="Instagram" elem="Title">{title}</h3>
            {slider ? renderSlider(items, settings) : renderList(items)}
        </div>
    )
};

const mapStateToProps = (state) => ({
    instagram_info: state.ConfigReducer.instagram_info
});

InstagramComponent = connect(mapStateToProps)(InstagramComponent);
export {
    InstagramComponent
}